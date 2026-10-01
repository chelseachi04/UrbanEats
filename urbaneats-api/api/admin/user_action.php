<?php
/**
 * UrbanEats Admin API — POST /admin/user_action.php
 * Handles user account activation, suspension, and safe deletion.
 *
 * Method:  POST
 * Body:    { "user_id": <int>, "action": "suspend" | "activate" | "delete" }
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

// Ensure `is_active` column exists on users table
try {
    $pdo->exec("ALTER TABLE `users` ADD COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT 1");
} catch (Exception $e) {
    // Column already exists
}

$body = json_decode(file_get_contents('php://input'), true);
$targetUserId = isset($body['user_id']) ? (int)$body['user_id'] : 0;
$action       = strtolower(trim((string)($body['action'] ?? '')));

if ($targetUserId <= 0 || !in_array($action, ['suspend', 'activate', 'delete'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Valid user_id and action (suspend, activate, delete) are required.']);
    exit;
}

// Prevent admin from suspending/deleting themselves
if ($targetUserId === (int)$_SESSION['user_id']) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'You cannot suspend or delete your own admin account.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, full_name, email, role, application_status FROM users WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $targetUserId]);
$targetUser = $stmt->fetch();

if (!$targetUser) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Target user account not found.']);
    exit;
}

if ($action === 'suspend') {
    $up = $pdo->prepare("UPDATE users SET is_active = 0, is_online = 0, is_available = 0, updated_at = NOW() WHERE id = :id");
    $up->execute([':id' => $targetUserId]);

    // If vendor, deactivate restaurant
    if ($targetUser['role'] === 'vendor') {
        $pdo->prepare("UPDATE restaurants SET is_active = 0 WHERE owner_id = :id")->execute([':id' => $targetUserId]);
    }

    echo json_encode([
        'status'  => 'success',
        'message' => "User {$targetUser['full_name']} account suspended successfully. Historical data preserved."
    ]);
    exit;
}

if ($action === 'activate') {
    $up = $pdo->prepare("UPDATE users SET is_active = 1, updated_at = NOW() WHERE id = :id");
    $up->execute([':id' => $targetUserId]);

    if ($targetUser['role'] === 'vendor') {
        $pdo->prepare("UPDATE restaurants SET is_active = 1 WHERE owner_id = :id")->execute([':id' => $targetUserId]);
    }

    echo json_encode([
        'status'  => 'success',
        'message' => "User {$targetUser['full_name']} account activated successfully."
    ]);
    exit;
}

if ($action === 'delete') {
    // Check historical orders count
    $orderCount = (int)$pdo->query("SELECT COUNT(*) FROM orders WHERE user_id = {$targetUserId}")->fetchColumn();
    $deliveryCount = (int)$pdo->query("SELECT COUNT(*) FROM delivery_assignments WHERE rider_id = {$targetUserId}")->fetchColumn();

    if ($orderCount > 0 || $deliveryCount > 0) {
        // Soft delete to protect historical order records
        $up = $pdo->prepare("UPDATE users SET is_active = 0, email = CONCAT('deleted_', id, '_', email), updated_at = NOW() WHERE id = :id");
        $up->execute([':id' => $targetUserId]);

        echo json_encode([
            'status'  => 'success',
            'message' => "User {$targetUser['full_name']} has active order history. Account deactivated & archived to safeguard records."
        ]);
        exit;
    }

    // Safe hard delete if no historical records
    $pdo->prepare("DELETE FROM users WHERE id = :id")->execute([':id' => $targetUserId]);

    echo json_encode([
        'status'  => 'success',
        'message' => "User {$targetUser['full_name']} account permanently deleted."
    ]);
    exit;
}
