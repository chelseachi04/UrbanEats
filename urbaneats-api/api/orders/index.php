<?php
/**
 * UrbanEats Orders API — GET /orders/index.php
 *
 * Returns all order history records for the currently authenticated customer.
 *
 * Method:  GET
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 *
 * SECURITY:
 *   - Never trusts a frontend-supplied user_id.
 *   - Uses $_SESSION['user_id'] exclusively to scope queries.
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
$isArchivedQuery = isset($_GET['archived']) && ($_GET['archived'] === '1' || $_GET['archived'] === 'true');
$isAllQuery      = isset($_GET['all']) && ($_GET['all'] === '1' || $_GET['all'] === 'true');

try {
    $pdo = getDBConnection();

    // Build SQL condition
    $whereClause = "WHERE o.user_id = :user_id";
    if (!$isAllQuery) {
        if ($isArchivedQuery) {
            $whereClause .= " AND o.archived_at IS NOT NULL";
        } else {
            $whereClause .= " AND o.archived_at IS NULL";
        }
    }

    // Fetch orders for this customer
    $stmt = $pdo->prepare("
        SELECT
            o.id,
            o.order_number,
            o.restaurant_id,
            o.restaurant_name,
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
            o.archived_at,
            o.created_at,
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
        FROM orders o
        {$whereClause}
        ORDER BY o.created_at DESC
    ");
    $stmt->execute([':user_id' => $userId]);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$order) {
        $order['id']            = (int) $order['id'];
        $order['restaurant_id'] = (int) $order['restaurant_id'];
        $order['subtotal']      = (float) $order['subtotal'];
        $order['delivery_fee']  = (float) $order['delivery_fee'];
        $order['total_amount']  = (float) $order['total_amount'];
        $order['item_count']    = (int) $order['item_count'];
    }
    unset($order);

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'count'  => count($orders),
        'data'   => $orders,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to retrieve order history. Please try again.']);
}
