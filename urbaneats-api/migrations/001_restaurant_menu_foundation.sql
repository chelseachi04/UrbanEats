-- =============================================================================
-- UrbanEats Phase 2B-1: Restaurant & Menu Database Foundation
-- Migration: 001_restaurant_menu_foundation.sql
--
-- PURPOSE:
--   Creates the relational database tables for restaurants, food categories,
--   and food items. Seeds initial data from the existing UrbanEats frontend
--   (src/data/restaurantsData.js).
--
-- SAFE TO RUN:
--   Uses CREATE TABLE IF NOT EXISTS and INSERT IGNORE to prevent duplicates.
--   Does NOT drop or modify the existing `users` table.
--   Does NOT delete any existing customer authentication records.
--
-- CHARACTER SET: utf8mb4 / utf8mb4_unicode_ci (matches existing users table)
-- ENGINE: InnoDB (for foreign key support)
-- =============================================================================

USE `urbaneats_db`;

-- =============================================================================
-- TABLE: restaurants
-- =============================================================================
CREATE TABLE IF NOT EXISTS `restaurants` (
    `id`            INT AUTO_INCREMENT PRIMARY KEY,
    `owner_id`      INT NULL DEFAULT NULL,
    `name`          VARCHAR(150) NOT NULL,
    `slug`          VARCHAR(150) NOT NULL,
    `description`   TEXT NULL,
    `category`      VARCHAR(100) NULL,
    `location`      VARCHAR(255) NULL,
    `phone`         VARCHAR(30) NULL,
    `logo_image`    VARCHAR(500) NULL,
    `cover_image`   VARCHAR(500) NULL,
    `opening_hours` VARCHAR(100) NULL,
    `status`        ENUM('open', 'closed', 'temporarily_closed') NOT NULL DEFAULT 'open',
    `is_active`     TINYINT(1) NOT NULL DEFAULT 1,
    `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_restaurant_slug` (`slug`),
    INDEX `idx_restaurant_status` (`status`),
    INDEX `idx_restaurant_active` (`is_active`),
    INDEX `idx_restaurant_owner` (`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: food_categories
-- =============================================================================
CREATE TABLE IF NOT EXISTS `food_categories` (
    `id`          INT AUTO_INCREMENT PRIMARY KEY,
    `name`        VARCHAR(100) NOT NULL,
    `slug`        VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `sort_order`  INT NOT NULL DEFAULT 0,
    `created_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_category_slug` (`slug`),
    UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- TABLE: food_items
-- =============================================================================
CREATE TABLE IF NOT EXISTS `food_items` (
    `id`            INT AUTO_INCREMENT PRIMARY KEY,
    `restaurant_id` INT NOT NULL,
    `category_id`   INT NULL DEFAULT NULL,
    `name`          VARCHAR(200) NOT NULL,
    `slug`          VARCHAR(200) NOT NULL,
    `description`   TEXT NULL,
    `price`         DECIMAL(10,2) NOT NULL,
    `image`         VARCHAR(500) NULL,
    `is_available`  TINYINT(1) NOT NULL DEFAULT 1,
    `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_food_slug_restaurant` (`slug`, `restaurant_id`),
    INDEX `idx_food_restaurant` (`restaurant_id`),
    INDEX `idx_food_category` (`category_id`),
    INDEX `idx_food_available` (`is_available`),
    CONSTRAINT `fk_food_restaurant`
        FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_food_category`
        FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEED: food_categories (10 categories from existing frontend data)
-- =============================================================================
INSERT IGNORE INTO `food_categories` (`name`, `slug`, `description`, `sort_order`) VALUES
('Soups & Swallow',     'soups-and-swallow',     'Traditional Nigerian soups served with swallow', 1),
('Rice & Mains',        'rice-and-mains',         'Rice dishes and main meal plates', 2),
('Sides & Snacks',      'sides-and-snacks',       'Side dishes, snacks, and small chops', 3),
('Morning Specials',    'morning-specials',       'Breakfast dishes and morning meal combos', 4),
('Sandwiches & Bakery', 'sandwiches-and-bakery',  'Sandwiches, bread, croissants, and baked goods', 5),
('Bakery & Sweets',     'bakery-and-sweets',      'Pastries, pancakes, and sweet bakery items', 6),
('Cold Beverages',      'cold-beverages',         'Cold drinks, fresh juices, and chilled beverages', 7),
('Peppersoup & Grills', 'peppersoup-and-grills',  'Spicy peppersoup varieties and grilled meats', 8),
('Native Meals',        'native-meals',           'Traditional Nigerian native meal combinations', 9),
('Fast Meals',          'fast-meals',             'Quick ready-to-eat meals and fast food items', 10);

-- =============================================================================
-- SEED: restaurants (3 from existing frontend data)
-- =============================================================================
INSERT IGNORE INTO `restaurants` (`name`, `slug`, `description`, `category`, `location`, `opening_hours`, `status`, `is_active`, `cover_image`) VALUES
('Delta Food Palace', 'delta-food-palace',
 'Specializing in authentic native Delta soups, starch, fufu, jollof rice, and traditional dinner specialties prepared with fresh local ingredients.',
 'Traditional & Native Soups', 'Site II, Abraka, Delta State', '8:00 AM - 10:00 PM', 'open', 1,
 'src/Delta Food Palace/Delta Food Palace.webp'),
('Mayor Breakfast', 'mayor-breakfast',
 'Your premier morning stop for fluffy pancakes, freshly baked croissants, hot Akamu, egg sandwiches, and natural cold-pressed juices.',
 'Breakfast, Bakery & Fresh Juices', 'Campus Gate, Abraka, Delta State', '6:30 AM - 4:00 PM', 'open', 1,
 'src/Mayor Breakfast/Mayor Breakfast Restaurant.webp'),
('Royal Delta Buka', 'royal-delta-buka',
 'Authentic local buka flavors featuring spicy goat meat pepper soup, fried rice, catfish specials, and tasty fast food favorites.',
 'Native Buka & Grills', 'Abraka Main Market Road, Delta State', '10:00 AM - 11:00 PM', 'open', 1,
 'src/Royal Delta Buka/Royal Delta Buka.jpg');

-- =============================================================================
-- SEED: food_items — Delta Food Palace (6 items)
-- =============================================================================
INSERT IGNORE INTO `food_items` (`restaurant_id`, `category_id`, `name`, `slug`, `description`, `price`, `image`, `is_available`) VALUES
((SELECT id FROM restaurants WHERE slug='delta-food-palace'),(SELECT id FROM food_categories WHERE slug='soups-and-swallow'),
 'Banga Soup & Native Starch','banga-soup-native-starch','Rich palm fruit soup prepared with native Delta spices, fresh catfish, and soft yellow starch.',3500.00,'src/Delta Food Palace/Banga soup and Starch.jpg',1),
((SELECT id FROM restaurants WHERE slug='delta-food-palace'),(SELECT id FROM food_categories WHERE slug='soups-and-swallow'),
 'Delicious Egusi Soup & Fufu','delicious-egusi-soup-fufu','Flavorful melon seed soup garnished with stockfish, dry fish, beef, and served with pounded yam or fufu.',3200.00,'src/Delta Food Palace/Delicious Egusi soup.jpg',1),
((SELECT id FROM restaurants WHERE slug='delta-food-palace'),(SELECT id FROM food_categories WHERE slug='rice-and-mains'),
 'Smokey Nigerian Jollof Rice','smokey-nigerian-jollof-rice','Party style smokey jollof rice served with fried chicken and sweet plantains.',2800.00,'src/Delta Food Palace/NIGERIAN JOLLOF RICE.webp',1),
((SELECT id FROM restaurants WHERE slug='delta-food-palace'),(SELECT id FROM food_categories WHERE slug='soups-and-swallow'),
 'Amala, Gbegiri & Ewedu','amala-gbegiri-ewedu','Hot Amala served with traditional Ewedu, rich Gbegiri bean soup, and assorted meat.',3000.00,'src/Delta Food Palace/Amala , gbegiri , ewedu and some proteins.jpg',1),
((SELECT id FROM restaurants WHERE slug='delta-food-palace'),(SELECT id FROM food_categories WHERE slug='soups-and-swallow'),
 'Efo Riro Special','efo-riro-special','Rich vegetable soup cooked with pepper sauce, stockfish, and ponmo.',3400.00,'src/Delta Food Palace/Efo riro.webp',1),
((SELECT id FROM restaurants WHERE slug='delta-food-palace'),(SELECT id FROM food_categories WHERE slug='sides-and-snacks'),
 'Golden Fried Plantains (Dodo)','golden-fried-plantains-dodo','Sweet ripe plantains fried to golden perfection.',1200.00,'src/Delta Food Palace/Fried Plantains.webp',1);

-- =============================================================================
-- SEED: food_items — Mayor Breakfast (6 items)
-- =============================================================================
INSERT IGNORE INTO `food_items` (`restaurant_id`, `category_id`, `name`, `slug`, `description`, `price`, `image`, `is_available`) VALUES
((SELECT id FROM restaurants WHERE slug='mayor-breakfast'),(SELECT id FROM food_categories WHERE slug='morning-specials'),
 'Akamu (Pap) & Hot Moi Moi','akamu-pap-hot-moi-moi','Smooth yellow corn pap served with hot steamed egg-stuffed Moi Moi.',2000.00,'src/Mayor Breakfast/Akamu and Moi Moi.jpg',1),
((SELECT id FROM restaurants WHERE slug='mayor-breakfast'),(SELECT id FROM food_categories WHERE slug='sandwiches-and-bakery'),
 'Loaded Egg Sandwich','loaded-egg-sandwich','Double layer toast with fried eggs, fresh tomatoes, lettuce, and creamy spread.',1800.00,'src/Mayor Breakfast/Egg Sandwich.jpg',1),
((SELECT id FROM restaurants WHERE slug='mayor-breakfast'),(SELECT id FROM food_categories WHERE slug='morning-specials'),
 'All-American Breakfast Plate','all-american-breakfast-plate','Scrambled eggs, sausages, toasted bread, grilled tomato, and butter.',4500.00,'src/Mayor Breakfast/All-American Breakfast Plate.webp',1),
((SELECT id FROM restaurants WHERE slug='mayor-breakfast'),(SELECT id FROM food_categories WHERE slug='bakery-and-sweets'),
 'Stack of Fluffy Pancakes','stack-of-fluffy-pancakes','Three fluffy buttermilk pancakes drizzled with maple syrup and butter.',2500.00,'src/Mayor Breakfast/Pan cake.jpg',1),
((SELECT id FROM restaurants WHERE slug='mayor-breakfast'),(SELECT id FROM food_categories WHERE slug='sandwiches-and-bakery'),
 'Ham & Cheese Croissant','ham-cheese-croissant','Warm buttery croissant stuffed with savory cheese and sliced ham.',2200.00,'src/Mayor Breakfast/Ham and Cheese Croissants.webp',1),
((SELECT id FROM restaurants WHERE slug='mayor-breakfast'),(SELECT id FROM food_categories WHERE slug='cold-beverages'),
 'Fresh Watermelon Juice','fresh-watermelon-juice','100% natural cold-pressed fresh watermelon juice, served chilled.',1500.00,'src/Mayor Breakfast/Watermelon Juice.jpg',1);

-- =============================================================================
-- SEED: food_items — Royal Delta Buka (6 items)
-- =============================================================================
INSERT IGNORE INTO `food_items` (`restaurant_id`, `category_id`, `name`, `slug`, `description`, `price`, `image`, `is_available`) VALUES
((SELECT id FROM restaurants WHERE slug='royal-delta-buka'),(SELECT id FROM food_categories WHERE slug='peppersoup-and-grills'),
 'Assorted Goat Meat Pepper Soup','assorted-goat-meat-pepper-soup','Hot spicy pepper soup prepared with tender goat meat and traditional herbs.',3500.00,'src/Royal Delta Buka/Assorted Nigerian pepper soup.jpg',1),
((SELECT id FROM restaurants WHERE slug='royal-delta-buka'),(SELECT id FROM food_categories WHERE slug='rice-and-mains'),
 'Special Nigerian Fried Rice','special-nigerian-fried-rice','Seasoned fried rice packed with green peas, sweet corn, liver, and grilled chicken.',3000.00,'src/Royal Delta Buka/Nigerian Fried Rice.jpg',1),
((SELECT id FROM restaurants WHERE slug='royal-delta-buka'),(SELECT id FROM food_categories WHERE slug='soups-and-swallow'),
 'Calabar Afang Soup & Fufu','calabar-afang-soup-fufu','Rich Afang vegetable soup garnished with dry fish, kanda, and beef.',3600.00,'src/Royal Delta Buka/Afang soup.webp',1),
((SELECT id FROM restaurants WHERE slug='royal-delta-buka'),(SELECT id FROM food_categories WHERE slug='native-meals'),
 'Stewed Beans & Fried Plantain','stewed-beans-fried-plantain','Slow-cooked honey beans served with sweet fried dodo and fish.',2200.00,'src/Royal Delta Buka/Beans and plantain.webp',1),
((SELECT id FROM restaurants WHERE slug='royal-delta-buka'),(SELECT id FROM food_categories WHERE slug='peppersoup-and-grills'),
 'Fresh Catfish Pepper Soup','fresh-catfish-pepper-soup','Whole point-and-kill catfish pepper soup with authentic native spices.',4500.00,'src/Royal Delta Buka/Fresh Fish Peppersoup.jpg',1),
((SELECT id FROM restaurants WHERE slug='royal-delta-buka'),(SELECT id FROM food_categories WHERE slug='fast-meals'),
 'Stir-Fried Spaghetti Deluxe','stir-fried-spaghetti-deluxe','Spaghetti tossed with vegetables, frankfurters, and spicy tomato reduction.',2500.00,'src/Royal Delta Buka/Stirred fried spaghetti.jpg',1);
