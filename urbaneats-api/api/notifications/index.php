<?php
/**
 * UrbanEats Notifications API — GET /notifications/index.php
 * Fetches notifications for the authenticated user session.
 * Includes unread_count and paginated/limited notification items.
 *
 * SECURITY: Enforces strict user isolation. Users can ONLY access their own notifications.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/notifications_helper.php';

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

$userId = (int)$_SESSION['user_id'];
$pdo    = getDBConnection();
ensureNotificationsTableExists($pdo);

// Unread count for current user
$countStmt = $pdo->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = :uid AND is_read = 0");
$countStmt->execute([':uid' => $userId]);
$unreadCount = (int)$countStmt->fetchColumn();

// Fetch last 50 notifications for current user
$stmt = $pdo->prepare("
    SELECT id, user_id, type, title, message, related_order_id, related_restaurant_id, related_delivery_id, is_read, created_at
    FROM notifications
    WHERE user_id = :uid
    ORDER BY created_at DESC
    LIMIT 50
");
$stmt->execute([':uid' => $userId]);
$items = $stmt->fetchAll();

foreach ($items as &$item) {
    $item['id']                    = (int)$item['id'];
    $item['user_id']               = (int)$item['user_id'];
    $item['related_order_id']      = $item['related_order_id'] ? (int)$item['related_order_id'] : null;
    $item['related_restaurant_id'] = $item['related_restaurant_id'] ? (int)$item['related_restaurant_id'] : null;
    $item['related_delivery_id']   = $item['related_delivery_id'] ? (int)$item['related_delivery_id'] : null;
    $item['is_read']               = (bool)$item['is_read'];
}

echo json_encode([
    'status'       => 'success',
    'unread_count' => $unreadCount,
    'data'         => $items
]);
