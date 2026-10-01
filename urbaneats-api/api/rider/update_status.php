<?php
/**
 * UrbanEats Rider API — POST /rider/update_status.php
 *
 * Updates status for the rider's active delivery:
 *   - 'PICKED_UP'         => Order picked up from restaurant
 *   - 'OUT_FOR_DELIVERY'  => Order in transit to customer (syncs orders.order_status = 'OUT_FOR_DELIVERY')
 *   - 'DELIVERED'         => Order delivered to customer (syncs orders.order_status = 'DELIVERED')
 *
 * Method:  POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    {
 *            "order_id": <int>,
 *            "status": "PICKED_UP" | "OUT_FOR_DELIVERY" | "DELIVERED"
 *          }
 *
 * SECURITY:
 *   - Strictly verifies delivery assignment belongs to $_SESSION['user_id'].
 *   - Rider CANNOT modify payment_status, total_amount, items, or delivery_address.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/notifications_helper.php';

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
$body   = json_decode(file_get_contents('php://input'), true);

$orderId = isset($body['order_id'])
    ? filter_var($body['order_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])
    : false;

$newStatus = isset($body['status']) ? strtoupper(trim((string)$body['status'])) : '';

$validStatuses = ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];

if ($orderId === false || !in_array($newStatus, $validStatuses)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid order_id and status (PICKED_UP, OUT_FOR_DELIVERY, DELIVERED) are required.']);
    exit;
}

$pdo = getDBConnection();

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
    // 1. Verify delivery assignment exists for this rider and order
    $assignStmt = $pdo->prepare("
        SELECT da.id, da.order_id, da.rider_id, da.status,
               o.order_number, o.user_id AS customer_id, o.restaurant_id, r.owner_id AS vendor_id
        FROM delivery_assignments da
        JOIN orders o ON da.order_id = o.id
        LEFT JOIN restaurants r ON o.restaurant_id = r.id
        WHERE da.order_id = :order_id AND da.rider_id = :rider_id
        LIMIT 1
    ");
    $assignStmt->execute([':order_id' => $orderId, ':rider_id' => $userId]);
    $assignment = $assignStmt->fetch();

    if (!$assignment) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Delivery assignment not found or access denied.']);
        exit;
    }

    $assignId     = (int)$assignment['id'];
    $customerId   = (int)$assignment['customer_id'];
    $vendorId     = (int)$assignment['vendor_id'];
    $orderNumber  = $assignment['order_number'];
    $restaurantId = (int)$assignment['restaurant_id'];

    // 2. Perform status updates
    if ($newStatus === 'PICKED_UP') {
        $upAssign = $pdo->prepare("
            UPDATE delivery_assignments
            SET status = 'PICKED_UP', picked_up_at = NOW(), updated_at = NOW()
            WHERE id = :id AND rider_id = :rider_id
        ");
        $upAssign->execute([':id' => $assignId, ':rider_id' => $userId]);

    } elseif ($newStatus === 'OUT_FOR_DELIVERY') {
        $pdo->beginTransaction();

        $upAssign = $pdo->prepare("
            UPDATE delivery_assignments
            SET status = 'OUT_FOR_DELIVERY', out_for_delivery_at = NOW(), updated_at = NOW()
            WHERE id = :id AND rider_id = :rider_id
        ");
        $upAssign->execute([':id' => $assignId, ':rider_id' => $userId]);

        // Sync customer single source of truth orders.order_status
        $upOrder = $pdo->prepare("
            UPDATE orders
            SET order_status = 'OUT_FOR_DELIVERY', updated_at = NOW()
            WHERE id = :order_id
        ");
        $upOrder->execute([':order_id' => $orderId]);

        // COMMIT before notifications (DDL inside transaction causes auto-commit)
        $pdo->commit();

        // Notifications for Customer & Vendor (non-fatal, after commit)
        try {
            createNotification(
                $pdo,
                $customerId,
                'OUT_FOR_DELIVERY',
                'Order On The Way!',
                "Your order #{$orderNumber} is out for delivery!",
                $orderId,
                $restaurantId,
                $assignId
            );
            if ($vendorId) {
                createNotification(
                    $pdo,
                    $vendorId,
                    'OUT_FOR_DELIVERY',
                    'Order Out for Delivery',
                    "Order #{$orderNumber} is now out for delivery.",
                    $orderId,
                    $restaurantId,
                    $assignId
                );
            }
        } catch (Throwable $notifEx) {
            error_log('[UrbanEats] Notification error (OUT_FOR_DELIVERY): ' . $notifEx->getMessage());
        }

    } elseif ($newStatus === 'DELIVERED') {
        $pdo->beginTransaction();

        $upAssign = $pdo->prepare("
            UPDATE delivery_assignments
            SET status = 'DELIVERED', delivered_at = NOW(), updated_at = NOW()
            WHERE id = :id AND rider_id = :rider_id
        ");
        $upAssign->execute([':id' => $assignId, ':rider_id' => $userId]);

        // Sync customer single source of truth orders.order_status
        $upOrder = $pdo->prepare("
            UPDATE orders
            SET order_status = 'DELIVERED', updated_at = NOW()
            WHERE id = :order_id
        ");
        $upOrder->execute([':order_id' => $orderId]);

        // COMMIT before notifications (DDL inside transaction causes auto-commit)
        $pdo->commit();

        // Notifications for Customer & Vendor (non-fatal, after commit)
        try {
            createNotification(
                $pdo,
                $customerId,
                'ORDER_DELIVERED',
                'Order Delivered!',
                'Your order has been received!',
                $orderId,
                $restaurantId,
                $assignId
            );
            if ($vendorId) {
                createNotification(
                    $pdo,
                    $vendorId,
                    'ORDER_DELIVERED',
                    'Order Delivered',
                    "Order #{$orderNumber} has been delivered successfully!",
                    $orderId,
                    $restaurantId,
                    $assignId
                );
            }
        } catch (Throwable $notifEx) {
            error_log('[UrbanEats] Notification error (DELIVERED): ' . $notifEx->getMessage());
        }
    }

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => "Delivery status updated to {$newStatus}.",
        'data'    => [
            'assignment_id' => $assignId,
            'order_id'      => $orderId,
            'status'        => $newStatus,
        ],
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to update delivery status. Please try again.']);
}
