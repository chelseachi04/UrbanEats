-- =============================================================================
-- UrbanEats Phase 2C-Prerequisites: User Favorites / Wishlist
-- Migration: 002_favorites.sql
--
-- PURPOSE:
--   Creates the `favorites` table for user-specific food item favorites.
--   This is the minimum required table to persist favorites per authenticated user.
--
-- SAFE TO RUN:
--   Uses CREATE TABLE IF NOT EXISTS to prevent duplicate creation.
--   Does NOT modify: users, restaurants, food_categories, food_items.
--
-- SCHEMA DESIGN:
--   - user_id   → FK to users.id (the authenticated customer)
--   - food_item_id → FK to food_items.id (the favorited dish)
--   - UNIQUE constraint prevents the same user from favoriting the same item twice
--   - No restaurant_id FK needed — food items already belong to a restaurant via food_items.restaurant_id
-- =============================================================================

USE `urbaneats_db`;

CREATE TABLE IF NOT EXISTS `favorites` (
    `id`           INT AUTO_INCREMENT PRIMARY KEY,
    `user_id`      INT NOT NULL,
    `food_item_id` INT NOT NULL,
    `created_at`   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Prevent the same user from adding the same item twice
    UNIQUE KEY `uq_user_food_favorite` (`user_id`, `food_item_id`),

    -- Index for fast lookup by user
    INDEX `idx_favorites_user` (`user_id`),

    -- Foreign key to authenticated users
    CONSTRAINT `fk_favorites_user`
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,

    -- Foreign key to food items
    CONSTRAINT `fk_favorites_food_item`
        FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
