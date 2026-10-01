<?php
/**
 * UrbanEats Addresses API — DELETE/POST /addresses/delete.php
 *
 * Deletes a saved delivery address for the currently authenticated customer.
 *
 * Method:  DELETE | POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    { "id": <int> }
 *
 * SECURITY:
 *   - Ensures address belongs to the authenticated user (WHERE id = :id AND user_id = :user_id).
 *   - Prevents cross-user deletion.
 *   - Uses PDO prepared statements.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
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
$body = json_decode(file_get_contents('php://input'), true);

$addressId = isset($body['id']) ? filter_var($body['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;

if ($addressId === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid address ID is required.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Verify address exists and belongs to the authenticated user
    $checkStmt = $pdo->prepare("SELECT is_default FROM user_addresses WHERE id = :id AND user_id = :user_id LIMIT 1");
    $checkStmt->execute([':id' => $addressId, ':user_id' => $userId]);
    $existing = $checkStmt->fetch();

    if (!$existing) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Address not found or access denied.']);
        exit;
    }

    $wasDefault = (bool) $existing['is_default'];

    // Delete the address owned by this user
    $deleteStmt = $pdo->prepare("DELETE FROM user_addresses WHERE id = :id AND user_id = :user_id");
    $deleteStmt->execute([':id' => $addressId, ':user_id' => $userId]);

    // If the deleted address was default, set the newest remaining address as default
    if ($wasDefault) {
        $firstStmt = $pdo->prepare("SELECT id FROM user_addresses WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 1");
        $firstStmt->execute([':user_id' => $userId]);
        $nextId = $firstStmt->fetchColumn();
        if ($nextId) {
            $setDefStmt = $pdo->prepare("UPDATE user_addresses SET is_default = 1 WHERE id = :id");
            $setDefStmt->execute([':id' => $nextId]);
        }
    }

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Address deleted successfully.',
        'id'      => $addressId,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to delete address. Please try again.']);
}
