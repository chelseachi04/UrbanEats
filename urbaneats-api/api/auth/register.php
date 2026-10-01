<?php
/**
 * UrbanEats API — POST /auth/register.php
 *
 * Customer accounts: Created with application_status = 'APPROVED'.
 * Vendor/Rider accounts: Created with application_status = 'PENDING' and restaurants.is_active = 0.
 *
 * Method:  POST
 * Body:    { "fullName", "email", "phone", "password", "role" }
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../config/notifications_helper.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$input    = json_decode($rawInput, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
    exit;
}

$fullName = trim($input['fullName'] ?? '');
$email    = strtolower(trim($input['email'] ?? ''));
$phone    = trim($input['phone'] ?? '');
$password = $input['password'] ?? '';
$role     = strtolower(trim($input['role'] ?? 'customer'));

if (!in_array($role, ['customer', 'vendor', 'rider'])) {
    $role = 'customer';
}

if (empty($fullName) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Full name, email, and password are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address format.']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Password must be at least 6 characters long.']);
    exit;
}

$pdo = getDBConnection();

// Check if email already exists
$checkStmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
$checkStmt->execute([':email' => $email]);

if ($checkStmt->fetch()) {
    http_response_code(409);
    echo json_encode(['status' => 'error', 'message' => 'An account with this email address already exists.']);
    exit;
}

$passwordHash = password_hash($password, PASSWORD_BCRYPT);
$appStatus    = ($role === 'customer') ? 'APPROVED' : 'PENDING';

$insertStmt = $pdo->prepare("
    INSERT INTO users (full_name, email, phone, password_hash, role, application_status, created_at)
    VALUES (:full_name, :email, :phone, :password_hash, :role, :app_status, NOW())
");

$insertStmt->execute([
    ':full_name'     => $fullName,
    ':email'         => $email,
    ':phone'         => $phone,
    ':password_hash' => $passwordHash,
    ':role'          => $role,
    ':app_status'    => $appStatus
]);

$userId = (int)$pdo->lastInsertId();

// If Vendor, create linked Restaurant record (is_active = 0 until approved)
if ($role === 'vendor') {
    $restName = trim($input['restaurantName'] ?? '') ?: ($fullName . " Buka");
    $restSlug = strtolower(preg_replace('/[^a-z0-9]+/', '-', $restName)) . '-' . $userId;
    $category = trim($input['category'] ?? '') ?: 'General';
    $address  = trim($input['address'] ?? '') ?: 'Abraka, Delta State';

    $restInsert = $pdo->prepare("
        INSERT INTO restaurants (owner_id, name, slug, description, category, location, phone, status, is_active)
        VALUES (:owner_id, :name, :slug, :desc, :category, :location, :phone, 'open', 0)
    ");
    $restInsert->execute([
        ':owner_id' => $userId,
        ':name'     => $restName,
        ':slug'     => $restSlug,
        ':desc'     => "Delicious meals prepared by {$restName}.",
        ':category' => $category,
        ':location' => $address,
        ':phone'    => $phone,
    ]);
}

// Notify Admins if Vendor or Rider application submitted
if ($role === 'vendor' || $role === 'rider') {
    $type = ($role === 'vendor') ? 'NEW_VENDOR_APPLICATION' : 'NEW_RIDER_APPLICATION';
    notifyAdmins(
        $pdo,
        $type,
        "New " . ucfirst($role) . " Application",
        "{$fullName} has submitted a new " . ucfirst($role) . " application."
    );
}

// Create PHP Server-Side Authenticated Session
session_regenerate_id(true);
$_SESSION['user_id']   = $userId;
$_SESSION['user_role'] = $role;

http_response_code(201);
echo json_encode([
    'status'  => 'success',
    'message' => ($appStatus === 'PENDING')
        ? "Your " . ucfirst($role) . " application has been submitted and is currently under review by Admin."
        : ucfirst($role) . " account registered successfully.",
    'user'    => [
        'id'                 => $userId,
        'full_name'          => $fullName,
        'email'              => $email,
        'phone'              => $phone,
        'role'               => $role,
        'application_status' => $appStatus,
    ],
]);
