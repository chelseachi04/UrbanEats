<?php
/**
 * UrbanEats Phase 7: Migration Runner
 * Executes schema updates for approval status, vendor/rider codes, image upload columns, and online flags.
 */
require_once __DIR__ . '/config/db.php';

$pdo = getDBConnection();

// Helper to check if column exists
function columnExists($pdo, $table, $column) {
    $stmt = $pdo->prepare("
        SELECT COUNT(*) 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = :tbl AND COLUMN_NAME = :col
    ");
    $stmt->execute([':tbl' => $table, ':col' => $column]);
    return ((int)$stmt->fetchColumn()) > 0;
}

try {
    // 1. Alter users table
    if (!columnExists($pdo, 'users', 'application_status')) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `application_status` ENUM('APPROVED', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'APPROVED'");
    }
    if (!columnExists($pdo, 'users', 'vendor_code')) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `vendor_code` VARCHAR(50) NULL DEFAULT NULL UNIQUE");
    }
    if (!columnExists($pdo, 'users', 'rider_code')) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `rider_code` VARCHAR(50) NULL DEFAULT NULL UNIQUE");
    }
    if (!columnExists($pdo, 'users', 'is_online')) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `is_online` TINYINT(1) NOT NULL DEFAULT 0");
    }
    if (!columnExists($pdo, 'users', 'is_available')) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `is_available` TINYINT(1) NOT NULL DEFAULT 1");
    }
    if (!columnExists($pdo, 'users', 'approved_at')) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `approved_at` TIMESTAMP NULL DEFAULT NULL");
    }
    if (!columnExists($pdo, 'users', 'approved_by')) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `approved_by` INT NULL DEFAULT NULL");
    }

    // 2. Alter restaurants table
    if (!columnExists($pdo, 'restaurants', 'logo_url')) {
        $pdo->exec("ALTER TABLE `restaurants` ADD COLUMN `logo_url` VARCHAR(255) NULL DEFAULT NULL");
    }
    if (!columnExists($pdo, 'restaurants', 'cover_url')) {
        $pdo->exec("ALTER TABLE `restaurants` ADD COLUMN `cover_url` VARCHAR(255) NULL DEFAULT NULL");
    }

    // 3. Alter food_items table
    if (!columnExists($pdo, 'food_items', 'image_url')) {
        $pdo->exec("ALTER TABLE `food_items` ADD COLUMN `image_url` VARCHAR(255) NULL DEFAULT NULL");
    }

    // 4. Update seed vendor accounts
    $pdo->exec("UPDATE `users` SET `application_status` = 'APPROVED', `vendor_code` = 'UE-VND-000001', `approved_at` = NOW() WHERE `email` = 'delta@urbaneats.com'");
    $pdo->exec("UPDATE `users` SET `application_status` = 'APPROVED', `vendor_code` = 'UE-VND-000002', `approved_at` = NOW() WHERE `email` = 'mayor@urbaneats.com'");
    $pdo->exec("UPDATE `users` SET `application_status` = 'APPROVED', `vendor_code` = 'UE-VND-000003', `approved_at` = NOW() WHERE `email` = 'buka@urbaneats.com'");

    // 5. Update seed rider accounts
    $pdo->exec("UPDATE `users` SET `application_status` = 'APPROVED', `rider_code` = 'UE-RDR-000001', `is_online` = 1, `is_available` = 1, `approved_at` = NOW() WHERE `email` = 'rider1@urbaneats.com'");
    $pdo->exec("UPDATE `users` SET `application_status` = 'APPROVED', `rider_code` = 'UE-RDR-000002', `is_online` = 1, `is_available` = 1, `approved_at` = NOW() WHERE `email` = 'rider2@urbaneats.com'");

    header('Content-Type: application/json');
    echo json_encode([
        'status'  => 'success',
        'message' => 'Migration 008 (phase7 approval & image upload columns) executed successfully.'
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
