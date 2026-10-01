<?php
/**
 * UrbanEats Admin API — GET /admin/analytics.php
 * Returns comprehensive analytics: sales overview, vendor performance, rider performance,
 * popular dishes, popular restaurants, and order trends.
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

// 1. Sales & Order Overview
$salesRow = $pdo->query("
    SELECT
        COUNT(*) AS total_orders,
        COALESCE(SUM(total_amount), 0) AS total_gmv,
        COALESCE(SUM(CASE WHEN payment_status = 'PAID' THEN total_amount ELSE 0 END), 0) AS paid_revenue,
        COALESCE(AVG(total_amount), 0) AS avg_order_value,
        SUM(order_status = 'DELIVERED') AS delivered_count,
        SUM(order_status = 'CANCELLED') AS cancelled_count
    FROM orders
")->fetch();

// 2. Vendor Performance (Top Vendors by Sales & Orders)
$vendorPerf = $pdo->query("
    SELECT
        r.id AS restaurant_id, r.name AS restaurant_name, u.full_name AS owner_name, u.vendor_code,
        COUNT(o.id) AS order_count,
        COALESCE(SUM(o.total_amount), 0) AS total_sales
    FROM restaurants r
    JOIN users u ON r.owner_id = u.id
    LEFT JOIN orders o ON o.restaurant_id = r.id AND o.payment_status = 'PAID'
    GROUP BY r.id
    ORDER BY total_sales DESC, order_count DESC
    LIMIT 10
")->fetchAll();

foreach ($vendorPerf as &$vp) {
    $vp['restaurant_id'] = (int)$vp['restaurant_id'];
    $vp['order_count']   = (int)$vp['order_count'];
    $vp['total_sales']   = (float)$vp['total_sales'];
}

// 3. Rider Performance (Completed deliveries & Active deliveries)
$riderPerf = $pdo->query("
    SELECT
        u.id AS rider_id, u.full_name AS rider_name, u.rider_code, u.phone, u.is_online,
        COUNT(CASE WHEN da.status = 'DELIVERED' THEN 1 END) AS completed_deliveries,
        COUNT(CASE WHEN da.status IN ('ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY') THEN 1 END) AS active_deliveries
    FROM users u
    LEFT JOIN delivery_assignments da ON da.rider_id = u.id
    WHERE u.role = 'rider'
    GROUP BY u.id
    ORDER BY completed_deliveries DESC
    LIMIT 10
")->fetchAll();

foreach ($riderPerf as &$rp) {
    $rp['rider_id']             = (int)$rp['rider_id'];
    $rp['completed_deliveries'] = (int)$rp['completed_deliveries'];
    $rp['active_deliveries']    = (int)$rp['active_deliveries'];
    $rp['is_online']            = (bool)$rp['is_online'];
}

// 4. Popular Dishes (Top ordered food items)
$popularDishes = $pdo->query("
    SELECT
        oi.food_name, oi.category_name,
        SUM(oi.quantity) AS total_quantity_sold,
        SUM(oi.subtotal) AS total_item_revenue
    FROM order_items oi
    GROUP BY oi.food_name, oi.category_name
    ORDER BY total_quantity_sold DESC
    LIMIT 8
")->fetchAll();

foreach ($popularDishes as &$pd) {
    $pd['total_quantity_sold'] = (int)$pd['total_quantity_sold'];
    $pd['total_item_revenue']  = (float)$pd['total_item_revenue'];
}

// 5. Order Status Breakdown Trends
$statusBreakdown = $pdo->query("
    SELECT order_status, COUNT(*) AS count
    FROM orders
    GROUP BY order_status
")->fetchAll();

$trends = [];
foreach ($statusBreakdown as $sb) {
    $trends[$sb['order_status']] = (int)$sb['count'];
}

echo json_encode([
    'status' => 'success',
    'data'   => [
        'overview' => [
            'total_orders'      => (int)$salesRow['total_orders'],
            'total_gmv'         => (float)$salesRow['total_gmv'],
            'paid_revenue'      => (float)$salesRow['paid_revenue'],
            'avg_order_value'   => round((float)$salesRow['avg_order_value'], 2),
            'delivered_count'   => (int)$salesRow['delivered_count'],
            'cancelled_count'   => (int)$salesRow['cancelled_count'],
        ],
        'vendor_performance' => $vendorPerf,
        'rider_performance'  => $riderPerf,
        'popular_dishes'     => $popularDishes,
        'order_status_trends'=> $trends
    ]
]);
