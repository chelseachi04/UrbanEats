<?php
/**
 * UrbanEats Admin API — GET /admin/deliveries.php
 * Returns active deliveries, unassigned orders, and online/available riders.
 *
 * Method: GET
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

$pdo = getDBConnection();
$callerStmt = $pdo->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
$callerStmt->execute([':id' => (int)$_SESSION['user_id']]);
$callerRow = $callerStmt->fetch();

if (!$callerRow || $callerRow['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Admin access required.']);
    exit;
}

// 1. Fetch Active Deliveries
$activeStmt = $pdo->query("
    SELECT
        o.id AS order_id, o.order_number, o.restaurant_name, o.recipient_name, o.recipient_phone,
        o.delivery_address, o.delivery_area, o.total_amount, o.order_status, o.created_at,
        da.id AS assignment_id, da.status AS delivery_status, da.assigned_at,
        u.id AS rider_id, u.full_name AS rider_name, u.phone AS rider_phone, u.rider_code, u.is_online
    FROM orders o
    JOIN delivery_assignments da ON da.order_id = o.id
    JOIN users u ON da.rider_id = u.id
    WHERE o.order_status IN ('CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY')
      AND da.status IN ('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY')
    ORDER BY o.created_at DESC
");
$activeDeliveries = $activeStmt->fetchAll();

foreach ($activeDeliveries as &$ad) {
    $ad['order_id']      = (int)$ad['order_id'];
    $ad['assignment_id'] = (int)$ad['assignment_id'];
    $ad['rider_id']      = (int)$ad['rider_id'];
    $ad['total_amount']  = (float)$ad['total_amount'];
    $ad['is_online']     = (bool)$ad['is_online'];
}

// 2. Fetch Unassigned Orders (Active orders without a rider assignment)
$unassignedStmt = $pdo->query("
    SELECT
        o.id AS order_id, o.order_number, o.restaurant_name, o.recipient_name, o.recipient_phone,
        o.delivery_address, o.delivery_area, o.total_amount, o.order_status, o.created_at
    FROM orders o
    LEFT JOIN delivery_assignments da ON da.order_id = o.id
    WHERE o.order_status IN ('CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY')
      AND (da.id IS NULL OR da.status = 'CANCELLED')
    ORDER BY o.created_at DESC
");
$unassignedOrders = $unassignedStmt->fetchAll();

foreach ($unassignedOrders as &$uo) {
    $uo['order_id']     = (int)$uo['order_id'];
    $uo['total_amount'] = (float)$uo['total_amount'];
}

// 3. Fetch Online & Available Riders
$ridersStmt = $pdo->query("
    SELECT
        u.id, u.full_name, u.email, u.phone, u.rider_code, u.is_online, u.is_available,
        (SELECT COUNT(*) FROM delivery_assignments da WHERE da.rider_id = u.id AND da.status = 'DELIVERED') AS completed_count,
        (SELECT COUNT(*) FROM delivery_assignments da WHERE da.rider_id = u.id AND da.status IN ('ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY')) AS active_count
    FROM users u
    WHERE u.role = 'rider' AND u.application_status = 'APPROVED'
    ORDER BY u.is_online DESC, u.full_name ASC
");
$availableRiders = $ridersStmt->fetchAll();

foreach ($availableRiders as &$r) {
    $r['id']              = (int)$r['id'];
    $r['is_online']       = (bool)$r['is_online'];
    $r['is_available']    = (bool)$r['is_available'];
    $r['completed_count'] = (int)$r['completed_count'];
    $r['active_count']    = (int)$r['active_count'];
}

echo json_encode([
    'status' => 'success',
    'data'   => [
        'active_deliveries' => $activeDeliveries,
        'unassigned_orders' => $unassignedOrders,
        'available_riders'   => $availableRiders,
        'metrics'            => [
            'active_delivery_count' => count($activeDeliveries),
            'unassigned_count'      => count($unassignedOrders),
            'online_rider_count'    => count(array_filter($availableRiders, fn($r) => $r['is_online']))
        ]
    ]
]);
