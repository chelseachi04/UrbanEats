<?php
/**
 * UrbanEats Admin API — GET/POST /admin/order_details.php
 * GET:  Returns complete order details, line items, vendor info, customer info, and rider assignment.
 * POST: Assigns or reassigns a delivery rider to an order.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

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

// POST Method — Assign Rider to Order
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $orderId = isset($body['order_id']) ? (int)$body['order_id'] : 0;
    $riderId = isset($body['rider_id']) ? (int)$body['rider_id'] : 0;

    if ($orderId <= 0 || $riderId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Valid order_id and rider_id are required.']);
        exit;
    }

    // Verify order exists
    $orderStmt = $pdo->prepare("SELECT id, order_number, order_status FROM orders WHERE id = :id LIMIT 1");
    $orderStmt->execute([':id' => $orderId]);
    $order = $orderStmt->fetch();
    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found.']);
        exit;
    }

    // Verify rider exists and is approved rider
    $riderStmt = $pdo->prepare("SELECT id, full_name, rider_code FROM users WHERE id = :id AND role = 'rider' LIMIT 1");
    $riderStmt->execute([':id' => $riderId]);
    $rider = $riderStmt->fetch();
    if (!$rider) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Rider account not found.']);
        exit;
    }

    // Upsert delivery assignment
    $assignStmt = $pdo->prepare("
        INSERT INTO delivery_assignments (order_id, rider_id, status, assigned_at, accepted_at)
        VALUES (:oid, :rid, 'ACCEPTED', NOW(), NOW())
        ON DUPLICATE KEY UPDATE rider_id = VALUES(rider_id), status = 'ACCEPTED', updated_at = NOW()
    ");
    $assignStmt->execute([':oid' => $orderId, ':rid' => $riderId]);

    // Update order status if in READY_FOR_DELIVERY or CONFIRMED
    if (in_array($order['order_status'], ['CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY'])) {
        $upOrder = $pdo->prepare("UPDATE orders SET order_status = 'OUT_FOR_DELIVERY', updated_at = NOW() WHERE id = :id");
        $upOrder->execute([':id' => $orderId]);
    }

    echo json_encode([
        'status'  => 'success',
        'message' => "Order #{$order['order_number']} successfully assigned to Rider {$rider['full_name']} ({$rider['rider_code']})."
    ]);
    exit;
}

// GET Method — Fetch Complete Order Details
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $orderId = isset($_GET['order_id']) ? (int)$_GET['order_id'] : 0;
    if ($orderId <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'order_id parameter is required.']);
        exit;
    }

    // Fetch order header with customer, restaurant & assigned rider details
    $stmt = $pdo->prepare("
        SELECT
            o.id, o.order_number, o.user_id, o.restaurant_id, o.restaurant_name,
            o.recipient_name, o.recipient_phone, o.delivery_address, o.delivery_area, o.delivery_city, o.delivery_state,
            o.subtotal, o.delivery_fee, o.total_amount, o.order_status, o.payment_status, o.payment_method, o.payment_reference,
            o.created_at, o.updated_at,
            u.full_name AS customer_name, u.email AS customer_email, u.phone AS customer_phone,
            r.name AS restaurant_full_name, r.location AS restaurant_location, r.phone AS restaurant_phone,
            da.rider_id, da.status AS delivery_status, da.assigned_at, da.delivered_at,
            ru.full_name AS rider_name, ru.phone AS rider_phone, ru.rider_code
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN restaurants r ON o.restaurant_id = r.id
        LEFT JOIN delivery_assignments da ON da.order_id = o.id
        LEFT JOIN users ru ON da.rider_id = ru.id
        WHERE o.id = :id
        LIMIT 1
    ");
    $stmt->execute([':id' => $orderId]);
    $order = $stmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order details not found.']);
        exit;
    }

    $order['id']            = (int)$order['id'];
    $order['user_id']       = (int)$order['user_id'];
    $order['restaurant_id'] = (int)$order['restaurant_id'];
    $order['subtotal']      = (float)$order['subtotal'];
    $order['delivery_fee']  = (float)$order['delivery_fee'];
    $order['total_amount']  = (float)$order['total_amount'];
    if ($order['rider_id']) $order['rider_id'] = (int)$order['rider_id'];

    // Fetch purchased line items
    $itemsStmt = $pdo->prepare("
        SELECT id, food_item_id, food_name, category_name, quantity, unit_price, subtotal
        FROM order_items
        WHERE order_id = :oid
        ORDER BY id ASC
    ");
    $itemsStmt->execute([':oid' => $orderId]);
    $items = $itemsStmt->fetchAll();

    foreach ($items as &$item) {
        $item['id']           = (int)$item['id'];
        $item['food_item_id'] = $item['food_item_id'] ? (int)$item['food_item_id'] : null;
        $item['quantity']     = (int)$item['quantity'];
        $item['unit_price']   = (float)$item['unit_price'];
        $item['subtotal']     = (float)$item['subtotal'];
    }

    echo json_encode([
        'status' => 'success',
        'data'   => [
            'order' => $order,
            'items' => $items
        ]
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
