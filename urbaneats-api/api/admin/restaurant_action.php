<?php
/**
 * UrbanEats Admin API — POST /admin/restaurant_action.php
 * Handles activating/deactivating a restaurant outlet.
 *
 * Method: POST
 * Body:   { "restaurant_id": <int>, "is_active": 1 | 0 }
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

$pdo = getDBConnection();
$callerStmt = $pdo->prepare("SELECT role FROM users WHERE id = :id LIMIT 1");
$callerStmt->execute([':id' => (int)$_SESSION['user_id']]);
$callerRow = $callerStmt->fetch();

if (!$callerRow || $callerRow['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Admin access required.']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
$restaurantId = isset($body['restaurant_id']) ? (int)$body['restaurant_id'] : 0;
$isActive     = isset($body['is_active']) ? ((int)$body['is_active'] ? 1 : 0) : 0;

if ($restaurantId <= 0) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid restaurant_id is required.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, name FROM restaurants WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $restaurantId]);
$restaurant = $stmt->fetch();

if (!$restaurant) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Restaurant not found.']);
    exit;
}

$up = $pdo->prepare("UPDATE restaurants SET is_active = :active, updated_at = NOW() WHERE id = :id");
$up->execute([':active' => $isActive, ':id' => $restaurantId]);

$statusText = $isActive ? 'activated' : 'deactivated';

echo json_encode([
    'status'  => 'success',
    'message' => "Restaurant '{$restaurant['name']}' has been {$statusText}.",
    'data'    => [
        'restaurant_id' => $restaurantId,
        'is_active'     => (bool)$isActive
    ]
]);
