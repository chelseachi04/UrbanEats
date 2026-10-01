<?php
/**
 * UrbanEats Orders API — GET /orders/detail.php
 *
 * Retrieves full details and items snapshot for a specific order.
 *
 * Method:  GET
 * Query:   ?id=<int> or ?order_number=<string>
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *
 * SECURITY:
 *   - Ensures order belongs strictly to the authenticated caller (WHERE user_id = :user_id).
 *   - Returns HTTP 404 if order does not exist or belongs to another user.
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

$orderId     = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
$orderNumber = isset($_GET['order_number']) ? trim((string)$_GET['order_number']) : '';

if ($orderId === false && empty($orderNumber)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Order ID or order_number is required.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Query order header scoped strictly to this customer
    if ($orderId !== false) {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE id = :id AND user_id = :user_id LIMIT 1");
        $stmt->execute([':id' => $orderId, ':user_id' => $userId]);
    } else {
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE order_number = :num AND user_id = :user_id LIMIT 1");
        $stmt->execute([':num' => $orderNumber, ':user_id' => $userId]);
    }

    $order = $stmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found or access denied.']);
        exit;
    }

    // Cast types
    $order['id']            = (int) $order['id'];
    $order['user_id']       = (int) $order['user_id'];
    $order['restaurant_id'] = (int) $order['restaurant_id'];
    $order['subtotal']      = (float) $order['subtotal'];
    $order['delivery_fee']  = (float) $order['delivery_fee'];
    $order['total_amount']  = (float) $order['total_amount'];

    // Fetch order items (immutable purchase snapshot) with image_url from food_items
    $itemStmt = $pdo->prepare("
        SELECT
            oi.id,
            oi.food_item_id,
            oi.food_name,
            oi.food_slug,
            oi.category_name,
            oi.quantity,
            oi.unit_price,
            oi.subtotal,
            fi.image_url AS food_image_url
        FROM order_items oi
        LEFT JOIN food_items fi ON oi.food_item_id = fi.id
        WHERE oi.order_id = :order_id
        ORDER BY oi.id ASC
    ");
    $itemStmt->execute([':order_id' => $order['id']]);
    $items = $itemStmt->fetchAll();

    foreach ($items as &$item) {
        $item['id']           = (int) $item['id'];
        $item['food_item_id'] = (int) $item['food_item_id'];
        $item['quantity']     = (int) $item['quantity'];
        $item['unit_price']   = (float) $item['unit_price'];
        $item['subtotal']     = (float) $item['subtotal'];
        // Prefix relative image path with API base URL so frontend can render it
        if (!empty($item['food_image_url']) && !str_starts_with($item['food_image_url'], 'http')) {
            $item['food_image_url'] = 'http://localhost/urbaneats-api' . $item['food_image_url'];
        }
    }
    unset($item);

    $order['items'] = $items;

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data'   => $order,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to retrieve order details.']);
}
