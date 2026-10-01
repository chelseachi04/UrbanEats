-- =============================================================================
-- UrbanEats Phase 7: Vendor & Rider Approval, Image Uploads & Smart Assignment
-- Migration: 008_vendor_rider_approval_and_smart_assignment.sql
-- =============================================================================

USE `urbaneats_db`;

-- 1. Alter users table to add application_status, vendor_code, rider_code, is_online, is_available
ALTER TABLE `users`
  ADD COLUMN `application_status` ENUM('APPROVED', 'PENDING', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
  ADD COLUMN `vendor_code` VARCHAR(50) NULL DEFAULT NULL UNIQUE,
  ADD COLUMN `rider_code` VARCHAR(50) NULL DEFAULT NULL UNIQUE,
  ADD COLUMN `is_online` TINYINT(1) NOT NULL DEFAULT 0,
  ADD COLUMN `is_available` TINYINT(1) NOT NULL DEFAULT 1,
  ADD COLUMN `approved_at` TIMESTAMP NULL DEFAULT NULL,
  ADD COLUMN `approved_by` INT NULL DEFAULT NULL;

-- 2. Alter restaurants table to add logo_url and cover_url
ALTER TABLE `restaurants`
  ADD COLUMN `logo_url` VARCHAR(255) NULL DEFAULT NULL,
  ADD COLUMN `cover_url` VARCHAR(255) NULL DEFAULT NULL;

-- 3. Alter food_items table to add image_url
ALTER TABLE `food_items`
  ADD COLUMN `image_url` VARCHAR(255) NULL DEFAULT NULL;

-- 4. Seed unique codes & ensure APPROVED status for seed vendors
UPDATE `users` SET `application_status` = 'APPROVED', `vendor_code` = 'UE-VND-000001', `approved_at` = NOW() WHERE `email` = 'delta@urbaneats.com';
UPDATE `users` SET `application_status` = 'APPROVED', `vendor_code` = 'UE-VND-000002', `approved_at` = NOW() WHERE `email` = 'mayor@urbaneats.com';
UPDATE `users` SET `application_status` = 'APPROVED', `vendor_code` = 'UE-VND-000003', `approved_at` = NOW() WHERE `email` = 'buka@urbaneats.com';

-- 5. Seed unique codes & ensure APPROVED status for seed riders
UPDATE `users` SET `application_status` = 'APPROVED', `rider_code` = 'UE-RDR-000001', `is_online` = 1, `is_available` = 1, `approved_at` = NOW() WHERE `email` = 'rider1@urbaneats.com';
UPDATE `users` SET `application_status` = 'APPROVED', `rider_code` = 'UE-RDR-000002', `is_online` = 1, `is_available` = 1, `approved_at` = NOW() WHERE `email` = 'rider2@urbaneats.com';
