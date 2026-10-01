<?php
/**
 * UrbanEats Notifications API — POST /notifications/mark_read.php
 * Marks a single notification as read.
 *
 * Body: { "id": <int> }
 * SECURITY: User can only mark their own notification as read.
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
$body   = json_decode(file_get_contents('php://input'), true);
$id     = isset($body['id']) ? (int)$body['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Notification ID is required.']);
    exit;
}

$pdo = getDBConnection();
ensureNotificationsTableExists($pdo);

$stmt = $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = :id AND user_id = :uid");
$stmt->execute([':id' => $id, ':uid' => $userId]);

echo json_encode([
    'status'  => 'success',
    'message' => 'Notification marked as read.'
]);
