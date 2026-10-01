<?php
/**
 * UrbanEats User Login Endpoint
 * POST /api/auth/login.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input payload.']);
    exit;
}

$email    = strtolower(trim($input['email'] ?? ''));
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required.']);
    exit;
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("
    SELECT id, full_name, email, phone, password_hash, role, application_status, vendor_code, rider_code, is_online, is_available
    FROM users
    WHERE email = :email
    LIMIT 1
");
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address or password.']);
    exit;
}

session_regenerate_id(true);
$_SESSION['user_id']   = (int)$user['id'];
$_SESSION['user_role'] = $user['role'];

http_response_code(200);
echo json_encode([
    'status'  => 'success',
    'message' => 'Login successful.',
    'user'    => [
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
    ]
]);
