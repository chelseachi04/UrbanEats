<?php
/**
 * UrbanEats Favorites API — GET /favorites/index.php
 *
 * Returns all favorited food items for the currently authenticated customer.
 *
 * Method:  GET
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *          Unauthenticated requests are rejected with HTTP 401.
 * Returns: JSON array of food item objects (with restaurant name and category name).
 *
 * SECURITY:
 *   - Never trusts a frontend-supplied user_id.
 *   - Uses $_SESSION['user_id'] exclusively to identify the caller.
 *   - Uses PDO prepared statements throughout.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// --- Authentication Guard ---
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$userId = (int) $_SESSION['user_id'];

try {
    $pdo = getDBConnection();

    $stmt = $pdo->prepare("
        SELECT
            f.id            AS favorite_id,
            f.created_at    AS favorited_at,
            fi.id           AS food_item_id,
            fi.name         AS food_name,
            fi.slug         AS food_slug,
            fi.description  AS food_description,
            fi.price        AS food_price,
            fi.image        AS food_image,
            fi.is_available AS food_is_available,
            fc.name         AS category_name,
            fc.slug         AS category_slug,
            r.id            AS restaurant_id,
            r.name          AS restaurant_name,
            r.slug          AS restaurant_slug,
            r.location      AS restaurant_location
        FROM favorites f
        INNER JOIN food_items fi ON f.food_item_id = fi.id
        LEFT  JOIN food_categories fc ON fi.category_id = fc.id
        INNER JOIN restaurants r  ON fi.restaurant_id = r.id
        WHERE f.user_id = :user_id
        ORDER BY f.created_at DESC
    ");
    $stmt->execute([':user_id' => $userId]);
    $rows = $stmt->fetchAll();

    // Type casting for clean JSON
    foreach ($rows as &$row) {
        $row['favorite_id']      = (int) $row['favorite_id'];
        $row['food_item_id']     = (int) $row['food_item_id'];
        $row['food_price']       = (float) $row['food_price'];
        $row['food_is_available']= (bool) $row['food_is_available'];
        $row['restaurant_id']    = (int) $row['restaurant_id'];
    }
    unset($row);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count'  => count($rows),
        'data'   => $rows,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to retrieve favorites. Please try again.']);
}
