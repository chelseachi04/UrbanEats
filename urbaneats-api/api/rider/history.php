<?php
/**
 * UrbanEats Rider API — GET /rider/history.php
 *
 * Retrieves completed and past delivery history for the authenticated rider.
 *
 * Method:  GET
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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

// Verify role = 'rider'
$userStmt = $pdo->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$userRec = $userStmt->fetch();

if (!$userRec || strtolower($userRec['role']) !== 'rider') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Rider account required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            da.id AS assignment_id,
            da.order_id,
            da.status AS delivery_status,
            da.accepted_at,
            da.picked_up_at,
            da.out_for_delivery_at,
            da.delivered_at,
            o.order_number,
            o.restaurant_name,
            o.recipient_name,
            o.recipient_phone,
            o.delivery_address,
            o.delivery_area,
            o.subtotal,
            o.delivery_fee,
            o.total_amount,
            o.payment_status
        FROM delivery_assignments da
        JOIN orders o ON da.order_id = o.id
        WHERE da.rider_id = :rider_id
          AND da.status IN ('DELIVERED', 'CANCELLED')
        ORDER BY da.delivered_at DESC, da.id DESC
    ");
    $stmt->execute([':rider_id' => $userId]);
    $history = $stmt->fetchAll();

    foreach ($history as &$h) {
        $h['assignment_id'] = (int) $h['assignment_id'];
        $h['order_id']      = (int) $h['order_id'];
        $h['subtotal']      = (float) $h['subtotal'];
        $h['delivery_fee']  = (float) $h['delivery_fee'];
        $h['total_amount']  = (float) $h['total_amount'];
    }
    unset($h);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count'  => count($history),
        'data'   => $history,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch delivery history.']);
}
