<?php
/**
 * UrbanEats Phase 5: Vendor Migration Runner
 * Runs 006_vendor_restaurant_linking.sql against urbaneats_db.
 */

require_once __DIR__ . '/config/db.php';

$migrationFile = __DIR__ . '/migrations/006_vendor_restaurant_linking.sql';

if (!file_exists($migrationFile)) {
    die("ERROR: Migration file not found: $migrationFile\n");
}

$pdo = getDBConnection();

// Create seed vendor users with valid password_hash for 'password123'
$vendorUsers = [
    ['full_name' => 'Delta Palace Vendor',    'email' => 'delta@urbaneats.com', 'phone' => '08011112222', 'restaurant_id' => 1],
    ['full_name' => 'Mayor Breakfast Vendor', 'email' => 'mayor@urbaneats.com', 'phone' => '08033334444', 'restaurant_id' => 2],
    ['full_name' => 'Royal Delta Buka Vendor','email' => 'buka@urbaneats.com',  'phone' => '08055556666', 'restaurant_id' => 3],
];

$passHash = password_hash('password123', PASSWORD_DEFAULT);

$userInsert = $pdo->prepare("
    INSERT INTO users (full_name, email, phone, password_hash, role)
    VALUES (:name, :email, :phone, :hash, 'vendor')
    ON DUPLICATE KEY UPDATE role = 'vendor', password_hash = :hash_update
");

$updateRest = $pdo->prepare("UPDATE restaurants SET owner_id = :user_id WHERE id = :rest_id");

foreach ($vendorUsers as $v) {
    // 1. Insert/update user
    $userInsert->execute([
        ':name'        => $v['full_name'],
        ':email'       => $v['email'],
        ':phone'       => $v['phone'],
        ':hash'        => $passHash,
        ':hash_update' => $passHash,
    ]);

    // Fetch user ID
    $fetchStmt = $pdo->prepare("SELECT id FROM users WHERE email = :email LIMIT 1");
    $fetchStmt->execute([':email' => $v['email']]);
    $u = $fetchStmt->fetch();

    if ($u) {
        $updateRest->execute([':user_id' => (int)$u['id'], ':rest_id' => $v['restaurant_id']]);
    }
}

header('Content-Type: application/json');
echo json_encode([
    'status'  => 'success',
    'message' => 'Migration 006 (vendor_restaurant_linking) completed successfully.',
    'vendors' => $vendorUsers,
], JSON_PRETTY_PRINT);
