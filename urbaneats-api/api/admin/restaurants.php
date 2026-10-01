<?php
/**
 * UrbanEats Admin API — GET /admin/restaurants.php
 * Returns all restaurants with owner/vendor info for Admin restaurant management.
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

$stmt = $pdo->query("
    SELECT
        r.id, r.name, r.slug, r.category, r.location, r.phone,
        r.status, r.is_active, r.created_at,
        u.id AS owner_id, u.full_name AS owner_name, u.email AS owner_email,
        u.vendor_code, u.application_status AS owner_status,
        COUNT(fi.id) AS menu_item_count
    FROM restaurants r
    JOIN users u ON r.owner_id = u.id
    LEFT JOIN food_items fi ON fi.restaurant_id = r.id
    GROUP BY r.id
    ORDER BY r.created_at DESC
");
$restaurants = $stmt->fetchAll();

foreach ($restaurants as &$r) {
    $r['id']              = (int)$r['id'];
    $r['owner_id']        = (int)$r['owner_id'];
    $r['is_active']       = (bool)$r['is_active'];
    $r['menu_item_count'] = (int)$r['menu_item_count'];
}

echo json_encode(['status'=>'success','count'=>count($restaurants),'data'=>$restaurants]);
