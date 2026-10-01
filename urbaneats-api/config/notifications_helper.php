<?php
/**
 * UrbanEats Centralized Notification System Helper
 * Provides server-side helper functions for triggering, creating, and fetching notifications.
 */

require_once __DIR__ . '/db.php';

function ensureNotificationsTableExists($pdo) {
    static $verified = false;
    if ($verified) return;

    $sql = "
    CREATE TABLE IF NOT EXISTS `notifications` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `user_id` INT NOT NULL,
        `type` VARCHAR(50) NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `message` TEXT NOT NULL,
        `related_order_id` INT NULL DEFAULT NULL,
        `related_restaurant_id` INT NULL DEFAULT NULL,
        `related_delivery_id` INT NULL DEFAULT NULL,
        `is_read` TINYINT(1) NOT NULL DEFAULT 0,
        `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_user_read` (`user_id`, `is_read`),
        INDEX `idx_created` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    try {
        $pdo->exec($sql);
        $verified = true;
    } catch (Exception $e) {
        // Table might already exist
    }
}

/**
 * Creates a notification for a specific user ID
 */
function createNotification($pdo, $userId, $type, $title, $message, $relatedOrderId = null, $relatedRestaurantId = null, $relatedDeliveryId = null) {
    if (!$userId) return false;
    ensureNotificationsTableExists($pdo);

    $stmt = $pdo->prepare("
        INSERT INTO notifications (user_id, type, title, message, related_order_id, related_restaurant_id, related_delivery_id, is_read, created_at)
        VALUES (:user_id, :type, :title, :message, :order_id, :restaurant_id, :delivery_id, 0, NOW())
    ");

    return $stmt->execute([
        ':user_id'       => (int)$userId,
        ':type'          => $type,
        ':title'         => $title,
        ':message'       => $message,
        ':order_id'      => $relatedOrderId ? (int)$relatedOrderId : null,
        ':restaurant_id' => $relatedRestaurantId ? (int)$relatedRestaurantId : null,
        ':delivery_id'   => $relatedDeliveryId ? (int)$relatedDeliveryId : null,
    ]);
}

/**
 * Creates a notification for all admin users
 */
function notifyAdmins($pdo, $type, $title, $message, $relatedOrderId = null, $relatedRestaurantId = null) {
    ensureNotificationsTableExists($pdo);
    $adminStmt = $pdo->query("SELECT id FROM users WHERE role = 'admin'");
    $admins = $adminStmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($admins as $adminId) {
        createNotification($pdo, $adminId, $type, $title, $message, $relatedOrderId, $relatedRestaurantId);
    }
}

/**
 * Creates a notification for all online and available approved riders
 */
function notifyEligibleRiders($pdo, $type, $title, $message, $relatedOrderId = null, $relatedRestaurantId = null) {
    ensureNotificationsTableExists($pdo);
    // Fetch all approved, active riders
    $riderStmt = $pdo->query("
        SELECT id FROM users 
        WHERE role = 'rider' 
          AND application_status = 'APPROVED' 
          AND (is_active = 1 OR is_active IS NULL)
    ");
    $riders = $riderStmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($riders as $riderId) {
        createNotification($pdo, $riderId, $type, $title, $message, $relatedOrderId, $relatedRestaurantId);
    }
}
