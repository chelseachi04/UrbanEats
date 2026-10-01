<?php
/**
 * UrbanEats Rider API — GET /rider/deliveries.php
 *
 * Retrieves list of available order deliveries ready for rider pickup.
 * Returns orders with order_status = 'READY_FOR_DELIVERY' or 'OUT_FOR_DELIVERY' that have no active rider assignment.
 * This ensures orders dispatched by a vendor (set to OUT_FOR_DELIVERY) are still visible to riders.
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

// Verify role = 'rider', application_status = 'APPROVED', and is_online = 1
$userStmt = $pdo->prepare("SELECT role, application_status, is_online FROM users WHERE id = :id LIMIT 1");
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
    http_response_code(200);
    echo json_encode([
        'status'   => 'success',
        'count'    => 0,
        'data'     => [],
        'message'  => 'You are currently OFFLINE. Toggle status to ONLINE to view and accept delivery jobs.'
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            o.id AS order_id,
            o.order_number,
            o.restaurant_id,
            o.restaurant_name,
            r.location AS restaurant_location,
            r.phone AS restaurant_phone,
            o.recipient_name,
            o.recipient_phone,
            o.delivery_address,
            o.delivery_area,
            o.delivery_city,
            o.subtotal,
            o.delivery_fee,
            o.total_amount,
            o.order_status,
            o.payment_status,
            o.created_at,
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
        FROM orders o
        JOIN restaurants r ON o.restaurant_id = r.id
        LEFT JOIN delivery_assignments da ON o.id = da.order_id AND da.status NOT IN ('CANCELLED')
        WHERE o.order_status IN ('READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY')
          AND da.id IS NULL
        ORDER BY o.updated_at ASC
    ");
    $stmt->execute();
    $deliveries = $stmt->fetchAll();

    foreach ($deliveries as &$d) {
        $d['order_id']     = (int) $d['order_id'];
        $d['subtotal']     = (float) $d['subtotal'];
        $d['delivery_fee'] = (float) $d['delivery_fee'];
        $d['total_amount'] = (float) $d['total_amount'];
        $d['item_count']   = (int) $d['item_count'];
    }
    unset($d);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count'  => count($deliveries),
        'data'   => $deliveries,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch available deliveries.']);
}
