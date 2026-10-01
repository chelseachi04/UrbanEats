<?php
/**
 * UrbanEats Orders API — POST /orders/restore.php
 *
 * Restores a soft-archived order back to active history.
 * Sets archived_at = NULL.
 *
 * Method:  POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    { "order_id": <int> }
 *
 * SECURITY:
 *   - Verifies order ownership (WHERE id = :order_id AND user_id = :user_id).
 *   - Never trusts frontend user_id.
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
$body   = json_decode(file_get_contents('php://input'), true);

$orderId = isset($body['order_id'])
    ? filter_var($body['order_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])
    : false;

if ($orderId === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid order_id is required.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Verify order exists and belongs strictly to session user
    $chkStmt = $pdo->prepare("SELECT id, order_number FROM orders WHERE id = :id AND user_id = :user_id LIMIT 1");
    $chkStmt->execute([':id' => $orderId, ':user_id' => $userId]);
    $order = $chkStmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found or access denied.']);
        exit;
    }

    // Restore order to active history
    $updateStmt = $pdo->prepare("UPDATE orders SET archived_at = NULL WHERE id = :id AND user_id = :user_id");
    $updateStmt->execute([':id' => $orderId, ':user_id' => $userId]);

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Order restored to active history.',
        'data'    => [
            'order_id'     => $orderId,
            'order_number' => $order['order_number'],
            'is_archived'  => false,
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to restore order. Please try again.']);
}
