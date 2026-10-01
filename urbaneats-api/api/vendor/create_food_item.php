<?php
/**
 * UrbanEats Vendor API — POST /vendor/create_food_item.php
 *
 * Single-step food item creation with optional inline image upload.
 * Accepts multipart/form-data so image and metadata arrive in one request.
 *
 * Method:  POST (multipart/form-data)
 * Auth:    Required — role='vendor', application_status='APPROVED'
 * Fields:
 *   name         string  required
 *   price        float   required
 *   description  string  optional
 *   category_id  int     optional  (default 1)
 *   is_available int     optional  (default 1)
 *   image        file    optional  (JPEG/PNG/WebP, max 5 MB)
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

// Validate required fields from $_POST (multipart)
$name         = trim($_POST['name'] ?? '');
$description  = trim($_POST['description'] ?? '');
$price        = filter_var($_POST['price'] ?? '', FILTER_VALIDATE_FLOAT);
$categoryId   = isset($_POST['category_id']) ? (int) $_POST['category_id'] : 1;
$categoryName = trim($_POST['category_name'] ?? '');
$isAvailable  = isset($_POST['is_available']) ? ((int) $_POST['is_available'] ? 1 : 0) : 1;

if (!empty($categoryName)) {
    $catSlug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $categoryName));
    $catStmt = $pdo->prepare("SELECT id FROM food_categories WHERE name = :name OR slug = :slug LIMIT 1");
    $catStmt->execute([':name' => $categoryName, ':slug' => $catSlug]);
    $catRow = $catStmt->fetch();
    if ($catRow) {
        $categoryId = (int)$catRow['id'];
    } else {
        $insCat = $pdo->prepare("INSERT INTO food_categories (name, slug) VALUES (:name, :slug)");
        $insCat->execute([':name' => $categoryName, ':slug' => $catSlug]);
        $categoryId = (int)$pdo->lastInsertId();
    }
}

if (empty($name) || strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Food item name is required (minimum 2 characters).']);
    exit;
}

if ($price === false || $price <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid positive price is required.']);
    exit;
}

// Handle optional image upload
$imageUrl = null;

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

    $ext        = strtolower(pathinfo($fileName, PATHINFO_EXTENSION) ?: 'jpg');
    $uploadDir  = __DIR__ . '/../../uploads/food/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Will be renamed after we know the new item ID
    $tmpUniqueFile = 'tmp_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $tmpPath       = $uploadDir . $tmpUniqueFile;

    if (!move_uploaded_file($fileTmp, $tmpPath)) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save uploaded image.']);
        exit;
    }
}

// Handle optional option_groups
$optionGroupsJson = null;
if (isset($_POST['option_groups'])) {
    $rawOpts = $_POST['option_groups'];
    if (is_string($rawOpts)) {
        $decoded = json_decode($rawOpts, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $optionGroupsJson = json_encode($decoded);
        }
    } elseif (is_array($rawOpts)) {
        $optionGroupsJson = json_encode($rawOpts);
    }
}

// Insert the food item
$slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $name)) . '-' . time();

$insertStmt = $pdo->prepare("
    INSERT INTO food_items (restaurant_id, category_id, name, slug, description, price, option_groups, is_available, created_at, updated_at)
    VALUES (:rest_id, :cat_id, :name, :slug, :desc, :price, :opt_groups, :is_avail, NOW(), NOW())
");
$insertStmt->execute([
    ':rest_id'     => $restId,
    ':cat_id'      => $categoryId,
    ':name'        => $name,
    ':slug'        => $slug,
    ':desc'        => $description,
    ':price'       => $price,
    ':opt_groups'  => $optionGroupsJson,
    ':is_avail'    => $isAvailable,
]);

$newItemId = (int) $pdo->lastInsertId();

// Now rename the temp image using the real item ID and update DB
if (isset($tmpPath) && file_exists($tmpPath)) {
    $finalFileName = 'food_' . $newItemId . '_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $finalPath     = $uploadDir . $finalFileName;
    rename($tmpPath, $finalPath);
    $imageUrl = '/uploads/food/' . $finalFileName;

    $upImgStmt = $pdo->prepare("UPDATE food_items SET image_url = :url WHERE id = :id");
    $upImgStmt->execute([':url' => $imageUrl, ':id' => $newItemId]);
}

http_response_code(201);
echo json_encode([
    'status'  => 'success',
    'message' => 'Food item created successfully.',
    'data'    => [
        'id'            => $newItemId,
        'restaurant_id' => $restId,
        'name'          => $name,
        'price'         => $price,
        'description'   => $description,
        'option_groups' => $optionGroupsJson ? json_decode($optionGroupsJson, true) : null,
        'is_available'  => $isAvailable,
        'image_url'     => $imageUrl,
    ],
]);
