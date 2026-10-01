<?php
/**
 * UrbanEats Admin API — GET /admin/stats.php
 * Returns platform-wide statistics for the Admin Dashboard Overview.
 * Auth: role = 'admin' session required.
 */
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$pdo = getDBConnection();

$caller = $pdo->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
$caller->execute([':id' => (int)$_SESSION['user_id']]);
$callerRow = $caller->fetch();

if (!$callerRow || $callerRow['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Admin access required.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$stats = [];

// User counts
$row = $pdo->query("SELECT
    SUM(role='customer') AS total_customers,
    SUM(role='vendor')   AS total_vendors,
    SUM(role='rider')    AS total_riders,
    SUM(role='admin')    AS total_admins,
    SUM(role='vendor' AND application_status='PENDING') AS pending_vendors,
    SUM(role='rider'  AND application_status='PENDING') AS pending_riders
FROM users")->fetch();

$stats['total_customers']  = (int)$row['total_customers'];
$stats['total_vendors']    = (int)$row['total_vendors'];
$stats['total_riders']     = (int)$row['total_riders'];
$stats['total_admins']     = (int)$row['total_admins'];
$stats['pending_vendors']  = (int)$row['pending_vendors'];
$stats['pending_riders']   = (int)$row['pending_riders'];

// Restaurant count
$stats['total_restaurants'] = (int)$pdo->query("SELECT COUNT(*) FROM restaurants")->fetchColumn();

// Order stats
$orderRow = $pdo->query("SELECT
    COUNT(*) AS total_orders,
    SUM(total_amount) AS total_revenue
FROM orders")->fetch();
$stats['total_orders']   = (int)$orderRow['total_orders'];
$stats['total_revenue']  = (float)($orderRow['total_revenue'] ?? 0);

// Recent orders (last 10)
$recentStmt = $pdo->query("
    SELECT o.id, o.order_number, o.recipient_name, o.restaurant_name,
           o.total_amount, o.order_status, o.payment_status, o.created_at,
           u.full_name AS customer_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 10
");
$stats['recent_orders'] = $recentStmt->fetchAll();

http_response_code(200);
echo json_encode(['status' => 'success', 'data' => $stats]);
