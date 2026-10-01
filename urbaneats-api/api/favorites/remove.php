<?php
/**
 * UrbanEats Favorites API — DELETE /favorites/remove.php
 *
 * Removes a food item from the authenticated customer's favorites.
 *
 * Method:  DELETE
 * Body:    { "food_item_id": <int> }
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *          Unauthenticated requests are rejected with HTTP 401.
 * Returns: JSON with status.
 *
 * SECURITY:
 *   - Never trusts a frontend-supplied user_id for ownership.
 *   - Uses $_SESSION['user_id'] in the WHERE clause so users can ONLY delete their OWN favorites.
 *   - Uses PDO prepared statements throughout.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

    // WHERE clause includes BOTH user_id AND food_item_id.
    // This guarantees users can only delete their OWN favorites — never another user's record.
    $stmt = $pdo->prepare("
        DELETE FROM favorites
        WHERE user_id = :user_id AND food_item_id = :food_item_id
    ");
    $stmt->execute([
        ':user_id'      => $userId,
        ':food_item_id' => $foodItemId,
    ]);

    $deleted = $stmt->rowCount() > 0;

    http_response_code(200);
    echo json_encode([
        'status'       => 'success',
        'deleted'      => $deleted,
        'message'      => $deleted
            ? 'Removed from favorites.'
            : 'Favorite not found (already removed).',
        'food_item_id' => $foodItemId,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to remove favorite. Please try again.']);
}
