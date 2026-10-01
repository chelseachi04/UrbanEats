<?php
/**
 * UrbanEats Admin API — POST /admin/approve_vendor.php
 *
 * Foundation endpoint for Admin to approve or reject a pending Vendor application.
 * Generates permanent unique Vendor ID (UE-VND-XXXXXX) upon approval and activates restaurant profile.
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


$stmt = $pdo->prepare("SELECT id, full_name, email, role, application_status, vendor_code FROM users WHERE id = :id AND role = 'vendor' LIMIT 1");
$stmt->execute([':id' => $targetUserId]);
$vendorUser = $stmt->fetch();

if (!$vendorUser) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Vendor applicant user account not found.']);
    exit;
}

if ($action === 'reject') {
    $up = $pdo->prepare("UPDATE users SET application_status = 'REJECTED', updated_at = NOW() WHERE id = :id");
    $up->execute([':id' => $targetUserId]);

    $upRest = $pdo->prepare("UPDATE restaurants SET is_active = 0 WHERE owner_id = :owner_id");
    $upRest->execute([':owner_id' => $targetUserId]);

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => "Vendor application for {$vendorUser['full_name']} rejected."
    ]);
    exit;
}

// Generate unique Vendor Code if not already generated
$vendorCode = $vendorUser['vendor_code'];
if (empty($vendorCode)) {
    $vendorCode = 'UE-VND-' . str_pad((string)$targetUserId, 6, '0', STR_PAD_LEFT);
}

// Update user status and activate linked restaurant
$up = $pdo->prepare("
    UPDATE users 
    SET application_status = 'APPROVED', vendor_code = :code, approved_at = NOW(), updated_at = NOW() 
    WHERE id = :id
");
$up->execute([':code' => $vendorCode, ':id' => $targetUserId]);

$upRest = $pdo->prepare("UPDATE restaurants SET is_active = 1 WHERE owner_id = :owner_id");
$upRest->execute([':owner_id' => $targetUserId]);

http_response_code(200);
echo json_encode([
    'status'  => 'success',
    'message' => "Vendor application for {$vendorUser['full_name']} approved successfully!",
    'data'    => [
        'user_id'            => $targetUserId,
        'vendor_code'        => $vendorCode,
        'application_status' => 'APPROVED'
    ]
]);
