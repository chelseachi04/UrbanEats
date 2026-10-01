<?php
/**
 * UrbanEats Database Schema Setup Script
 * Creates urbaneats_db and users table if they do not already exist.
 */

$host = '127.0.0.1';
$port = '3306';
$user = 'root';
$pass = '';

try {
    // 1. Connect without selecting database
    $pdo = new PDO("mysql:host=$host;port=$port", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // 2. Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `urbaneats_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "DATABASE 'urbaneats_db' verified/created.\n";

    // 3. Connect to urbaneats_db
    $pdo->exec("USE `urbaneats_db`;");

    // 4. Create users table
    $sql = "
    CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `full_name` VARCHAR(100) NOT NULL,
        `email` VARCHAR(150) NOT NULL UNIQUE,
        `phone` VARCHAR(30) NOT NULL,
        `password_hash` VARCHAR(255) NOT NULL,
        `role` ENUM('customer', 'vendor', 'rider', 'admin') DEFAULT 'customer' NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";

    $pdo->exec($sql);
    echo "TABLE 'users' verified/created successfully.\n";

} catch (PDOException $e) {
    echo "SETUP ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
