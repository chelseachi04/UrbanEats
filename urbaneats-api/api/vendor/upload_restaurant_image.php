<?php
/**
 * UrbanEats Vendor API — POST /vendor/upload_restaurant_image.php
 *
 * Handles secure image uploads (logo or cover banner) for the vendor's restaurant.
 *
 * Method:  POST (multipart/form-data)
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session (role = 'vendor').
 * Body:    file: <Uploaded File>, type: "logo" | "cover"
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
$pdo    = getDBConnection();

// Verify role = 'vendor' and application_status = 'APPROVED'
$userStmt = $pdo->prepare("SELECT id, role, application_status FROM users WHERE id = :id LIMIT 1");
$userStmt->execute([':id' => $userId]);
$user = $userStmt->fetch();

if (!$user || strtolower($user['role']) !== 'vendor' || ($user['application_status'] ?? '') !== 'APPROVED') {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Access denied. Approved vendor account required.']);
    exit;
}

// Find vendor's restaurant
$restStmt = $pdo->prepare("SELECT id FROM restaurants WHERE owner_id = :owner_id LIMIT 1");
$restStmt->execute([':owner_id' => $userId]);
$restaurant = $restStmt->fetch();

if (!$restaurant) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'No restaurant found for this vendor account.']);
    exit;
}

$restId = (int)$restaurant['id'];

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid image file upload is required.']);
    exit;
}

$imageType = isset($_POST['type']) && strtolower($_POST['type']) === 'logo' ? 'logo' : 'cover';

$fileTmp  = $_FILES['image']['tmp_name'];
$fileSize = $_FILES['image']['size'];
$fileName = $_FILES['image']['name'];

// Validate file size (max 5MB)
if ($fileSize > 5 * 1024 * 1024) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Image file size exceeds maximum limit of 5MB.']);
    exit;
}

// Validate MIME type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime  = finfo_file($finfo, $fileTmp);
finfo_close($finfo);

$allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
if (!in_array($mime, $allowedMimes)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'Invalid image format. Allowed formats: JPG, PNG, WebP.']);
    exit;
}

$ext = pathinfo($fileName, PATHINFO_EXTENSION) ?: 'jpg';
$newFileName = "rest_{$imageType}_{$restId}_" . time() . '_' . bin2hex(random_bytes(4)) . '.' . strtolower($ext);

$uploadDir = __DIR__ . '/../../uploads/restaurants/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetPath = $uploadDir . $newFileName;

if (!move_uploaded_file($fileTmp, $targetPath)) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to save uploaded image.']);
    exit;
}

$relativeUrl = '/uploads/restaurants/' . $newFileName;

$column = ($imageType === 'logo') ? 'logo_url' : 'cover_url';
$upStmt = $pdo->prepare("UPDATE restaurants SET {$column} = :url, updated_at = NOW() WHERE id = :id AND owner_id = :owner_id");
$upStmt->execute([':url' => $relativeUrl, ':id' => $restId, ':owner_id' => $userId]);

http_response_code(200);
echo json_encode([
    'status'    => 'success',
    'message'   => ucfirst($imageType) . ' image uploaded and saved successfully.',
    'image_url' => $relativeUrl,
    'type'      => $imageType,
]);
