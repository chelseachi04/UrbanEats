<?php
/**
 * UrbanEats Admin API — POST /admin/approve_rider.php
 *
 * Foundation endpoint for Admin to approve or reject a pending Rider application.
 * Generates permanent unique Rider ID (UE-RDR-XXXXXX) upon approval.
 *
 * Method:  POST
 * Body:    { "user_id": <int>, "action": "approve" | "reject" }
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

$targetUserId = isset($body['user_id'])
    ? filter_var($body['user_id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])
    : false;

$action = isset($body['action']) ? strtolower(trim((string)$body['action'])) : '';

if ($targetUserId === false || !in_array($action, ['approve', 'reject'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid user_id and action (approve or reject) are required.']);
    exit;
}

$pdo = getDBConnection();

$stmt = $pdo->prepare("SELECT id, full_name, email, role, application_status, rider_code FROM users WHERE id = :id AND role = 'rider' LIMIT 1");
$stmt->execute([':id' => $targetUserId]);
$riderUser = $stmt->fetch();

if (!$riderUser) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Rider applicant user account not found.']);
    exit;
}

if ($action === 'reject') {
    $up = $pdo->prepare("UPDATE users SET application_status = 'REJECTED', is_online = 0, updated_at = NOW() WHERE id = :id");
    $up->execute([':id' => $targetUserId]);

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => "Rider application for {$riderUser['full_name']} rejected."
    ]);
    exit;
}

// Generate unique Rider Code if not already generated
$riderCode = $riderUser['rider_code'];
if (empty($riderCode)) {
    $riderCode = 'UE-RDR-' . str_pad((string)$targetUserId, 6, '0', STR_PAD_LEFT);
}

$up = $pdo->prepare("
    UPDATE users 
    SET application_status = 'APPROVED', rider_code = :code, is_online = 1, is_available = 1, approved_at = NOW(), updated_at = NOW() 
    WHERE id = :id
");
$up->execute([':code' => $riderCode, ':id' => $targetUserId]);

http_response_code(200);
echo json_encode([
    'status'  => 'success',
    'message' => "Rider application for {$riderUser['full_name']} approved successfully!",
    'data'    => [
        'user_id'            => $targetUserId,
        'rider_code'         => $riderCode,
        'application_status' => 'APPROVED'
    ]
]);
