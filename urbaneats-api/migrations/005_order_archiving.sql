-- =============================================================================
-- UrbanEats Phase 4 Upgrade: Order Archiving Migration
-- Migration: 005_order_archiving.sql
--
-- PURPOSE:
--   Adds archived_at timestamp column to orders table to support user-controlled
--   soft archiving without deleting transaction records, order items, or payments.
-- =============================================================================

USE `urbaneats_db`;

ALTER TABLE `orders`
    ADD COLUMN IF NOT EXISTS `archived_at` TIMESTAMP NULL DEFAULT NULL AFTER `updated_at`,
    ADD INDEX IF NOT EXISTS `idx_orders_archived` (`archived_at`);
