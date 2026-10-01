<?php
/**
 * UrbanEats Admin API — GET /admin/users.php
 * Returns paginated user list with optional role/status filters and search.
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

$role   = isset($_GET['role'])   ? trim($_GET['role'])   : '';
$status = isset($_GET['status']) ? trim($_GET['status']) : '';
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$page   = max(1, (int)($_GET['page'] ?? 1));
$limit  = 50;
$offset = ($page - 1) * $limit;

$where  = [];
$params = [];

$allowedRoles   = ['customer','vendor','rider','admin'];
$allowedStatuses = ['APPROVED','PENDING','REJECTED'];

if ($role && in_array($role, $allowedRoles)) {
    $where[] = "u.role = :role";
    $params[':role'] = $role;
}
if ($status && in_array($status, $allowedStatuses)) {
    $where[] = "u.application_status = :status";
    $params[':status'] = $status;
}
if ($search) {
    $where[] = "(u.full_name LIKE :s OR u.email LIKE :s2 OR u.phone LIKE :s3)";
    $params[':s']  = "%{$search}%";
    $params[':s2'] = "%{$search}%";
    $params[':s3'] = "%{$search}%";
}

$whereSQL = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$countStmt = $pdo->prepare("SELECT COUNT(*) FROM users u $whereSQL");
$countStmt->execute($params);
$total = (int)$countStmt->fetchColumn();

// Ensure `is_active` column exists on users table
try {
    $pdo->exec("ALTER TABLE `users` ADD COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT 1");
} catch (Exception $e) {
    // Column already exists
}

$stmt = $pdo->prepare("
    SELECT u.id, u.full_name, u.email, u.phone, u.role, u.application_status,
           u.vendor_code, u.rider_code, u.is_online, u.is_available,
           COALESCE(u.is_active, 1) AS is_active,
           u.created_at, u.approved_at,
           r.name AS restaurant_name, r.id AS restaurant_id
    FROM users u
    LEFT JOIN restaurants r ON r.owner_id = u.id
    $whereSQL
    ORDER BY u.created_at DESC
    LIMIT $limit OFFSET $offset
");
$stmt->execute($params);
$users = $stmt->fetchAll();

foreach ($users as &$u) {
    $u['id'] = (int)$u['id'];
    $u['is_active'] = (int)$u['is_active'];
    $u['is_online'] = (bool)$u['is_online'];
    $u['is_available'] = (bool)$u['is_available'];
    if ($u['restaurant_id']) $u['restaurant_id'] = (int)$u['restaurant_id'];
}

echo json_encode(['status'=>'success','total'=>$total,'page'=>$page,'data'=>$users]);
