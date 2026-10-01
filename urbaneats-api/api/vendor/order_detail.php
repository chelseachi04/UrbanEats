<?php
/**
 * UrbanEats Vendor API — GET /vendor/order_detail.php
 *
 * Retrieves detailed order receipt and item snapshots for the vendor's restaurant.
 *
 * Method:  GET
 * Query:   ?id=<int> or ?order_number=<string>
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *
 * SECURITY:
 *   - Strictly verifies order belongs to a restaurant owned by $_SESSION['user_id'].
 *   - Vendor A receives HTTP 404 if trying to view Vendor B's order.
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

$userId      = (int) $_SESSION['user_id'];
$orderId     = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
$orderNumber = isset($_GET['order_number']) ? trim((string)$_GET['order_number']) : '';

if ($orderId === false && empty($orderNumber)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Order ID or order_number is required.']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Query order header verifying vendor ownership
    $sql = "
        SELECT o.*
        FROM orders o
        INNER JOIN restaurants r ON o.restaurant_id = r.id
        WHERE r.owner_id = :user_id
    ";

    if ($orderId !== false) {
        $sql .= " AND o.id = :id LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId, ':id' => $orderId]);
    } else {
        $sql .= " AND o.order_number = :num LIMIT 1";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':user_id' => $userId, ':num' => $orderNumber]);
    }

    $order = $stmt->fetch();

    if (!$order) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Order not found or access denied.']);
        exit;
    }

    $order['id']            = (int) $order['id'];
    $order['user_id']       = (int) $order['user_id'];
    $order['restaurant_id'] = (int) $order['restaurant_id'];
    $order['subtotal']      = (float) $order['subtotal'];
    $order['delivery_fee']  = (float) $order['delivery_fee'];
    $order['total_amount']  = (float) $order['total_amount'];

    // Fetch order items with image_url from food_items
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
        if (!empty($item['food_image_url']) && !str_starts_with($item['food_image_url'], 'http')) {
            $item['food_image_url'] = 'http://localhost/urbaneats-api' . $item['food_image_url'];
        }
    }
    unset($item);

    $order['items'] = $items;

    // Fetch assigned rider info (if any)
    $riderStmt = $pdo->prepare("
        SELECT
            da.id AS assignment_id,
            da.status AS delivery_status,
            da.assigned_at,
            da.accepted_at,
            da.picked_up_at,
            da.delivered_at,
            u.id AS rider_id,
            u.full_name AS rider_name,
            u.phone AS rider_phone,
            u.email AS rider_email
        FROM delivery_assignments da
        JOIN users u ON da.rider_id = u.id
        WHERE da.order_id = :order_id
          AND da.status NOT IN ('CANCELLED')
        ORDER BY da.id DESC
        LIMIT 1
    ");
    $riderStmt->execute([':order_id' => $order['id']]);
    $riderAssignment = $riderStmt->fetch();
    $order['rider'] = $riderAssignment ?: null;

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data'   => $order,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to retrieve vendor order details.']);
}
