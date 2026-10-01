-- =============================================================================
-- UrbanEats Phase 3: Saved Addresses Database Foundation
-- Migration: 003_user_addresses.sql
--
-- PURPOSE:
--   Creates the `user_addresses` table for storing customer delivery addresses.
--
-- SAFE TO RUN:
--   Uses CREATE TABLE IF NOT EXISTS to prevent duplicate creation.
--   Does NOT modify: users, restaurants, food_categories, food_items, favorites.
--
-- SCHEMA DESIGN:
--   - user_id        → FK to users.id (authenticated customer)
--   - label          → e.g. Home, School, Work, Site 1
--   - recipient_name → Name of person receiving delivery
--   - phone          → Contact phone number
--   - address        → Street / landmark address
--   - area           → Area within Abraka (e.g. Site 1, Main Campus, Express)
--   - city           → Default Abraka
--   - state          → Default Delta State
--   - is_default     → 1 if primary address, 0 otherwise
-- =============================================================================

USE `urbaneats_db`;

CREATE TABLE IF NOT EXISTS `user_addresses` (
    `id`             INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`        INT NOT NULL,
    `label`          VARCHAR(50) NOT NULL DEFAULT 'Home',
    `recipient_name` VARCHAR(100) NOT NULL,
    `phone`          VARCHAR(30) NOT NULL,
    `address`        VARCHAR(255) NOT NULL,
    `area`           VARCHAR(100) NOT NULL DEFAULT 'Abraka',
    `city`           VARCHAR(50) NOT NULL DEFAULT 'Abraka',
    `state`          VARCHAR(50) NOT NULL DEFAULT 'Delta State',
    `is_default`     TINYINT(1) NOT NULL DEFAULT 0,
    `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX `idx_addresses_user` (`user_id`),
    INDEX `idx_addresses_default` (`is_default`),

    CONSTRAINT `fk_addresses_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
