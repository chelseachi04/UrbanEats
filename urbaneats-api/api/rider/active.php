<?php
/**
 * UrbanEats Rider API — GET /rider/active.php
 *
 * Retrieves the currently active delivery details for the authenticated rider.
 *
 * Method:  GET
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
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

$userId = (int) $_SESSION['user_id'];
$pdo    = getDBConnection();

// Verify role = 'rider'
$userStmt = $pdo->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$userRec = $userStmt->fetch();

if (!$userRec || strtolower($userRec['role']) !== 'rider') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Rider account required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT
            da.id AS assignment_id,
            da.order_id,
            da.status AS delivery_status,
            da.assigned_at,
            da.accepted_at,
            da.picked_up_at,
            da.out_for_delivery_at,
            da.delivered_at,
            o.order_number,
            o.restaurant_id,
            o.restaurant_name,
            r.location AS restaurant_location,
            r.phone AS restaurant_phone,
            o.recipient_name,
            o.recipient_phone,
            o.delivery_address,
            o.delivery_area,
            o.delivery_city,
            o.subtotal,
            o.delivery_fee,
            o.total_amount,
            o.payment_status,
            o.payment_method,
            o.order_status,
            o.created_at AS order_created_at
        FROM delivery_assignments da
        JOIN orders o ON da.order_id = o.id
        LEFT JOIN restaurants r ON o.restaurant_id = r.id
        WHERE da.rider_id = :rider_id
          AND da.status IN ('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY')
        ORDER BY da.id DESC
        LIMIT 1
    ");
    $stmt->execute([':rider_id' => $userId]);
    $active = $stmt->fetch();

    if (!$active) {
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'data'   => null,
            'message'=> 'No active delivery in progress.'
        ]);
        exit;
    }

    $active['assignment_id'] = (int) $active['assignment_id'];
    $active['order_id']      = (int) $active['order_id'];
    $active['restaurant_id'] = (int) $active['restaurant_id'];
    $active['subtotal']      = (float) $active['subtotal'];
    $active['delivery_fee']  = (float) $active['delivery_fee'];
    $active['total_amount']  = (float) $active['total_amount'];

    // Fetch order items (immutable purchase snapshot)
    $itemStmt = $pdo->prepare("
        SELECT id, food_name, category_name, quantity, unit_price, subtotal
        FROM order_items
        WHERE order_id = :order_id
        ORDER BY id ASC
    ");
    $itemStmt->execute([':order_id' => $active['order_id']]);
    $items = $itemStmt->fetchAll();

    foreach ($items as &$it) {
        $it['id']         = (int) $it['id'];
        $it['quantity']   = (int) $it['quantity'];
        $it['unit_price'] = (float) $it['unit_price'];
        $it['subtotal']   = (float) $it['subtotal'];
    }
    unset($it);

    $active['items'] = $items;

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data'   => $active,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch active delivery.']);
}
