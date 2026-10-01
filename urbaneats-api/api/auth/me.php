<?php
/**
 * UrbanEats Session Check Endpoint
 * GET /api/auth/me.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

if (empty($_SESSION['user_id'])) {
    http_response_code(200);
    echo json_encode([
        'status'        => 'success',
        'authenticated' => false,
        'user'          => null
    ]);
    exit;
}

$pdo = getDBConnection();
$stmt = $pdo->prepare("
    SELECT id, full_name, email, phone, role, application_status, vendor_code, rider_code, is_online, is_available, created_at
    FROM users
    WHERE id = :id
    LIMIT 1
");
$stmt->execute([':id' => $_SESSION['user_id']]);
$user = $stmt->fetch();

if (!$user) {
    session_unset();
    session_destroy();
    http_response_code(200);
    echo json_encode([
        'status'        => 'success',
        'authenticated' => false,
        'user'          => null
    ]);
    exit;
}

http_response_code(200);
echo json_encode([
    'status'        => 'success',
    'authenticated' => true,
    'user'          => [
        'id'                 => (int)$user['id'],
        'full_name'          => $user['full_name'],
        'email'              => $user['email'],
        'phone'              => $user['phone'],
        'role'               => $user['role'],
        'application_status' => $user['application_status'] ?? 'APPROVED',
        'vendor_code'        => $user['vendor_code'] ?? null,
        'rider_code'         => $user['rider_code'] ?? null,
        'is_online'          => (int)($user['is_online'] ?? 0),
        'is_available'       => (int)($user['is_available'] ?? 1),
        'created_at'         => $user['created_at']
    ]
]);
