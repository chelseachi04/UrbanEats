<?php
require_once __DIR__ . '/config/db.php';

try {
    $pdo = getDBConnection();

    // 1. Ensure columns exist in users table
    $columns = $pdo->query("SHOW COLUMNS FROM users")->fetchAll(PDO::FETCH_COLUMN);
    
    if (!in_array('application_status', $columns)) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `application_status` ENUM('APPROVED', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'APPROVED'");
    }
    if (!in_array('vendor_code', $columns)) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `vendor_code` VARCHAR(50) NULL DEFAULT NULL UNIQUE");
    }
    if (!in_array('rider_code', $columns)) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `rider_code` VARCHAR(50) NULL DEFAULT NULL UNIQUE");
    }
    if (!in_array('is_online', $columns)) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `is_online` TINYINT(1) NOT NULL DEFAULT 0");
    }
    if (!in_array('is_available', $columns)) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `is_available` TINYINT(1) NOT NULL DEFAULT 1");
    }
    if (!in_array('approved_at', $columns)) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `approved_at` TIMESTAMP NULL DEFAULT NULL");
    }
    if (!in_array('approved_by', $columns)) {
        $pdo->exec("ALTER TABLE `users` ADD COLUMN `approved_by` INT NULL DEFAULT NULL");
    }

    // Default password hash for 'password123'
    $defaultHash = password_hash('password123', PASSWORD_BCRYPT);

    // Accounts to seed / update
    $accounts = [
        [
            'full_name' => 'UrbanEats Admin',
            'email' => 'admin@urbaneats.com',
            'phone' => '08000000000',
            'password_hash' => $defaultHash,
            'role' => 'admin',
            'application_status' => 'APPROVED',
            'vendor_code' => null,
            'rider_code' => null,
            'is_online' => 1,
            'is_available' => 1,
        ],
        [
            'full_name' => 'Delta Palace Vendor',
            'email' => 'delta@urbaneats.com',
            'phone' => '08011112222',
            'password_hash' => $defaultHash,
            'role' => 'vendor',
            'application_status' => 'APPROVED',
            'vendor_code' => 'UE-VND-000001',
            'rider_code' => null,
            'is_online' => 1,
            'is_available' => 1,
        ],
        [
            'full_name' => 'Mayor Breakfast Vendor',
            'email' => 'mayor@urbaneats.com',
            'phone' => '08033334444',
            'password_hash' => $defaultHash,
            'role' => 'vendor',
            'application_status' => 'APPROVED',
            'vendor_code' => 'UE-VND-000002',
            'rider_code' => null,
            'is_online' => 1,
            'is_available' => 1,
        ],
        [
            'full_name' => 'Royal Delta Buka Vendor',
            'email' => 'buka@urbaneats.com',
            'phone' => '08055556666',
            'password_hash' => $defaultHash,
            'role' => 'vendor',
            'application_status' => 'APPROVED',
            'vendor_code' => 'UE-VND-000003',
            'rider_code' => null,
            'is_online' => 1,
            'is_available' => 1,
        ],
        [
            'full_name' => 'Swift Rider Delta',
            'email' => 'rider1@urbaneats.com',
            'phone' => '08077778888',
            'password_hash' => $defaultHash,
            'role' => 'rider',
            'application_status' => 'APPROVED',
            'vendor_code' => null,
            'rider_code' => 'UE-RDR-000001',
            'is_online' => 1,
            'is_available' => 1,
        ],
        [
            'full_name' => 'Abraka Express Rider',
            'email' => 'rider2@urbaneats.com',
            'phone' => '08088889999',
            'password_hash' => $defaultHash,
            'role' => 'rider',
            'application_status' => 'APPROVED',
            'vendor_code' => null,
            'rider_code' => 'UE-RDR-000002',
            'is_online' => 1,
            'is_available' => 1,
        ],
        [
            'full_name' => 'Demo Customer',
            'email' => 'customer@urbaneats.com',
            'phone' => '08012345678',
            'password_hash' => $defaultHash,
            'role' => 'customer',
            'application_status' => 'APPROVED',
            'vendor_code' => null,
            'rider_code' => null,
            'is_online' => 1,
            'is_available' => 1,
        ]
    ];

    foreach ($accounts as $acc) {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute([':email' => $acc['email']]);
        $existing = $stmt->fetch();

        if ($existing) {
            $update = $pdo->prepare("
                UPDATE users 
                SET full_name = :full_name,
                    phone = :phone,
                    password_hash = :password_hash,
                    role = :role,
                    application_status = :application_status,
                    vendor_code = :vendor_code,
                    rider_code = :rider_code,
                    is_online = :is_online,
                    is_available = :is_available,
                    approved_at = NOW()
                WHERE email = :email
            ");
            $update->execute([
                ':full_name' => $acc['full_name'],
                ':phone' => $acc['phone'],
                ':password_hash' => $acc['password_hash'],
                ':role' => $acc['role'],
                ':application_status' => $acc['application_status'],
                ':vendor_code' => $acc['vendor_code'],
                ':rider_code' => $acc['rider_code'],
                ':is_online' => $acc['is_online'],
                ':is_available' => $acc['is_available'],
                ':email' => $acc['email']
            ]);
            echo "Updated user: {$acc['email']} (role: {$acc['role']})\n";
        } else {
            $insert = $pdo->prepare("
                INSERT INTO users (full_name, email, phone, password_hash, role, application_status, vendor_code, rider_code, is_online, is_available, approved_at)
                VALUES (:full_name, :email, :phone, :password_hash, :role, :application_status, :vendor_code, :rider_code, :is_online, :is_available, NOW())
            ");
            $insert->execute([
                ':full_name' => $acc['full_name'],
                ':email' => $acc['email'],
                ':phone' => $acc['phone'],
                ':password_hash' => $acc['password_hash'],
                ':role' => $acc['role'],
                ':application_status' => $acc['application_status'],
                ':vendor_code' => $acc['vendor_code'],
                ':rider_code' => $acc['rider_code'],
                ':is_online' => $acc['is_online'],
                ':is_available' => $acc['is_available']
            ]);
            echo "Created user: {$acc['email']} (role: {$acc['role']})\n";
        }
    }

    // Link restaurants to vendors
    $pdo->exec("
        UPDATE restaurants r
        JOIN users u ON u.email = 'delta@urbaneats.com'
        SET r.owner_id = u.id
        WHERE r.id = 1 OR r.slug = 'delta-food-palace'
    ");
    $pdo->exec("
        UPDATE restaurants r
        JOIN users u ON u.email = 'mayor@urbaneats.com'
        SET r.owner_id = u.id
        WHERE r.id = 2 OR r.slug = 'mayor-breakfast'
    ");
    $pdo->exec("
        UPDATE restaurants r
        JOIN users u ON u.email = 'buka@urbaneats.com'
        SET r.owner_id = u.id
        WHERE r.id = 3 OR r.slug = 'royal-delta-buka'
    ");

    echo "Successfully linked restaurants to vendor owners.\n";

    // Print all users in DB
    $allUsers = $pdo->query("SELECT id, full_name, email, role, application_status, vendor_code, rider_code FROM users")->fetchAll();
    echo "\nCurrent Users in Database:\n";
    print_r($allUsers);

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
