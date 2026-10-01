<?php
/**
 * UrbanEats Admin API — GET /admin/vendor_details.php
 * Returns complete restaurant information and menu items for a specific vendor or restaurant.
 *
 * Method: GET
 * Query:  ?vendor_id=<int> OR ?restaurant_id=<int>
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

$vendorId     = isset($_GET['vendor_id']) ? (int)$_GET['vendor_id'] : 0;
$restaurantId = isset($_GET['restaurant_id']) ? (int)$_GET['restaurant_id'] : 0;

if ($vendorId <= 0 && $restaurantId <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'vendor_id or restaurant_id parameter is required.']);
    exit;
}

$whereClause = $restaurantId > 0 ? "r.id = :rid" : "r.owner_id = :vid";
$params      = $restaurantId > 0 ? [':rid' => $restaurantId] : [':vid' => $vendorId];

$stmt = $pdo->prepare("
    SELECT
        r.id AS restaurant_id, r.name AS restaurant_name, r.slug, r.description,
        r.category, r.location, r.phone AS restaurant_phone, r.logo_image, r.cover_image,
        r.status AS operating_status, r.is_active AS restaurant_is_active, r.created_at AS restaurant_created_at,
        u.id AS vendor_id, u.full_name AS vendor_name, u.email AS vendor_email, u.phone AS vendor_phone,
        u.vendor_code, u.application_status, u.created_at AS vendor_created_at,
        (SELECT COUNT(*) FROM orders WHERE restaurant_id = r.id) AS total_orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE restaurant_id = r.id AND payment_status = 'PAID') AS total_revenue
    FROM restaurants r
    JOIN users u ON r.owner_id = u.id
    WHERE $whereClause
    LIMIT 1
");
$stmt->execute($params);
$restaurant = $stmt->fetch();

if (!$restaurant) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Restaurant or vendor not found.']);
    exit;
}

$restaurant['restaurant_id']     = (int)$restaurant['restaurant_id'];
$restaurant['vendor_id']         = (int)$restaurant['vendor_id'];
$restaurant['restaurant_is_active'] = (bool)$restaurant['restaurant_is_active'];
$restaurant['total_orders']      = (int)$restaurant['total_orders'];
$restaurant['total_revenue']     = (float)$restaurant['total_revenue'];

// Fetch menu items
$menuStmt = $pdo->prepare("
    SELECT
        fi.id, fi.name, fi.description, fi.price,
        fi.is_available, fi.created_at,
        fc.name AS category_name
    FROM food_items fi
    LEFT JOIN food_categories fc ON fi.category_id = fc.id
    WHERE fi.restaurant_id = :rid
    ORDER BY fc.name ASC, fi.name ASC
");
$menuStmt->execute([':rid' => $restaurant['restaurant_id']]);
$menuItems = $menuStmt->fetchAll();

foreach ($menuItems as &$item) {
    $item['id']           = (int)$item['id'];
    $item['price']        = (float)$item['price'];
    $item['is_available'] = (bool)$item['is_available'];
}

echo json_encode([
    'status' => 'success',
    'data'   => [
        'restaurant' => $restaurant,
        'menu'       => $menuItems,
        'menu_count' => count($menuItems)
    ]
]);
