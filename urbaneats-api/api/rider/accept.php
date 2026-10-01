<?php
/**
 * UrbanEats Rider API — POST /rider/accept.php
 *
 * Accepts an available delivery and assigns it to the authenticated rider.
 * Uses atomic transaction locking so multiple riders cannot accept the same delivery concurrently.
 * Verifies rider is APPROVED and ONLINE.
 *
 * Method:  POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    { "order_id": <int> }
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

if ($orderId === false) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid order_id is required.']);
    exit;
}

$pdo = getDBConnection();

// Verify role = 'rider', application_status = 'APPROVED', and is_online = 1
$userStmt = $pdo->prepare("SELECT full_name, role, application_status, is_online FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$userRec = $userStmt->fetch();

if (!$userRec || strtolower($userRec['role']) !== 'rider') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Rider account required.']);
    exit;
}

if (($userRec['application_status'] ?? '') !== 'APPROVED') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Your rider application is currently under review by Admin.']);
    exit;
}

if (empty($userRec['is_online'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'You must be ONLINE to accept delivery jobs. Please toggle status to ONLINE.']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1. Check if rider already has an uncompleted active delivery
    $chkRiderStmt = $pdo->prepare("
        SELECT id FROM delivery_assignments
        WHERE rider_id = :rider_id
          AND status IN ('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY')
        LIMIT 1
        FOR UPDATE
    ");
    $chkRiderStmt->execute([':rider_id' => $userId]);
    if ($chkRiderStmt->fetch()) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'You already have an active delivery in progress. Complete it first before accepting a new delivery.']);
        exit;
    }

    // 2. Lock target order for update
    $ordStmt = $pdo->prepare("
        SELECT o.id, o.order_number, o.order_status, o.user_id AS customer_id, o.restaurant_id, r.owner_id AS vendor_id, r.name AS restaurant_name
        FROM orders o
        JOIN restaurants r ON o.restaurant_id = r.id
        WHERE o.id = :id
        FOR UPDATE
    ");
    $ordStmt->execute([':id' => $orderId]);
    $order = $ordStmt->fetch();

    if (!$order) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found.']);
        exit;
    }

    if (!in_array($order['order_status'], ['READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'])) {
        $pdo->rollBack();
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Order is not available for delivery pickup.']);
        exit;
    }

    // 3. Check if another rider has already accepted this delivery
    $chkAssignStmt = $pdo->prepare("
        SELECT id, rider_id FROM delivery_assignments
        WHERE order_id = :order_id AND status NOT IN ('CANCELLED')
        FOR UPDATE
    ");
    $chkAssignStmt->execute([':order_id' => $orderId]);
    $existingAssign = $chkAssignStmt->fetch();

    if ($existingAssign) {
        $pdo->rollBack();
        http_response_code(409); // Conflict
        echo json_encode(['status' => 'error', 'message' => 'This delivery has already been accepted by another rider.']);
        exit;
    }

    // 4. Create atomic assignment
    $assignStmt = $pdo->prepare("
        INSERT INTO delivery_assignments (order_id, rider_id, status, assigned_at, accepted_at)
        VALUES (:order_id, :rider_id, 'ACCEPTED', NOW(), NOW())
    ");
    $assignStmt->execute([
        ':order_id' => $orderId,
        ':rider_id' => $userId,
    ]);

    $assignmentId = (int) $pdo->lastInsertId();
    $riderName    = $userRec['full_name'] ?? 'Rider';

    // 5. COMMIT the assignment before any DDL-capable helper functions.
    // createNotification() calls ensureNotificationsTableExists() which runs
    // CREATE TABLE IF NOT EXISTS — a DDL that causes MySQL to implicitly
    // auto-commit any open transaction, breaking the explicit commit().
    $pdo->commit();

    // 6. AFTER commit: Notify Vendor (non-fatal, notifications outside transaction)
    try {
        if ($order['vendor_id']) {
            createNotification(
                $pdo,
                $order['vendor_id'],
                'RIDER_ACCEPTED',
                'Rider Assigned',
                "Rider {$riderName} has accepted delivery for order #{$order['order_number']}.",
                $orderId,
                $order['restaurant_id'],
                $assignmentId
            );
        }
    } catch (Throwable $notifEx) {
        error_log('[UrbanEats] Notification error after rider acceptance: ' . $notifEx->getMessage());
    }

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => "Delivery for Order #{$order['order_number']} accepted successfully!",
        'data'    => [
            'assignment_id' => $assignmentId,
            'order_id'      => $orderId,
            'order_number'  => $order['order_number'],
            'status'        => 'ACCEPTED',
        ],
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to accept delivery. Please try again.']);
}
