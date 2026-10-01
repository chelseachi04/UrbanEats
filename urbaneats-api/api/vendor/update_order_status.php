<?php
/**
 * UrbanEats Vendor API — POST /vendor/update_order_status.php
 *
 * Updates the order status for an order owned by the vendor's restaurant.
 *
 * Method:  POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    {
 *            "order_id": <int>,
 *            "order_status": "PROCESSING" | "READY_FOR_DELIVERY" | "OUT_FOR_DELIVERY" | "CANCELLED"
 *          }
 *
 * SECURITY:
 *   - Verifies vendor ownership (WHERE r.owner_id = $_SESSION['user_id']).
 *   - Vendor CANNOT manipulate payment_status (PAID / PENDING / FAILED).
 *   - Updates orders.order_status, which immediately updates customer tracking UI.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/notifications_helper.php';

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

$orderId     = isset($body['order_id']) ? filter_var($body['order_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
$orderStatus = isset($body['order_status']) ? strtoupper(trim((string)$body['order_status'])) : '';

$validStatuses = ['CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

if ($orderId === false || !in_array($orderStatus, $validStatuses)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid order_id and order_status are required.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Verify vendor owns the restaurant for this order
    $chkStmt = $pdo->prepare("
        SELECT o.id, o.order_number, o.order_status, o.payment_status, o.user_id AS customer_id, o.restaurant_id, r.name AS restaurant_name
        FROM orders o
        INNER JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.id = :order_id AND r.owner_id = :user_id
        LIMIT 1
    ");
    $chkStmt->execute([':order_id' => $orderId, ':user_id' => $userId]);
    $order = $chkStmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found or access denied.']);
        exit;
    }

    // Update order status only (do NOT alter payment_status)
    $updateStmt = $pdo->prepare("
        UPDATE orders
        SET order_status = :order_status, updated_at = NOW()
        WHERE id = :order_id
    ");
    $updateStmt->execute([
        ':order_status' => $orderStatus,
        ':order_id'     => $orderId,
    ]);

    // If READY_FOR_DELIVERY, notify eligible riders
    if ($orderStatus === 'READY_FOR_DELIVERY') {
        notifyEligibleRiders(
            $pdo,
            'READY_FOR_DELIVERY',
            'Delivery Job Available!',
            "Order #{$order['order_number']} from {$order['restaurant_name']} is ready for delivery pickup!",
            $orderId,
            $order['restaurant_id']
        );
    }

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => "Order #{$order['order_number']} status updated to {$orderStatus}.",
        'data'    => [
            'order_id'       => $orderId,
            'order_number'   => $order['order_number'],
            'order_status'   => $orderStatus,
            'payment_status' => $order['payment_status'],
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to update order status. Please try again.']);
}
