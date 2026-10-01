<?php
/**
 * UrbanEats Vendor API — GET /vendor/orders.php
 *
 * Retrieves incoming and historical orders for the vendor's restaurant.
 *
 * Method:  GET
 * Query:   ?status=all|confirmed|processing|ready|delivered|cancelled
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *
 * SECURITY:
 *   - Strictly verifies restaurant ownership (r.owner_id = $_SESSION['user_id']).
 *   - Vendor A can NEVER view Vendor B's orders.
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
$statusFilter = isset($_GET['status']) ? strtoupper(trim((string)$_GET['status'])) : 'ALL';

try {
    $pdo = getDBConnection();

    // Verify vendor's restaurant ID
    $restStmt = $pdo->prepare("SELECT id FROM restaurants WHERE owner_id = :owner_id LIMIT 1");
    $restStmt->execute([':owner_id' => $userId]);
    $restaurant = $restStmt->fetch();

    if (!$restaurant) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'No restaurant linked to this vendor.']);
        exit;
    }

    $restId = (int) $restaurant['id'];

    // Build SQL condition
    $sql = "
        SELECT
            o.id,
            o.order_number,
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
            o.payment_method,
            o.created_at,
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
        FROM orders o
        WHERE o.restaurant_id = :rest_id
    ";

    if ($statusFilter !== 'ALL' && !empty($statusFilter)) {
        if ($statusFilter === 'READY') $statusFilter = 'READY_FOR_DELIVERY';
        $sql .= " AND o.order_status = :status";
    }

    $sql .= " ORDER BY o.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $params = [':rest_id' => $restId];
    if ($statusFilter !== 'ALL' && !empty($statusFilter)) {
        $params[':status'] = $statusFilter;
    }
    $stmt->execute($params);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$ord) {
        $ord['id']           = (int) $ord['id'];
        $ord['subtotal']     = (float) $ord['subtotal'];
        $ord['delivery_fee'] = (float) $ord['delivery_fee'];
        $ord['total_amount'] = (float) $ord['total_amount'];
        $ord['item_count']   = (int) $ord['item_count'];
    }
    unset($ord);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count'  => count($orders),
        'data'   => $orders,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to retrieve vendor orders.']);
}
