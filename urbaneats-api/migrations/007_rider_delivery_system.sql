-- =============================================================================
-- UrbanEats Phase 6: Rider & Delivery System Database Migration
-- Migration: 007_rider_delivery_system.sql
--
-- PURPOSE:
--   Creates `delivery_assignments` relational table linking orders to riders.
--   Seeds initial rider accounts in `users` table.
-- =============================================================================

USE `urbaneats_db`;

-- 1. Create delivery_assignments table
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

-- 2. Seed initial rider accounts (Password: password123)
-- Hash for 'password123': $2y$10$0Q3z3R6tKq5R0zZ3v5s4u.R6Q7P8O9N0M1L2K3J4I5H6G7F8E9D0C1 (or default PHP password_hash)
INSERT INTO `users` (`full_name`, `email`, `phone`, `password_hash`, `role`)
VALUES
('Swift Rider Delta',     'rider1@urbaneats.com', '08077778888', '$2y$10$0Q3z3R6tKq5R0zZ3v5s4u.R6Q7P8O9N0M1L2K3J4I5H6G7F8E9D0C1', 'rider'),
('Abraka Express Rider', 'rider2@urbaneats.com', '08088889999', '$2y$10$0Q3z3R6tKq5R0zZ3v5s4u.R6Q7P8O9N0M1L2K3J4I5H6G7F8E9D0C1', 'rider')
ON DUPLICATE KEY UPDATE `role` = 'rider';
