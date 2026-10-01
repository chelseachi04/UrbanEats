<?php
/**
 * UrbanEats Rider API — GET & POST /rider/profile.php
 *
 * Retrieves and updates authenticated rider profile.
 *
 * Method:  GET | POST | PUT
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$pdo    = getDBConnection();

// Verify role = 'rider'
$userStmt = $pdo->prepare("SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$user = $userStmt->fetch();

if (!$user || strtolower($user['role']) !== 'rider') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Rider account required.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'data'   => [
            'id'         => (int) $user['id'],
            'full_name'  => $user['full_name'],
            'email'      => $user['email'],
            'phone'      => $user['phone'],
            'role'       => $user['role'],
            'created_at' => $user['created_at'],
        ],
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true);

    $fullName = isset($body['full_name']) ? trim((string)$body['full_name']) : '';
    $phone    = isset($body['phone']) ? trim((string)$body['phone']) : '';

    if (empty($fullName) || strlen($fullName) < 2) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please provide a valid full name.']);
        exit;
    }

    $upStmt = $pdo->prepare("
        UPDATE users
        SET full_name = :name, phone = :phone, updated_at = NOW()
        WHERE id = :id AND role = 'rider'
    ");
    $upStmt->execute([
        ':name'  => $fullName,
        ':phone' => $phone,
        ':id'    => $userId,
    ]);

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Rider profile updated successfully.',
        'data'    => [
            'id'        => $userId,
            'full_name' => $fullName,
            'email'     => $user['email'],
            'phone'     => $phone,
            'role'      => 'rider',
        ],
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
