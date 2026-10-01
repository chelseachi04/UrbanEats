<?php
/**
 * UrbanEats Vendor API — GET /vendor/dashboard.php
 *
 * Calculates real summary statistics and recent orders for the authenticated vendor's restaurant.
 *
 * Method:  GET
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session (role = 'vendor' & application_status = 'APPROVED').
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
$pdo    = getDBConnection();

// Verify role = 'vendor' and application_status = 'APPROVED'
$userStmt = $pdo->prepare("SELECT id, role, application_status FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$userRec = $userStmt->fetch();

if (!$userRec || strtolower($userRec['role']) !== 'vendor') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Vendor account required.']);
    exit;
}

if (($userRec['application_status'] ?? '') !== 'APPROVED') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Your vendor application is currently under review by Admin.']);
    exit;
}

// Fetch vendor's restaurant ID
$restStmt = $pdo->prepare("SELECT id, name, status, location, category, logo_url, cover_url FROM restaurants WHERE owner_id = :owner_id LIMIT 1");
$restStmt->execute([':owner_id' => $userId]);
$restaurant = $restStmt->fetch();

if (!$restaurant) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'No restaurant linked to this vendor.']);
    exit;
}

$restId = (int) $restaurant['id'];

try {
    // 1. Calculate real order counts by status
    $statsStmt = $pdo->prepare("
        SELECT
            COUNT(*) AS total_orders,
            SUM(CASE WHEN order_status = 'CONFIRMED' THEN 1 ELSE 0 END) AS new_orders,
            SUM(CASE WHEN order_status = 'PROCESSING' THEN 1 ELSE 0 END) AS processing_orders,
            SUM(CASE WHEN order_status = 'READY_FOR_DELIVERY' THEN 1 ELSE 0 END) AS ready_orders,
            SUM(CASE WHEN order_status = 'OUT_FOR_DELIVERY' THEN 1 ELSE 0 END) AS out_for_delivery_orders,
            SUM(CASE WHEN order_status = 'DELIVERED' THEN 1 ELSE 0 END) AS delivered_orders,
            SUM(CASE WHEN order_status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_orders,
            SUM(CASE WHEN order_status != 'CANCELLED' THEN total_amount ELSE 0 END) AS total_sales
        FROM orders
        WHERE restaurant_id = :restaurant_id
    ");
    $statsStmt->execute([':restaurant_id' => $restId]);
    $stats = $statsStmt->fetch();

    // 2. Fetch recent orders for vendor
    $recentStmt = $pdo->prepare("
        SELECT
            id,
            order_number,
            recipient_name,
            recipient_phone,
            delivery_address,
            delivery_area,
            total_amount,
            order_status,
            payment_status,
            created_at,
            (SELECT COUNT(*) FROM order_items WHERE order_id = orders.id) AS item_count
        FROM orders
        WHERE restaurant_id = :restaurant_id
        ORDER BY created_at DESC
        LIMIT 5
    ");
    $recentStmt->execute([':restaurant_id' => $restId]);
    $recentOrders = $recentStmt->fetchAll();

    foreach ($recentOrders as &$ord) {
        $ord['id']           = (int) $ord['id'];
        $ord['total_amount'] = (float) $ord['total_amount'];
        $ord['item_count']   = (int) $ord['item_count'];
    }
    unset($ord);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data'   => [
            'restaurant' => [
                'id'        => $restId,
                'name'      => $restaurant['name'],
                'status'    => $restaurant['status'],
                'location'  => $restaurant['location'],
                'category'  => $restaurant['category'],
                'logo_url'  => $restaurant['logo_url'],
                'cover_url' => $restaurant['cover_url'],
            ],
            'metrics' => [
                'total_orders'            => (int) ($stats['total_orders'] ?? 0),
                'new_orders'              => (int) ($stats['new_orders'] ?? 0),
                'processing_orders'       => (int) ($stats['processing_orders'] ?? 0),
                'ready_orders'            => (int) ($stats['ready_orders'] ?? 0),
                'out_for_delivery_orders' => (int) ($stats['out_for_delivery_orders'] ?? 0),
                'delivered_orders'        => (int) ($stats['delivered_orders'] ?? 0),
                'cancelled_orders'        => (int) ($stats['cancelled_orders'] ?? 0),
                'total_sales'             => (float) ($stats['total_sales'] ?? 0),
            ],
            'recent_orders' => $recentOrders,
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch vendor dashboard.']);
}
