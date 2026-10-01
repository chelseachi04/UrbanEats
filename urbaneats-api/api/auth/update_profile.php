<?php
/**
 * UrbanEats Auth API — POST /auth/update_profile.php
 *
 * Updates profile information (Full Name & Phone Number) for the session user.
 * Email address remains protected / read-only.
 *
 * Method:  POST
 * Auth:    Required — uses $_SESSION['user_id'] from PHP session.
 * Body:    {
 *            "full_name": "<string>",
 *            "phone": "<string>"
 *          }
 *
 * SECURITY:
 *   - Never trusts frontend user_id parameter.
 *   - Scoped strictly to $_SESSION['user_id'].
 *   - Validates input length & format.
 *   - Uses PDO prepared statements.
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method Not Allowed']);
    exit;
}

// --- Authentication Guard ---
if (empty($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Authentication required.']);
    exit;
}

$userId = (int) $_SESSION['user_id'];
$body   = json_decode(file_get_contents('php://input'), true);

$fullName = isset($body['full_name']) ? trim((string)$body['full_name']) : '';
$phone    = isset($body['phone'])     ? trim((string)$body['phone']) : '';

if (mb_strlen($fullName) < 2) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Full name must be at least 2 characters long.']);
    exit;
}

if (mb_strlen($phone) < 7) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Please enter a valid phone number (at least 7 digits).']);
    exit;
}

try {
    $pdo = getDBConnection();

    // Update user record scoped strictly to authenticated session
    $stmt = $pdo->prepare("
        UPDATE users
        SET
            full_name  = :full_name,
            phone      = :phone,
            updated_at = NOW()
        WHERE id = :id
    ");

    $stmt->execute([
        ':full_name' => $fullName,
        ':phone'     => $phone,
        ':id'        => $userId,
    ]);

    // Fetch updated user record to return to frontend
    $userStmt = $pdo->prepare("SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = :id LIMIT 1");
    $userStmt->execute([':id' => $userId]);
    $updatedUser = $userStmt->fetch();

    if (!$updatedUser) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'User record not found.']);
        exit;
    }

    $updatedUser['id'] = (int) $updatedUser['id'];

    http_response_code(200);
    echo json_encode([
        'status'  => 'success',
        'message' => 'Profile updated successfully.',
        'user'    => $updatedUser,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Unable to update profile. Please try again.']);
}
