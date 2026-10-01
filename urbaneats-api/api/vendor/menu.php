<?php
/**
 * UrbanEats Vendor API — GET, POST, PUT, DELETE /vendor/menu.php
 *
 * Manages food items for the vendor's restaurant. Includes image_url support.
 *
 * Method:  GET | POST | PUT | DELETE
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session (role = 'vendor' & application_status = 'APPROVED').
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$pdo    = getDBConnection();

// Verify role = 'vendor' and application_status = 'APPROVED'
$userStmt = $pdo->prepare("SELECT id, role, application_status FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$userRec = $userStmt->fetch();

if (!$userRec || strtolower($userRec['role']) !== 'vendor' || ($userRec['application_status'] ?? '') !== 'APPROVED') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Approved vendor account required.']);
    exit;
}

// Verify vendor's restaurant ID
$restStmt = $pdo->prepare("SELECT id FROM restaurants WHERE owner_id = :owner_id LIMIT 1");
$restStmt->execute([':owner_id' => $userId]);
$restaurant = $restStmt->fetch();

if (!$restaurant) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'No restaurant linked to this vendor.']);
    exit;
}

$restId = (int) $restaurant['id'];
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: Return food items ───────────────────────────────────────────────────
if ($method === 'GET') {
    $stmt = $pdo->prepare("
        SELECT
            fi.id,
            fi.restaurant_id,
            fi.category_id,
            fc.name AS category_name,
            fi.name,
            fi.slug,
            fi.description,
            fi.price,
            fi.image,
            fi.image_url,
            fi.option_groups,
            fi.is_available,
            fi.created_at
        FROM food_items fi
        LEFT JOIN food_categories fc ON fi.category_id = fc.id
        WHERE fi.restaurant_id = :rest_id
        ORDER BY fi.created_at DESC
    ");
    $stmt->execute([':rest_id' => $restId]);
    $items = $stmt->fetchAll();

    foreach ($items as &$item) {
        $item['id']            = (int) $item['id'];
        $item['restaurant_id'] = (int) $item['restaurant_id'];
        $item['category_id']   = $item['category_id'] ? (int) $item['category_id'] : null;
        $item['price']         = (float) $item['price'];
        $item['is_available']  = (int) $item['is_available'];
        if (!empty($item['option_groups'])) {
            $parsed = json_decode($item['option_groups'], true);
            $item['option_groups'] = (json_last_error() === JSON_ERROR_NONE) ? $parsed : null;
        } else {
            $item['option_groups'] = null;
        }
    }
    unset($item);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count'  => count($items),
        'data'   => $items,
    ]);
    exit;
}

// ── POST: Add a new food item ────────────────────────────────────────────────
if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);

    $name        = isset($body['name']) ? trim((string)$body['name']) : '';
    $description = isset($body['description']) ? trim((string)$body['description']) : '';
    $price       = isset($body['price']) ? filter_var($body['price'], FILTER_VALIDATE_FLOAT) : false;
    $categoryId  = isset($body['category_id']) ? (int)$body['category_id'] : 1;
    $image       = isset($body['image']) ? trim((string)$body['image']) : '';
    $imageUrl    = isset($body['image_url']) ? trim((string)$body['image_url']) : null;
    $isAvailable = isset($body['is_available']) ? ((int)$body['is_available'] ? 1 : 0) : 1;

    $optionGroupsJson = null;
    if (isset($body['option_groups'])) {
        $rawOpts = $body['option_groups'];
        if (is_array($rawOpts)) {
            $optionGroupsJson = json_encode($rawOpts);
        } elseif (is_string($rawOpts)) {
            $dec = json_decode($rawOpts, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($dec)) {
                $optionGroupsJson = json_encode($dec);
            }
        }
    }

    if (empty($name) || strlen($name) < 2) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Food item name is required (min 2 chars).']);
        exit;
    }

    if ($price === false || $price <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Valid positive price required.']);
        exit;
    }

    $slug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $name)) . '-' . time();

    $insertStmt = $pdo->prepare("
        INSERT INTO food_items (restaurant_id, category_id, name, slug, description, price, image, image_url, option_groups, is_available)
        VALUES (:rest_id, :cat_id, :name, :slug, :desc, :price, :image, :img_url, :opt_groups, :is_avail)
    ");
    $insertStmt->execute([
        ':rest_id'     => $restId,
        ':cat_id'      => $categoryId,
        ':name'        => $name,
        ':slug'        => $slug,
        ':desc'        => $description,
        ':price'       => $price,
        ':image'       => $image,
        ':img_url'     => $imageUrl,
        ':opt_groups'  => $optionGroupsJson,
        ':is_avail'    => $isAvailable,
    ]);

    $newItemId = (int)$pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Food item added successfully.',
        'data'    => [
            'id'            => $newItemId,
            'restaurant_id' => $restId,
            'name'          => $name,
            'price'         => $price,
            'image_url'     => $imageUrl,
            'option_groups' => $optionGroupsJson ? json_decode($optionGroupsJson, true) : null,
            'is_available'  => $isAvailable,
        ],
    ]);
    exit;
}

// ── PUT: Update existing food item ───────────────────────────────────────────
if ($method === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true);

    $itemId      = isset($body['id']) ? filter_var($body['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
    $name        = isset($body['name']) ? trim((string)$body['name']) : '';
    $description = isset($body['description']) ? trim((string)$body['description']) : '';
    $price       = isset($body['price']) ? filter_var($body['price'], FILTER_VALIDATE_FLOAT) : false;
    $categoryId  = isset($body['category_id']) ? (int)$body['category_id'] : null;
    $image       = isset($body['image']) ? trim((string)$body['image']) : null;
    $imageUrl    = isset($body['image_url']) ? trim((string)$body['image_url']) : null;
    $isAvailable = isset($body['is_available']) ? ((int)$body['is_available'] ? 1 : 0) : null;

    if ($itemId === false) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Food item ID is required.']);
        exit;
    }

    $chkStmt = $pdo->prepare("SELECT id FROM food_items WHERE id = :id AND restaurant_id = :rest_id LIMIT 1");
    $chkStmt->execute([':id' => $itemId, ':rest_id' => $restId]);
    if (!$chkStmt->fetch()) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Food item not found or access denied.']);
        exit;
    }

    $updateFields = [];
    $params       = [':id' => $itemId, ':rest_id' => $restId];

    if (!empty($name)) {
        $updateFields[] = "name = :name";
        $params[':name'] = $name;
    }
    if ($description !== null) {
        $updateFields[] = "description = :desc";
        $params[':desc'] = $description;
    }
    if ($price !== false && $price > 0) {
        $updateFields[] = "price = :price";
        $params[':price'] = $price;
    }
    if ($categoryId !== null) {
        $updateFields[] = "category_id = :cat_id";
        $params[':cat_id'] = $categoryId;
    }
    if ($image !== null) {
        $updateFields[] = "image = :image";
        $params[':image'] = $image;
    }
    if ($imageUrl !== null) {
        $updateFields[] = "image_url = :img_url";
        $params[':img_url'] = $imageUrl;
    }
    if ($isAvailable !== null) {
        $updateFields[] = "is_available = :is_avail";
        $params[':is_avail'] = $isAvailable;
    }
    if (isset($body['option_groups'])) {
        $rawOpts = $body['option_groups'];
        $optJson = null;
        if (is_array($rawOpts)) {
            $optJson = json_encode($rawOpts);
        } elseif (is_string($rawOpts)) {
            $dec = json_decode($rawOpts, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($dec)) {
                $optJson = json_encode($dec);
            }
        }
        $updateFields[] = "option_groups = :opt_groups";
        $params[':opt_groups'] = $optJson;
    }

    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'No valid fields provided to update.']);
        exit;
    }

    $sql = "UPDATE food_items SET " . implode(', ', $updateFields) . ", updated_at = NOW() WHERE id = :id AND restaurant_id = :rest_id";
    $upStmt = $pdo->prepare($sql);
    $upStmt->execute($params);

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Food item updated successfully.',
        'data'    => [
            'id'           => $itemId,
            'is_available' => $isAvailable,
            'image_url'    => $imageUrl,
        ],
    ]);
    exit;
}

// ── DELETE: Delete food item permanently ─────────────────────────────────────
if ($method === 'DELETE') {
    $itemId = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;

    if ($itemId === false) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Food item ID is required.']);
        exit;
    }

    $delStmt = $pdo->prepare("
        DELETE FROM food_items
        WHERE id = :id AND restaurant_id = :rest_id
    ");
    $delStmt->execute([':id' => $itemId, ':rest_id' => $restId]);

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Food item deleted successfully.',
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
