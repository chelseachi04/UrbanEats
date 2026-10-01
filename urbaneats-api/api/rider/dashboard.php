<?php
/**
 * UrbanEats Rider API — GET /rider/dashboard.php
 *
 * Calculates real summary statistics and active delivery info for the authenticated rider.
 *
 * Method:  GET
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session (role = 'rider').
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

// Verify user role = 'rider'
$userStmt = $pdo->prepare("SELECT id, full_name, email, phone, role FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$user = $userStmt->fetch();

if (!$user || strtolower($user['role']) !== 'rider') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Rider account required.']);
    exit;
}

try {
    // 1. Available deliveries count (READY_FOR_DELIVERY & no active assignment)
    $availStmt = $pdo->query("
        SELECT COUNT(*) AS avail_count
        FROM orders o
        LEFT JOIN delivery_assignments da ON o.id = da.order_id
        WHERE o.order_status = 'READY_FOR_DELIVERY'
          AND (da.id IS NULL OR da.status = 'CANCELLED')
    ");
    $availCount = (int) ($availStmt->fetch()['avail_count'] ?? 0);

    // 2. Active delivery for this rider
    $activeStmt = $pdo->prepare("
        SELECT
            da.id AS assignment_id,
            da.order_id,
            da.status AS delivery_status,
            da.accepted_at,
            da.picked_up_at,
            da.out_for_delivery_at,
            o.order_number,
            o.restaurant_name,
            r.location AS restaurant_location,
            r.phone AS restaurant_phone,
            o.recipient_name,
            o.recipient_phone,
            o.delivery_address,
            o.delivery_area,
            o.total_amount,
            o.payment_status,
            o.order_status
        FROM delivery_assignments da
        JOIN orders o ON da.order_id = o.id
        LEFT JOIN restaurants r ON o.restaurant_id = r.id
        WHERE da.rider_id = :rider_id
          AND da.status IN ('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY')
        ORDER BY da.id DESC
        LIMIT 1
    ");
    $activeStmt->execute([':rider_id' => $userId]);
    $activeDelivery = $activeStmt->fetch();

    if ($activeDelivery) {
        $activeDelivery['assignment_id'] = (int) $activeDelivery['assignment_id'];
        $activeDelivery['order_id']      = (int) $activeDelivery['order_id'];
        $activeDelivery['total_amount']  = (float) $activeDelivery['total_amount'];
    }

    // 3. Deliveries metrics for this rider
    $statsStmt = $pdo->prepare("
        SELECT
            COUNT(*) AS total_completed,
            SUM(CASE WHEN DATE(delivered_at) = CURDATE() THEN 1 ELSE 0 END) AS today_completed
        FROM delivery_assignments
        WHERE rider_id = :rider_id AND status = 'DELIVERED'
    ");
    $statsStmt->execute([':rider_id' => $userId]);
    $stats = $statsStmt->fetch();

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data'   => [
            'rider' => [
                'id'        => (int) $user['id'],
                'full_name' => $user['full_name'],
                'email'     => $user['email'],
                'phone'     => $user['phone'],
            ],
            'metrics' => [
                'available_deliveries' => $availCount,
                'has_active_delivery'  => !empty($activeDelivery),
                'today_completed'      => (int) ($stats['today_completed'] ?? 0),
                'total_completed'      => (int) ($stats['total_completed'] ?? 0),
            ],
            'active_delivery' => $activeDelivery ?: null,
        ],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to fetch rider dashboard.']);
}
