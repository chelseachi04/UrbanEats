<?php
/**
 * UrbanEats Notifications API — POST /notifications/mark_all_read.php
 * Marks all unread notifications for the authenticated user as read.
 *
 * SECURITY: User can only mark their own notifications as read.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/notifications_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

$stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = :uid AND is_read = 0");
$stmt->execute([':uid' => $userId]);

echo json_encode([
    'status'  => 'success',
    'message' => 'All notifications marked as read.'
]);
