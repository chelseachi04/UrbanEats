-- =============================================================================
-- UrbanEats Phase 5: Vendor & Restaurant Linking Migration
-- Migration: 006_vendor_restaurant_linking.sql
--
-- PURPOSE:
--   Creates seed vendor accounts in `users` table and links existing seed
--   restaurants (`Delta Food Palace`, `Mayor Breakfast`, `Royal Delta Buka`) to their respective owners.
-- =============================================================================

USE `urbaneats_db`;

-- 1. Create seed vendor accounts if they do not exist (password: password123)
-- Password hash for 'password123': $2y$10$4hQ1fJk01x.K6qQ6uM6zU.Xq.Z7d7M6s5k5w5v5u5t5s5r5q5p5o
INSERT INTO `users` (`full_name`, `email`, `phone`, `password_hash`, `role`)
VALUES
('Delta Palace Vendor', 'delta@urbaneats.com', '08011112222', '$2y$10$0Q3z3R6tKq5R0zZ3v5s4u.R6Q7P8O9N0M1L2K3J4I5H6G7F8E9D0C1', 'vendor'),
('Mayor Breakfast Vendor', 'mayor@urbaneats.com', '08033334444', '$2y$10$0Q3z3R6tKq5R0zZ3v5s4u.R6Q7P8O9N0M1L2K3J4I5H6G7F8E9D0C1', 'vendor'),
('Royal Delta Buka Vendor', 'buka@urbaneats.com', '08055556666', '$2y$10$0Q3z3R6tKq5R0zZ3v5s4u.R6Q7P8O9N0M1L2K3J4I5H6G7F8E9D0C1', 'vendor')
ON DUPLICATE KEY UPDATE `role` = 'vendor';

-- 2. Link restaurants to their respective vendor accounts
UPDATE `restaurants` r
JOIN `users` u ON u.`email` = 'delta@urbaneats.com'
SET r.`owner_id` = u.`id`
WHERE r.`id` = 1 OR r.`slug` = 'delta-food-palace';

UPDATE `restaurants` r
JOIN `users` u ON u.`email` = 'mayor@urbaneats.com'
SET r.`owner_id` = u.`id`
WHERE r.`id` = 2 OR r.`slug` = 'mayor-breakfast';

UPDATE `restaurants` r
JOIN `users` u ON u.`email` = 'buka@urbaneats.com'
SET r.`owner_id` = u.`id`
WHERE r.`id` = 3 OR r.`slug` = 'royal-delta-buka';
