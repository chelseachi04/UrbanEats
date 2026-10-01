<?php
/**
 * UrbanEats Orders API — POST /orders/verify_payment.php
 *
 * Verifies payment for an order and updates the order & payment status records in MySQL.
 *
 * FIX: Notifications are now sent AFTER the transaction commits, because MySQL
 * implicitly commits any open transaction when a DDL statement (CREATE TABLE)
 * is executed inside it. createNotification() calls ensureNotificationsTableExists()
 * which runs CREATE TABLE IF NOT EXISTS — this was silently committing the
 * transaction early and corrupting the sequence, causing a 500 error.
 *
 * Method:  POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    {
 *            "order_id": <int>,
 *            "tx_ref": <string>,
 *            "flw_ref": <string|null>,
 *            "status": "successful" | "failed" | "cancelled"
 *          }
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

$orderId = isset($body['order_id']) ? filter_var($body['order_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
$txRef   = isset($body['tx_ref'])   ? trim((string)$body['tx_ref']) : '';
$flwRef  = isset($body['flw_ref'])  ? trim((string)$body['flw_ref']) : null;
$status  = isset($body['status'])  ? strtolower(trim((string)$body['status'])) : '';

if ($orderId === false || empty($txRef)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Order ID and transaction reference (tx_ref) are required.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // 1. Fetch order record and verify ownership
    $orderStmt = $pdo->prepare("SELECT * FROM orders WHERE id = :id AND user_id = :user_id LIMIT 1");
    $orderStmt->execute([':id' => $orderId, ':user_id' => $userId]);
    $order = $orderStmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found or access denied.']);
        exit;
    }

    $isSuccessful     = ($status === 'successful' || $status === 'success' || $status === 'completed');
    $newPaymentStatus = $isSuccessful ? 'PAID' : ($status === 'cancelled' ? 'CANCELLED' : 'FAILED');
    $newOrderStatus   = $isSuccessful ? 'CONFIRMED' : ($status === 'cancelled' ? 'CANCELLED' : 'PENDING_PAYMENT');
    $payStatus        = $isSuccessful ? 'SUCCESSFUL' : ($status === 'cancelled' ? 'CANCELLED' : 'FAILED');

    // ── TRANSACTION: Only DML (UPDATE) — no DDL allowed inside ─────────────────
    $pdo->beginTransaction();

    // 2. Update orders table
    $updateOrder = $pdo->prepare("
        UPDATE orders
        SET
            payment_status    = :payment_status,
            order_status      = :order_status,
            payment_reference = :payment_reference
        WHERE id = :id AND user_id = :user_id
    ");
    $updateOrder->execute([
        ':payment_status'    => $newPaymentStatus,
        ':order_status'      => $newOrderStatus,
        ':payment_reference' => $txRef,
        ':id'                => $orderId,
        ':user_id'           => $userId,
    ]);

    // 3. Update payments table (match by order_id or tx_ref for robustness)
    $updatePayment = $pdo->prepare("
        UPDATE payments
        SET
            status       = :status,
            flw_ref      = :flw_ref,
            raw_response = :raw_response
        WHERE (order_id = :order_id OR tx_ref = :tx_ref) AND user_id = :user_id
    ");
    $updatePayment->execute([
        ':status'       => $payStatus,
        ':flw_ref'      => $flwRef,
        ':raw_response' => json_encode($body),
        ':order_id'     => $orderId,
        ':tx_ref'       => $txRef,
        ':user_id'      => $userId,
    ]);

    // ── COMMIT transaction before any DDL/notifications ────────────────────────
    $pdo->commit();

    // 4. AFTER commit: send notifications (createNotification may run DDL inside)
    if ($isSuccessful) {
        try {
            $vendorStmt = $pdo->prepare("SELECT owner_id FROM restaurants WHERE id = :rid LIMIT 1");
            $vendorStmt->execute([':rid' => $order['restaurant_id']]);
            $vendorOwnerId = $vendorStmt->fetchColumn();

            if ($vendorOwnerId) {
                createNotification(
                    $pdo,
                    $vendorOwnerId,
                    'ORDER_PLACED',
                    'New Order Received!',
                    "New order #{$order['order_number']} has been placed for {$order['restaurant_name']}.",
                    $orderId,
                    $order['restaurant_id']
                );
            }
            // Customer Notification #1: Order Received!
            createNotification(
                $pdo,
                $userId,
                'ORDER_RECEIVED',
                'Order Received!',
                'Your order has been received!',
                $orderId,
                $order['restaurant_id']
            );
        } catch (Throwable $notifEx) {
            // Non-fatal: notification failure must NOT undo a committed payment
            error_log('[UrbanEats] Notification error after payment: ' . $notifEx->getMessage());
        }
    }

    // 5. Respond success
    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => $isSuccessful ? 'Payment verified and order confirmed.' : 'Payment failed or cancelled.',
        'data'    => [
            'order_id'       => $orderId,
            'order_number'   => $order['order_number'],
            'payment_status' => $newPaymentStatus,
            'order_status'   => $newOrderStatus,
        ],
    ]);

} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Unable to verify payment: ' . $e->getMessage(),
    ]);
}
