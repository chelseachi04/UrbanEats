<?php
/**
 * UrbanEats Favorites API — POST /favorites/add.php
 *
 * Adds a food item to the authenticated customer's favorites.
 *
 * Method:  POST
 * Body:    { "food_item_id": <int> }
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *          Unauthenticated requests are rejected with HTTP 401.
 * Returns: JSON with status and the new favorite record.
 *
 * SECURITY:
 *   - Never trusts a frontend-supplied user_id for ownership.
 *   - Uses $_SESSION['user_id'] exclusively to identify the authenticated caller.
 *   - UNIQUE constraint on (user_id, food_item_id) prevents duplicate favorites.
 *   - Uses PDO prepared statements throughout.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

// --- Parse and validate request body ---
$body = json_decode(file_get_contents('php://input'), true);
$foodItemId = isset($body['food_item_id']) ? filter_var($body['food_item_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;

if ($foodItemId === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing food_item_id.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Verify the food item exists before inserting
    $check = $pdo->prepare("SELECT id FROM food_items WHERE id = :id LIMIT 1");
    $check->execute([':id' => $foodItemId]);
    if (!$check->fetch()) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Food item not found.']);
        exit;
    }

    // INSERT IGNORE silently skips if this (user_id, food_item_id) already exists
    // This is safe: duplicates are silently ignored, no error thrown.
    $stmt = $pdo->prepare("
        INSERT IGNORE INTO favorites (user_id, food_item_id)
        VALUES (:user_id, :food_item_id)
    ");
    $stmt->execute([
        ':user_id'      => $userId,
        ':food_item_id' => $foodItemId,
    ]);

    $wasInserted = $stmt->rowCount() > 0;

    http_response_code(200);
    echo json_encode([
        'status'       => 'success',
        'inserted'     => $wasInserted,
        'message'      => $wasInserted
            ? 'Added to favorites.'
            : 'Already in favorites.',
        'food_item_id' => $foodItemId,
        'user_id'      => $userId,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to add favorite. Please try again.']);
}
