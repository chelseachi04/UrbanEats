<?php
/**
 * UrbanEats Admin API — GET /admin/orders.php
 * Returns all orders with customer, vendor, and rider info for Admin order management.
 * Auth: role = 'admin' session required.
 */
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if (empty($_SESSION['user_id'])) { http_response_code(401); echo json_encode(['status'=>'error','message'=>'Authentication required.']); exit; }

$pdo = getDBConnection();
$caller = $pdo->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
$caller->execute([':id' => (int)$_SESSION['user_id']]);
$callerRow = $caller->fetch();
if (!$callerRow || $callerRow['role'] !== 'admin') { http_response_code(403); echo json_encode(['status'=>'error','message'=>'Admin access required.']); exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(['status'=>'error','message'=>'Method Not Allowed']); exit; }

$page   = max(1, (int)($_GET['page'] ?? 1));
$limit  = 50;
$offset = ($page - 1) * $limit;
$status = isset($_GET['status']) ? trim($_GET['status']) : '';
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

$where  = [];
$params = [];

if ($status) {
    $where[] = "o.order_status = :status";
    $params[':status'] = $status;
}
if ($search) {
    $where[] = "(o.order_number LIKE :s OR o.recipient_name LIKE :s2 OR o.restaurant_name LIKE :s3)";
    $params[':s']  = "%{$search}%";
    $params[':s2'] = "%{$search}%";
    $params[':s3'] = "%{$search}%";
}

$whereSQL = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$countStmt = $pdo->prepare("SELECT COUNT(*) FROM orders o $whereSQL");
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

$stmt = $pdo->prepare("
    SELECT
        o.id, o.order_number, o.user_id, o.restaurant_id, o.restaurant_name,
        o.recipient_name, o.recipient_phone, o.delivery_address, o.delivery_area,
        o.subtotal, o.delivery_fee, o.total_amount,
        o.order_status, o.payment_status, o.payment_method,
        o.created_at, o.updated_at,
        u.full_name AS customer_name, u.email AS customer_email,
        r.name AS restaurant_full_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN restaurants r ON o.restaurant_id = r.id
    $whereSQL
    ORDER BY o.created_at DESC
    LIMIT $limit OFFSET $offset
");
$stmt->execute($params);
$orders = $stmt->fetchAll();

foreach ($orders as &$o) {
    $o['id']            = (int)$o['id'];
    $o['user_id']       = (int)$o['user_id'];
    $o['restaurant_id'] = (int)$o['restaurant_id'];
    $o['subtotal']      = (float)$o['subtotal'];
    $o['delivery_fee']  = (float)$o['delivery_fee'];
    $o['total_amount']  = (float)$o['total_amount'];
}

echo json_encode(['status'=>'success','total'=>$total,'page'=>$page,'data'=>$orders]);
