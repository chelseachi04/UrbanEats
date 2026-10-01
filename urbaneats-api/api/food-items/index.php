<?php
/**
 * UrbanEats API — GET /food-items/index.php
 * Returns food items for a single restaurant (if ?restaurant_id=X is passed)
 * OR all food items across all active restaurants (if restaurant_id is omitted).
 *
 * Method:  GET
 * Params:  restaurant_id (integer, optional)
 * Returns: JSON array of food item objects with category name, restaurant info, & option_groups.
 * Auth:    Public
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$restaurantId = $_GET['restaurant_id'] ?? null;
if ($restaurantId !== null && $restaurantId !== '') {
    $restaurantId = filter_var($restaurantId, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($restaurantId === false) {
        http_response_code(400);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Invalid parameter: restaurant_id must be a positive integer.'
        ]);
        exit;
    }
} else {
    $restaurantId = null;
}

try {
    $pdo = getDBConnection();

    // Check optional columns in food_items table for maximum compatibility
    $existingCols = $pdo->query("SHOW COLUMNS FROM food_items")->fetchAll(PDO::FETCH_COLUMN);
    $hasOptionGroups = in_array('option_groups', $existingCols);
    $hasImageUrl = in_array('image_url', $existingCols);

    $optCol = $hasOptionGroups ? "fi.option_groups" : "NULL AS option_groups";
    $imgUrlCol = $hasImageUrl ? "fi.image_url" : "NULL AS image_url";

    if ($restaurantId !== null) {
        // Check restaurant exists and is active
        $checkStmt = $pdo->prepare("
            SELECT id, name FROM restaurants WHERE id = :id AND is_active = 1 LIMIT 1
        ");
        $checkStmt->execute([':id' => $restaurantId]);
        $rest = $checkStmt->fetch();
        if (!$rest) {
            http_response_code(404);
            echo json_encode([
                'status'  => 'error',
                'message' => 'Restaurant not found or inactive.'
            ]);
            exit;
        }

        // Fetch menu items for this restaurant
        $sql = "
            SELECT
                fi.id,
                fi.restaurant_id,
                fi.category_id,
                fc.name        AS category_name,
                fc.slug        AS category_slug,
                fi.name,
                fi.slug,
                fi.description,
                fi.price,
                fi.image,
                $imgUrlCol,
                $optCol,
                fi.is_available,
                fi.created_at,
                fi.updated_at,
                r.name         AS restaurant_name,
                r.slug         AS restaurant_slug,
                r.location     AS restaurant_address,
                r.location     AS restaurant_location,
                r.cover_image,
                r.cover_url,
                r.logo_image,
                r.logo_url
            FROM food_items fi
            LEFT JOIN food_categories fc ON fi.category_id = fc.id
            JOIN restaurants r ON fi.restaurant_id = r.id
            WHERE fi.restaurant_id = :restaurant_id
            ORDER BY fi.created_at DESC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':restaurant_id' => $restaurantId]);
    } else {
        // Fetch ALL food items from ALL active restaurants
        $sql = "
            SELECT
                fi.id,
                fi.restaurant_id,
                fi.category_id,
                fc.name        AS category_name,
                fc.slug        AS category_slug,
                fi.name,
                fi.slug,
                fi.description,
                fi.price,
                fi.image,
                $imgUrlCol,
                $optCol,
                fi.is_available,
                fi.created_at,
                fi.updated_at,
                r.name         AS restaurant_name,
                r.slug         AS restaurant_slug,
                r.location     AS restaurant_address,
                r.location     AS restaurant_location,
                r.cover_image,
                r.cover_url,
                r.logo_image,
                r.logo_url
            FROM food_items fi
            LEFT JOIN food_categories fc ON fi.category_id = fc.id
            JOIN restaurants r ON fi.restaurant_id = r.id
            WHERE r.is_active = 1
            ORDER BY fi.created_at DESC
        ";
        $stmt = $pdo->query($sql);
    }

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($items as &$item) {
        $item['id']            = (int) $item['id'];
        $item['restaurant_id'] = (int) $item['restaurant_id'];
        $item['category_id']   = $item['category_id'] !== null ? (int) $item['category_id'] : null;
        $item['price']         = (float) $item['price'];
        $item['is_available']  = (bool) $item['is_available'];
        if (!empty($item['option_groups'])) {
            $parsed = is_string($item['option_groups']) ? json_decode($item['option_groups'], true) : $item['option_groups'];
            $item['option_groups'] = (json_last_error() === JSON_ERROR_NONE && is_array($parsed)) ? $parsed : null;
        } else {
            $item['option_groups'] = null;
        }
    }
    unset($item);

    http_response_code(200);
    echo json_encode([
        'status'        => 'success',
        'restaurant_id' => $restaurantId,
        'count'         => count($items),
        'data'          => $items
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unable to retrieve menu items: ' . $e->getMessage()
    ]);
}
