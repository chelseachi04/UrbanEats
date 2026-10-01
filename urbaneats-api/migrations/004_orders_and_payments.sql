-- =============================================================================
-- UrbanEats Phase 4: Orders & Payments Database Foundation
-- Migration: 004_orders_and_payments.sql
--
-- PURPOSE:
--   Creates the relational database tables for orders, order items (snapshots),
--   and payment transaction history.
--
-- SAFE TO RUN:
--   Uses CREATE TABLE IF NOT EXISTS to prevent duplicate creation.
--   Does NOT drop or modify existing tables.
-- =============================================================================

USE `urbaneats_db`;

-- =============================================================================
-- TABLE: orders
-- =============================================================================
CREATE TABLE IF NOT EXISTS `orders` (
    `id`                  INT AUTO_INCREMENT PRIMARY KEY,
    `order_number`        VARCHAR(50) NOT NULL,
    `user_id`             INT NOT NULL,
    `restaurant_id`       INT NOT NULL,
    `restaurant_name`     VARCHAR(150) NOT NULL,
    `delivery_address_id` INT NULL DEFAULT NULL,
    `recipient_name`      VARCHAR(100) NOT NULL,
    `recipient_phone`     VARCHAR(30) NOT NULL,
    `delivery_address`    VARCHAR(255) NOT NULL,
    `delivery_area`       VARCHAR(100) NOT NULL,
    `delivery_city`       VARCHAR(50) NOT NULL DEFAULT 'Abraka',
    `delivery_state`      VARCHAR(50) NOT NULL DEFAULT 'Delta State',
    `subtotal`            DECIMAL(10,2) NOT NULL,
    `delivery_fee`        DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    `total_amount`        DECIMAL(10,2) NOT NULL,
    `order_status`        ENUM('PENDING_PAYMENT', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING_PAYMENT',
    `payment_status`      ENUM('PENDING', 'PAID', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `payment_method`      VARCHAR(50) NOT NULL DEFAULT 'FLUTTERWAVE',
    `payment_reference`   VARCHAR(100) NULL DEFAULT NULL,
    `created_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `uq_order_number` (`order_number`),
    INDEX `idx_orders_user` (`user_id`),
    INDEX `idx_orders_restaurant` (`restaurant_id`),
    INDEX `idx_orders_status` (`order_status`),
    INDEX `idx_orders_payment_status` (`payment_status`),

    CONSTRAINT `fk_orders_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_orders_restaurant`
        FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_orders_address`
        FOREIGN KEY (`delivery_address_id`) REFERENCES `user_addresses` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: order_items (immutable snapshots of purchased food items)
-- =============================================================================
CREATE TABLE IF NOT EXISTS `order_items` (
    `id`            INT AUTO_INCREMENT PRIMARY KEY,
    `order_id`      INT NOT NULL,
    `food_item_id`  INT NULL DEFAULT NULL,
    `food_name`     VARCHAR(200) NOT NULL,
    `food_slug`     VARCHAR(200) NULL DEFAULT NULL,
    `category_name` VARCHAR(100) NULL DEFAULT NULL,
    `quantity`      INT NOT NULL DEFAULT 1,
    `unit_price`    DECIMAL(10,2) NOT NULL,
    `subtotal`      DECIMAL(10,2) NOT NULL,
    `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX `idx_order_items_order` (`order_id`),
    INDEX `idx_order_items_food` (`food_item_id`),

    CONSTRAINT `fk_order_items_order`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_order_items_food`
        FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: payments
-- =============================================================================
CREATE TABLE IF NOT EXISTS `payments` (
    `id`           INT AUTO_INCREMENT PRIMARY KEY,
    `order_id`     INT NOT NULL,
    `user_id`      INT NOT NULL,
    `tx_ref`       VARCHAR(150) NOT NULL,
    `flw_ref`      VARCHAR(150) NULL DEFAULT NULL,
    `amount`       DECIMAL(10,2) NOT NULL,
    `currency`     VARCHAR(10) NOT NULL DEFAULT 'NGN',
    `status`       ENUM('PENDING', 'SUCCESSFUL', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `raw_response` TEXT NULL DEFAULT NULL,
    `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE KEY `uq_payment_tx_ref` (`tx_ref`),
    INDEX `idx_payments_order` (`order_id`),
    INDEX `idx_payments_user` (`user_id`),

    CONSTRAINT `fk_payments_order`
        FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT `fk_payments_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
