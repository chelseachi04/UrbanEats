<?php
/**
 * UrbanEats Vendor API — POST /vendor/update_food_item.php
 *
 * Single-step food item update with optional inline image replacement.
 * Accepts multipart/form-data.
 *
 * Method:  POST (multipart/form-data)
 * Auth:    Required — role='vendor', application_status='APPROVED'
 * Fields:
 *   id           int     required  (food item ID to update)
 *   name         string  optional
 *   price        float   optional
 *   description  string  optional
 *   category_id  int     optional
 *   is_available int     optional
 *   image        file    optional  (replaces existing image if provided)
 *
 * Returns: { status, data: { id, name, price, image_url, is_available } }
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$pdo    = getDBConnection();

// Verify vendor role and approval
$userStmt = $pdo->prepare("SELECT id, role, application_status FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$userRec = $userStmt->fetch();

if (!$userRec || strtolower($userRec['role']) !== 'vendor' || ($userRec['application_status'] ?? '') !== 'APPROVED') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Approved vendor account required.']);
    exit;
}

// Get vendor's restaurant
$restStmt = $pdo->prepare("SELECT id FROM restaurants WHERE owner_id = :owner_id LIMIT 1");
$restStmt->execute([':owner_id' => $userId]);
$restaurant = $restStmt->fetch();

if (!$restaurant) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'No restaurant linked to this vendor account.']);
    exit;
}

$restId = (int) $restaurant['id'];

// Validate item ID
$itemId = isset($_POST['id']) ? filter_var($_POST['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
if ($itemId === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid food item ID is required.']);
    exit;
}

// Verify the item belongs to this vendor's restaurant
$chkStmt = $pdo->prepare("SELECT id, image_url FROM food_items WHERE id = :id AND restaurant_id = :rest_id LIMIT 1");
$chkStmt->execute([':id' => $itemId, ':rest_id' => $restId]);
$existingItem = $chkStmt->fetch();

if (!$existingItem) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Food item not found or access denied.']);
    exit;
}

// Build update fields
$updateFields = ["updated_at = NOW()"];
$params       = [':id' => $itemId, ':rest_id' => $restId];

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
if (!empty($name)) {
    $updateFields[] = "name = :name";
    $params[':name'] = $name;
}

if (isset($_POST['description'])) {
    $updateFields[] = "description = :desc";
    $params[':desc'] = trim($_POST['description']);
}

if (isset($_POST['price'])) {
    $price = filter_var($_POST['price'], FILTER_VALIDATE_FLOAT);
    if ($price !== false && $price > 0) {
        $updateFields[] = "price = :price";
        $params[':price'] = $price;
    }
}

if (!empty($_POST['category_name'])) {
    $categoryName = trim($_POST['category_name']);
    $catSlug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $categoryName));
    $catStmt = $pdo->prepare("SELECT id FROM food_categories WHERE name = :name OR slug = :slug LIMIT 1");
    $catStmt->execute([':name' => $categoryName, ':slug' => $catSlug]);
    $catRow = $catStmt->fetch();
    if ($catRow) {
        $catId = (int)$catRow['id'];
    } else {
        $insCat = $pdo->prepare("INSERT INTO food_categories (name, slug) VALUES (:name, :slug)");
        $insCat->execute([':name' => $categoryName, ':slug' => $catSlug]);
        $catId = (int)$pdo->lastInsertId();
    }
    $updateFields[] = "category_id = :cat_id";
    $params[':cat_id'] = $catId;
} else if (isset($_POST['category_id'])) {
    $updateFields[] = "category_id = :cat_id";
    $params[':cat_id'] = (int) $_POST['category_id'];
}

if (isset($_POST['is_available'])) {
    $updateFields[] = "is_available = :is_avail";
    $params[':is_avail'] = (int) $_POST['is_available'] ? 1 : 0;
}

// Handle optional option_groups update
if (isset($_POST['option_groups'])) {
    $rawOpts = $_POST['option_groups'];
    $optionGroupsJson = null;
    if (is_string($rawOpts)) {
        $decoded = json_decode($rawOpts, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $optionGroupsJson = is_array($decoded) ? json_encode($decoded) : null;
        }
    } elseif (is_array($rawOpts)) {
        $optionGroupsJson = json_encode($rawOpts);
    }
    $updateFields[] = "option_groups = :opt_groups";
    $params[':opt_groups'] = $optionGroupsJson;
}

// Handle optional new image upload
$newImageUrl = $existingItem['image_url']; // Keep existing by default

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileTmp  = $_FILES['image']['tmp_name'];
    $fileSize = $_FILES['image']['size'];
    $fileName = $_FILES['image']['name'];

    if ($fileSize > 5 * 1024 * 1024) {
        http_response_code(422);
        echo json_encode(['status' => 'error', 'message' => 'Image file size exceeds 5MB limit.']);
        exit;
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = finfo_file($finfo, $fileTmp);
    finfo_close($finfo);

    $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($mime, $allowedMimes)) {
        http_response_code(422);
        echo json_encode(['status' => 'error', 'message' => 'Invalid image format. Allowed: JPG, PNG, WebP.']);
        exit;
    }

    $ext       = strtolower(pathinfo($fileName, PATHINFO_EXTENSION) ?: 'jpg');
    $uploadDir = __DIR__ . '/../../uploads/food/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $newFileName = 'food_' . $itemId . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $destPath    = $uploadDir . $newFileName;

    if (!move_uploaded_file($fileTmp, $destPath)) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save uploaded image.']);
        exit;
    }

    $newImageUrl    = '/uploads/food/' . $newFileName;
    $updateFields[] = "image_url = :img_url";
    $params[':img_url'] = $newImageUrl;
}

$sql    = "UPDATE food_items SET " . implode(', ', $updateFields) . " WHERE id = :id AND restaurant_id = :rest_id";
$upStmt = $pdo->prepare($sql);
$upStmt->execute($params);

http_response_code(200);
echo json_encode([
    'status'  => 'success',
    'message' => 'Food item updated successfully.',
    'data'    => [
        'id'            => $itemId,
        'is_available'  => $params[':is_avail'] ?? null,
        'image_url'     => $newImageUrl,
        'option_groups' => isset($params[':opt_groups']) ? ($params[':opt_groups'] ? json_decode($params[':opt_groups'], true) : null) : null,
    ],
]);
