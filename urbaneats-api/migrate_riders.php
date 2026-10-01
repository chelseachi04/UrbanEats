<?php
/**
 * UrbanEats Phase 6: Rider Migration Runner
 * Runs 007_rider_delivery_system.sql against urbaneats_db.
 */
require_once __DIR__ . '/config/db.php';

$pdo = getDBConnection();

// Create/Update seed rider users with valid password_hash for 'password123'
$riderUsers = [
    ['full_name' => 'Swift Rider Delta',     'email' => 'rider1@urbaneats.com', 'phone' => '08077778888'],
    ['full_name' => 'Abraka Express Rider', 'email' => 'rider2@urbaneats.com', 'phone' => '08088889999'],
];

$passHash = password_hash('password123', PASSWORD_DEFAULT);

// 1. Create table delivery_assignments
$tableSql = "
CREATE TABLE IF NOT EXISTS `delivery_assignments` (
    `id`                  INT AUTO_INCREMENT PRIMARY KEY,
    `order_id`            INT NOT NULL,
    `rider_id`            INT NOT NULL,
    `status`              ENUM('ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'ACCEPTED',
    `assigned_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `accepted_at`         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `picked_up_at`        TIMESTAMP NULL DEFAULT NULL,
    `out_for_delivery_at` TIMESTAMP NULL DEFAULT NULL,
    `delivered_at`        TIMESTAMP NULL DEFAULT NULL,
    `created_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `uq_order_assignment` (`order_id`),
    INDEX `idx_assignment_rider` (`rider_id`),
    INDEX `idx_assignment_status` (`status`),

    CONSTRAINT `fk_assignment_order`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_assignment_rider`
        FOREIGN KEY (`rider_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
";
$pdo->exec($tableSql);

// 2. Insert/Update rider accounts
$userInsert = $pdo->prepare("
    INSERT INTO users (full_name, email, phone, password_hash, role)
    VALUES (:name, :email, :phone, :hash, 'rider')
    ON DUPLICATE KEY UPDATE role = 'rider', password_hash = :hash_update, full_name = :name_update
");

foreach ($riderUsers as $r) {
    $userInsert->execute([
        ':name'        => $r['full_name'],
        ':email'       => $r['email'],
        ':phone'       => $r['phone'],
        ':hash'        => $passHash,
        ':hash_update' => $passHash,
        ':name_update' => $r['full_name'],
    ]);
}

header('Content-Type: application/json');
echo json_encode([
    'status'  => 'success',
    'message' => 'Migration 007 (rider_delivery_system) completed successfully.',
    'riders'  => $riderUsers,
], JSON_PRETTY_PRINT);
