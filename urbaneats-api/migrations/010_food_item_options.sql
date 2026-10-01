-- Migration 010: Add option_groups to food_items table
-- Allows vendors to configure dynamic customization options (e.g. Pack sizes, add-ons, variants)

ALTER TABLE `food_items` 
ADD COLUMN IF NOT EXISTS `option_groups` LONGTEXT DEFAULT NULL AFTER `image_url`;
