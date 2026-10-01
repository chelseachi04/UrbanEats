<?php
/**
 * UrbanEats Rider API — POST /rider/toggle_online.php
 *
 * Toggles rider online / offline status (is_online = 1 | 0).
 * Only approved riders are eligible to go online.
 *
 * Method:  POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    { "is_online": 1 | 0 }
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

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

$userId = (int) $_SESSION['user_id'];
$body   = json_decode(file_get_contents('php://input'), true);

$isOnline = isset($body['is_online']) && ($body['is_online'] == 1 || $body['is_online'] === true) ? 1 : 0;

$pdo = getDBConnection();

// Verify role = 'rider' and application_status = 'APPROVED'
$userStmt = $pdo->prepare("SELECT id, role, application_status FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$user = $userStmt->fetch();

if (!$user || strtolower($user['role']) !== 'rider') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Rider account required.']);
    exit;
}

if (($user['application_status'] ?? '') !== 'APPROVED') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Your rider account application is under review. Only approved riders can go online.']);
    exit;
}

$upStmt = $pdo->prepare("UPDATE users SET is_online = :is_online, updated_at = NOW() WHERE id = :id AND role = 'rider'");
$upStmt->execute([':is_online' => $isOnline, ':id' => $userId]);

http_response_code(200);
echo json_encode([
    'status'    => 'success',
    'message'   => $isOnline ? 'You are now ONLINE and ready for delivery jobs.' : 'You are now OFFLINE.',
    'is_online' => $isOnline,
]);
