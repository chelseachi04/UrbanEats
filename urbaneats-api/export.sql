-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: urbaneats_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `delivery_assignments`
--

DROP TABLE IF EXISTS `delivery_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `rider_id` int(11) NOT NULL,
  `status` enum('ASSIGNED','ACCEPTED','PICKED_UP','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') NOT NULL DEFAULT 'ACCEPTED',
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `accepted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `picked_up_at` timestamp NULL DEFAULT NULL,
  `out_for_delivery_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_order_assignment` (`order_id`),
  KEY `idx_assignment_rider` (`rider_id`),
  KEY `idx_assignment_status` (`status`),
  CONSTRAINT `fk_assignment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_assignment_rider` FOREIGN KEY (`rider_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_assignments`
--

LOCK TABLES `delivery_assignments` WRITE;
/*!40000 ALTER TABLE `delivery_assignments` DISABLE KEYS */;
INSERT INTO `delivery_assignments` VALUES (7,1,25,'DELIVERED','2026-08-01 03:30:56','2026-08-01 03:30:56','2026-08-01 03:31:08','2026-08-01 03:31:12','2026-08-01 03:31:27','2026-08-01 03:30:56','2026-08-01 03:31:27'),(8,15,25,'DELIVERED','2026-08-01 16:35:05','2026-08-01 16:35:05','2026-08-01 16:37:19','2026-08-01 16:37:26','2026-08-01 16:37:27','2026-08-01 16:35:05','2026-08-01 16:37:27'),(9,16,26,'DELIVERED','2026-08-01 16:35:40','2026-08-01 16:35:40','2026-08-01 16:36:34','2026-08-01 16:36:34','2026-08-01 16:36:36','2026-08-01 16:35:40','2026-08-01 16:36:36'),(10,5,26,'DELIVERED','2026-08-01 16:36:42','2026-08-01 16:36:42','2026-08-01 16:36:44','2026-08-01 16:36:44','2026-08-01 16:36:45','2026-08-01 16:36:42','2026-08-01 16:36:45'),(11,20,26,'DELIVERED','2026-08-01 16:36:51','2026-08-01 16:36:51','2026-08-01 16:36:52','2026-08-01 16:36:53','2026-08-01 16:36:54','2026-08-01 16:36:51','2026-08-01 16:36:54'),(12,3,25,'DELIVERED','2026-08-01 16:37:32','2026-08-01 16:37:32','2026-08-01 16:37:34','2026-08-01 16:37:35','2026-08-01 16:37:36','2026-08-01 16:37:32','2026-08-01 16:37:36'),(13,2,25,'DELIVERED','2026-08-01 16:37:43','2026-08-01 16:37:43','2026-08-01 16:37:45','2026-08-01 16:37:46','2026-08-01 16:37:47','2026-08-01 16:37:43','2026-08-01 16:37:47'),(14,18,25,'DELIVERED','2026-08-01 16:38:02','2026-08-01 16:38:02','2026-08-01 16:38:04','2026-08-01 16:38:05','2026-08-01 16:38:06','2026-08-01 16:38:02','2026-08-01 16:38:06'),(15,17,25,'DELIVERED','2026-08-01 16:38:11','2026-08-01 16:38:11','2026-08-01 16:38:26','2026-08-01 16:38:27','2026-08-01 16:38:28','2026-08-01 16:38:11','2026-08-01 16:38:28'),(16,21,26,'DELIVERED','2026-08-01 16:51:24','2026-08-01 16:51:24','2026-08-01 16:51:32','2026-08-01 16:51:34','2026-08-01 16:51:36','2026-08-01 16:51:24','2026-08-01 16:51:36'),(17,22,26,'DELIVERED','2026-08-01 16:52:06','2026-08-01 16:52:06','2026-08-01 16:52:15','2026-08-04 16:59:02','2026-08-04 16:59:04','2026-08-01 16:52:06','2026-08-04 16:59:04'),(18,28,25,'DELIVERED','2026-08-02 16:19:22','2026-08-02 16:19:22','2026-08-02 16:19:25','2026-08-02 16:19:26','2026-08-02 16:19:28','2026-08-02 16:19:22','2026-08-02 16:19:28'),(19,29,25,'DELIVERED','2026-08-02 17:31:40','2026-08-02 17:31:40','2026-08-02 17:31:40','2026-08-02 17:31:40','2026-08-02 17:31:40','2026-08-02 17:31:40','2026-08-02 17:31:40'),(20,27,26,'DELIVERED','2026-08-02 18:46:59','2026-08-02 18:46:59','2026-08-04 16:58:59','2026-08-04 16:59:00','2026-08-04 16:59:01','2026-08-02 18:46:59','2026-08-04 16:59:01'),(21,34,25,'DELIVERED','2026-08-02 19:54:46','2026-08-02 19:54:46','2026-08-02 19:54:49','2026-08-02 19:54:53','2026-08-02 19:54:57','2026-08-02 19:54:46','2026-08-02 19:54:57'),(22,35,25,'DELIVERED','2026-08-02 21:30:23','2026-08-02 21:30:23','2026-08-02 21:35:23','2026-08-02 21:35:24','2026-08-02 21:35:25','2026-08-02 21:30:23','2026-08-02 21:35:25'),(23,37,25,'DELIVERED','2026-08-02 21:35:29','2026-08-02 21:35:29','2026-08-02 21:35:31','2026-08-02 21:35:32','2026-08-02 21:35:33','2026-08-02 21:35:29','2026-08-02 21:35:33'),(24,38,25,'DELIVERED','2026-08-02 23:13:15','2026-08-02 23:13:15','2026-08-02 23:42:40','2026-08-02 23:43:39','2026-08-02 23:44:00','2026-08-02 23:13:15','2026-08-02 23:44:00'),(25,39,25,'DELIVERED','2026-08-02 23:48:01','2026-08-02 23:48:01','2026-08-02 23:48:34','2026-08-02 23:48:59','2026-08-02 23:49:21','2026-08-02 23:48:01','2026-08-02 23:49:21'),(26,40,25,'DELIVERED','2026-08-03 00:32:12','2026-08-03 00:32:12','2026-08-03 00:32:15','2026-08-03 00:32:17','2026-08-03 00:32:25','2026-08-03 00:32:12','2026-08-03 00:32:25'),(27,43,26,'DELIVERED','2026-08-04 17:00:10','2026-08-04 17:00:10','2026-08-04 17:00:12','2026-08-04 17:00:13','2026-08-04 17:00:15','2026-08-04 17:00:10','2026-08-04 17:00:15'),(28,23,26,'DELIVERED','2026-08-04 20:09:04','2026-08-04 20:09:04','2026-08-04 20:09:11','2026-08-04 20:09:12','2026-08-04 20:09:13','2026-08-04 20:09:04','2026-08-04 20:09:13'),(29,25,26,'ACCEPTED','2026-08-04 20:17:50','2026-08-04 20:17:50',NULL,NULL,NULL,'2026-08-04 20:17:50','2026-08-04 20:17:50');
/*!40000 ALTER TABLE `delivery_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `food_item_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_food_favorite` (`user_id`,`food_item_id`),
  KEY `idx_favorites_user` (`user_id`),
  KEY `fk_favorites_food_item` (`food_item_id`),
  CONSTRAINT `fk_favorites_food_item` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES (1,5,1,'2026-07-30 15:30:11'),(5,7,1,'2026-07-30 18:25:20');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_categories`
--

DROP TABLE IF EXISTS `food_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_category_slug` (`slug`),
  UNIQUE KEY `uq_category_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_categories`
--

LOCK TABLES `food_categories` WRITE;
/*!40000 ALTER TABLE `food_categories` DISABLE KEYS */;
INSERT INTO `food_categories` VALUES (1,'Soups & Swallow','soups-and-swallow','Traditional Nigerian soups served with swallow',1,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(2,'Rice & Mains','rice-and-mains','Rice dishes and main meal plates',2,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(3,'Sides & Snacks','sides-and-snacks','Side dishes, snacks, and small chops',3,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(4,'Morning Specials','morning-specials','Breakfast dishes and morning meal combos',4,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(5,'Sandwiches & Bakery','sandwiches-and-bakery','Sandwiches, bread, croissants, and baked goods',5,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(6,'Bakery & Sweets','bakery-and-sweets','Pastries, pancakes, and sweet bakery items',6,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(7,'Cold Beverages','cold-beverages','Cold drinks, fresh juices, and chilled beverages',7,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(8,'Peppersoup & Grills','peppersoup-and-grills','Spicy peppersoup varieties and grilled meats',8,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(9,'Native Meals','native-meals','Traditional Nigerian native meal combinations',9,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(10,'Fast Meals','fast-meals','Quick ready-to-eat meals and fast food items',10,'2026-07-28 18:55:17','2026-07-28 18:55:17'),(11,'Spaghetti','-paghetti',NULL,0,'2026-08-01 01:49:37','2026-08-01 01:49:37');
/*!40000 ALTER TABLE `food_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_items`
--

DROP TABLE IF EXISTS `food_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_url` varchar(255) DEFAULT NULL,
  `option_groups` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_food_slug_restaurant` (`slug`,`restaurant_id`),
  KEY `idx_food_restaurant` (`restaurant_id`),
  KEY `idx_food_category` (`category_id`),
  KEY `idx_food_available` (`is_available`),
  CONSTRAINT `fk_food_category` FOREIGN KEY (`category_id`) REFERENCES `food_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_food_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_items`
--

LOCK TABLES `food_items` WRITE;
/*!40000 ALTER TABLE `food_items` DISABLE KEYS */;
INSERT INTO `food_items` VALUES (1,1,1,'Banga Soup & Native Starch','banga-soup-native-starch','',3500.00,'src/Delta Food Palace/Banga soup and Starch.jpg',1,'2026-07-28 18:55:17','2026-08-02 23:23:59',NULL),(2,1,1,'Egusi Soup & Fufu','delicious-egusi-soup-fufu','',3200.00,'src/Delta Food Palace/Delicious Egusi soup.jpg',1,'2026-07-28 18:55:17','2026-08-01 03:11:50',NULL),(3,1,2,'Smokey Nigerian Jollof Rice','smokey-nigerian-jollof-rice','',2800.00,'src/Delta Food Palace/NIGERIAN JOLLOF RICE.webp',1,'2026-07-28 18:55:17','2026-08-19 01:42:45',NULL),(4,1,1,'Amala, Gbegiri & Ewedu','amala-gbegiri-ewedu','Hot Amala served with traditional Ewedu, rich Gbegiri bean soup, and assorted meat.',3000.00,'src/Delta Food Palace/Amala , gbegiri , ewedu and some proteins.jpg',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(5,1,1,'Efo Riro Special','efo-riro-special','Rich vegetable soup cooked with pepper sauce, stockfish, and ponmo.',3400.00,'src/Delta Food Palace/Efo riro.webp',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(7,2,4,'Akamu (Pap) & Hot Moi Moi','akamu-pap-hot-moi-moi','Smooth yellow corn pap served with hot steamed egg-stuffed Moi Moi.',2000.00,'src/Mayor Breakfast/Akamu and Moi Moi.jpg',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(8,2,5,'Loaded Egg Sandwich','loaded-egg-sandwich','Double layer toast with fried eggs, fresh tomatoes, lettuce, and creamy spread.',1800.00,'src/Mayor Breakfast/Egg Sandwich.jpg',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(9,2,4,'All-American Breakfast Plate','all-american-breakfast-plate','Scrambled eggs, sausages, toasted bread, grilled tomato, and butter.',4500.00,'src/Mayor Breakfast/All-American Breakfast Plate.webp',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(10,2,6,'Stack of Fluffy Pancakes','stack-of-fluffy-pancakes','Three fluffy buttermilk pancakes drizzled with maple syrup and butter.',2500.00,'src/Mayor Breakfast/Pan cake.jpg',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(11,2,5,'Ham & Cheese Croissant','ham-cheese-croissant','Warm buttery croissant stuffed with savory cheese and sliced ham.',2200.00,'src/Mayor Breakfast/Ham and Cheese Croissants.webp',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(12,2,7,'Fresh Watermelon Juice','fresh-watermelon-juice','100% natural cold-pressed fresh watermelon juice, served chilled.',1500.00,'src/Mayor Breakfast/Watermelon Juice.jpg',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(13,3,8,'Assorted Goat Meat Pepper Soup','assorted-goat-meat-pepper-soup','Hot spicy pepper soup prepared with tender goat meat and traditional herbs.',3500.00,'src/Royal Delta Buka/Assorted Nigerian pepper soup.jpg',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(14,3,2,'Special Nigerian Fried Rice','special-nigerian-fried-rice','Seasoned fried rice packed with green peas, sweet corn, liver, and grilled chicken.',3000.00,'src/Royal Delta Buka/Nigerian Fried Rice.jpg',1,'2026-07-28 18:55:17','2026-08-01 03:15:47','/uploads/food/food_14_1785554147_7d4be54a.jpg'),(15,3,1,'Calabar Afang Soup & Fufu','calabar-afang-soup-fufu','Rich Afang vegetable soup garnished with dry fish, kanda, and beef.',3600.00,'src/Royal Delta Buka/Afang soup.webp',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(16,3,9,'Stewed Beans & Fried Plantain','stewed-beans-fried-plantain','Slow-cooked honey beans served with sweet fried dodo and fish.',2200.00,'src/Royal Delta Buka/Beans and plantain.webp',1,'2026-07-28 18:55:17','2026-08-01 03:16:03','/uploads/food/food_16_1785554163_25e3fa52.webp'),(17,3,8,'Fresh Catfish Pepper Soup','fresh-catfish-pepper-soup','Whole point-and-kill catfish pepper soup with authentic native spices.',4500.00,'src/Royal Delta Buka/Fresh Fish Peppersoup.jpg',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(18,3,10,'Stir-Fried Spaghetti Deluxe','stir-fried-spaghetti-deluxe','Spaghetti tossed with vegetables, frankfurters, and spicy tomato reduction.',2500.00,'src/Royal Delta Buka/Stirred fried spaghetti.jpg',1,'2026-07-28 18:55:17','2026-07-28 18:55:17',NULL),(19,4,3,'Bread & Tea','-read-ea-1785495223','',2150.00,'',1,'2026-07-31 10:53:43','2026-07-31 12:45:35','/uploads/food/food_19_1785501472_37e7d149.webp'),(22,4,11,'Indomie','-ndomie-1785507431','Also, your vendor registration should not be a normal instant registration. The idea you had forgotten was essentially a \"Restaurant Partner Application\" or \"Become a Restaurant Partner\" workflow.',2000.00,'',1,'2026-07-31 14:17:11','2026-08-01 01:51:11','/uploads/food/food_22_1785548509_24954d65.jpg'),(23,1,3,'Hamburger','-epper-oup-pecial-1785516716','',4501.00,NULL,1,'2026-07-31 16:51:56','2026-08-01 03:12:10','/uploads/food/food_23_1785517444_4e1468ea.jpg'),(24,1,1,'Plantain & Egg','-lantain-gg-1785546833','',1451.00,NULL,1,'2026-08-01 01:13:53','2026-08-01 01:13:53','/uploads/food/food_24_1785546833_e3d5c0fa.webp'),(25,1,2,'Steamed Rice and Beans with Tomato Sauce','-teamed-ice-and-eans-with-omato-auce-1785546946','',2101.00,NULL,1,'2026-08-01 01:15:46','2026-08-01 03:12:23','/uploads/food/food_25_1785546946_0ca6551e.webp'),(26,1,3,'Golden Fried Plantains (Dodo)','golden-fried-plantains-dodo','Sweet ripe plantains fried to golden perfection.',1200.00,'src/Delta Food Palace/Fried Plantains.webp',1,'2026-08-02 17:31:51','2026-08-02 17:31:51',NULL),(45,19,2,'Asun jollof rice and chicken','-sun-jollof-rice-and-chicken-1785716144','Asun Jollof Rice & Chicken – Smoky, spicy, and delicious jollof rice served with tender, flavorful Asun style chicken for a satisfying meal.',1500.00,NULL,1,'2026-08-03 00:15:44','2026-08-03 00:15:44','/uploads/food/food_45_1785716144_05514359.jpg'),(46,19,2,'SUYA JOLLOF RICE, SALAD, PLANTAINS AND CHICKEN','--1785716343','Suya Jollof Rice, Salad, Plantains & Chicken – Delicious spicy Suya-infused jollof rice served with fresh salad, sweet fried plantains, and tender, flavorful chicken.',1200.00,NULL,1,'2026-08-03 00:19:03','2026-08-03 00:19:03','/uploads/food/food_46_1785716343_a5d85954.jpg'),(47,19,1,'TILAPIA FISH PEPPER SOUP','--1785716534','Rainy day comfort in a bowl ☔🍲 Nothing hits better than a hot, flavorful Crocker Fish Pepper Soup on a cold, rainy day! 🔥 Soft, juicy, and richly seasoned — this is the kind of warmth your soul needs.',500.00,NULL,1,'2026-08-03 00:22:14','2026-08-03 00:25:08','/uploads/food/food_47_1785716534_720c2218.jpg'),(48,19,1,'Goat meat pepper soup','-oat-meat-pepper-soup-1785716693','Goat Meat Pepper Soup – A hot, spicy, and flavorful soup made with tender goat meat and aromatic spices, perfect for a comforting meal.',1000.00,NULL,1,'2026-08-03 00:24:53','2026-08-03 00:24:53','/uploads/food/food_48_1785716693_8717284a.jpg'),(62,1,3,'BeefPie','-eef-ie-1787704983','healthy beefpie',500.00,NULL,1,'2026-08-26 00:43:03','2026-08-26 00:43:03','/uploads/food/food_62_1787704983_20ecb503.webp'),(63,1,3,'Finger Chips N Tomato Sause','-inger-hips-omato-ause-1787705469','',1000.00,NULL,1,'2026-08-26 00:51:09','2026-08-26 00:51:09','/uploads/food/food_63_1787705469_268644ef.webp');
/*!40000 ALTER TABLE `food_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `related_order_id` int(11) DEFAULT NULL,
  `related_restaurant_id` int(11) DEFAULT NULL,
  `related_delivery_id` int(11) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_read` (`user_id`,`is_read`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,10,'ORDER_PLACED','New Order Received!','New order #UE-20260802-6900 has been placed for Mayor Breakfast.',31,2,NULL,1,'2026-08-02 20:06:54'),(2,10,'ORDER_PLACED','New Order Received!','New order #UE-20260802-6900 has been placed for Mayor Breakfast.',31,2,NULL,1,'2026-08-02 20:06:59'),(3,10,'ORDER_PLACED','New Order Received!','New order #UE-20260802-6900 has been placed for Mayor Breakfast.',31,2,NULL,1,'2026-08-02 20:07:13'),(4,10,'ORDER_PLACED','New Order Received!','New order #UE-20260802-7187 has been placed for Mayor Breakfast.',32,2,NULL,1,'2026-08-02 20:07:27'),(5,10,'ORDER_PLACED','New Order Received!','New order #UE-20260802-4005 has been placed for Mayor Breakfast.',33,2,NULL,1,'2026-08-02 20:22:18'),(6,10,'ORDER_PLACED','New Order Received!','New order #UE-20260802-0134 has been placed for Mayor Breakfast.',34,2,NULL,1,'2026-08-02 20:53:16'),(7,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260802-0134: The restaurant is now preparing your food.',34,2,NULL,1,'2026-08-02 20:54:12'),(8,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260802-0134: Your order is ready for pickup/delivery.',34,2,NULL,1,'2026-08-02 20:54:15'),(9,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260802-0134 from Mayor Breakfast is ready for delivery pickup!',34,2,NULL,0,'2026-08-02 20:54:15'),(10,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260802-0134: Your order is out for delivery with our rider.',34,2,NULL,1,'2026-08-02 20:54:20'),(11,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260802-4005: The restaurant is now preparing your food.',33,2,NULL,1,'2026-08-02 20:54:24'),(12,10,'RIDER_ACCEPTED','Rider Assigned','Rider Swift Rider Delta has accepted delivery for order #UE-20260802-0134.',34,2,21,1,'2026-08-02 20:54:46'),(13,1,'RIDER_ACCEPTED','Rider Assigned to Your Order','Rider Swift Rider Delta has been assigned to deliver order #UE-20260802-0134.',34,2,21,1,'2026-08-02 20:54:46'),(14,1,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-20260802-0134 is out for delivery!',34,2,21,1,'2026-08-02 20:54:53'),(15,10,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-20260802-0134 is now out for delivery.',34,2,21,1,'2026-08-02 20:54:53'),(16,1,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',34,2,21,1,'2026-08-02 20:54:57'),(17,10,'ORDER_DELIVERED','Order Delivered','Order #UE-20260802-0134 has been delivered successfully!',34,2,21,1,'2026-08-02 20:54:57'),(18,54,'NEW_VENDOR_APPLICATION','New Vendor Application','Test Vendor Co has submitted a new Vendor application.',NULL,NULL,NULL,1,'2026-08-02 22:30:23'),(19,54,'NEW_RIDER_APPLICATION','New Rider Application','Test Rider Person has submitted a new Rider application.',NULL,NULL,NULL,1,'2026-08-02 22:30:23'),(20,9,'ORDER_PLACED','New Order Received!','New order #UE-TEST-8750 has been placed for Delta Food Palace.',35,1,NULL,1,'2026-08-02 22:30:23'),(21,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-TEST-8750: The restaurant is now preparing your food.',35,1,NULL,1,'2026-08-02 22:30:23'),(22,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-TEST-8750 from Delta Food Palace is ready for delivery pickup!',35,1,NULL,1,'2026-08-02 22:30:23'),(23,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-TEST-8750 from Delta Food Palace is ready for delivery pickup!',35,1,NULL,0,'2026-08-02 22:30:23'),(24,9,'RIDER_ACCEPTED','Rider Assigned','Rider Swift Rider Delta has accepted delivery for order #UE-TEST-8750.',35,1,22,1,'2026-08-02 22:30:23'),(25,1,'RIDER_ACCEPTED','Rider Assigned to Your Order','Rider Swift Rider Delta has been assigned to deliver order #UE-TEST-8750.',35,1,22,1,'2026-08-02 22:30:23'),(26,1,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-TEST-8750 is out for delivery!',35,1,22,1,'2026-08-02 22:30:23'),(27,9,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-TEST-8750 is now out for delivery.',35,1,22,1,'2026-08-02 22:30:23'),(28,1,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',35,1,22,1,'2026-08-02 22:30:23'),(29,9,'ORDER_DELIVERED','Order Delivered','Order #UE-TEST-8750 has been delivered successfully!',35,1,22,1,'2026-08-02 22:30:23'),(30,9,'ORDER_PLACED','New Order Received!','New order #UE-20260802-8109 has been placed for Delta Food Palace.',36,1,NULL,1,'2026-08-02 22:32:39'),(31,10,'ORDER_PLACED','New Order Received!','New order #UE-20260802-7762 has been placed for Mayor Breakfast.',37,2,NULL,1,'2026-08-02 22:33:16'),(32,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260802-7762: The restaurant is now preparing your food.',37,2,NULL,1,'2026-08-02 22:34:29'),(33,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260802-7762: Your order is ready for pickup/delivery.',37,2,NULL,1,'2026-08-02 22:34:30'),(34,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260802-7762 from Mayor Breakfast is ready for delivery pickup!',37,2,NULL,1,'2026-08-02 22:34:30'),(35,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260802-7762 from Mayor Breakfast is ready for delivery pickup!',37,2,NULL,0,'2026-08-02 22:34:30'),(36,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260802-7762: Your order is out for delivery with our rider.',37,2,NULL,1,'2026-08-02 22:34:31'),(37,1,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-TEST-8750 is out for delivery!',35,1,22,1,'2026-08-02 22:35:24'),(38,9,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-TEST-8750 is now out for delivery.',35,1,22,1,'2026-08-02 22:35:24'),(39,1,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',35,1,22,1,'2026-08-02 22:35:25'),(40,9,'ORDER_DELIVERED','Order Delivered','Order #UE-TEST-8750 has been delivered successfully!',35,1,22,1,'2026-08-02 22:35:25'),(41,10,'RIDER_ACCEPTED','Rider Assigned','Rider Swift Rider Delta has accepted delivery for order #UE-20260802-7762.',37,2,23,1,'2026-08-02 22:35:29'),(42,1,'RIDER_ACCEPTED','Rider Assigned to Your Order','Rider Swift Rider Delta has been assigned to deliver order #UE-20260802-7762.',37,2,23,1,'2026-08-02 22:35:29'),(43,1,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-20260802-7762 is out for delivery!',37,2,23,1,'2026-08-02 22:35:32'),(44,10,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-20260802-7762 is now out for delivery.',37,2,23,1,'2026-08-02 22:35:32'),(45,1,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',37,2,23,1,'2026-08-02 22:35:33'),(46,10,'ORDER_DELIVERED','Order Delivered','Order #UE-20260802-7762 has been delivered successfully!',37,2,23,1,'2026-08-02 22:35:33'),(47,54,'NEW_VENDOR_APPLICATION','New Vendor Application','Test Vendor Co has submitted a new Vendor application.',NULL,NULL,NULL,1,'2026-08-03 00:13:15'),(48,54,'NEW_RIDER_APPLICATION','New Rider Application','Test Rider Person has submitted a new Rider application.',NULL,NULL,NULL,1,'2026-08-03 00:13:15'),(49,9,'ORDER_PLACED','New Order Received!','New order #UE-TEST-1813 has been placed for Delta Food Palace.',38,1,NULL,1,'2026-08-03 00:13:15'),(50,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-TEST-1813: The restaurant is now preparing your food.',38,1,NULL,1,'2026-08-03 00:13:15'),(51,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-TEST-1813 from Delta Food Palace is ready for delivery pickup!',38,1,NULL,1,'2026-08-03 00:13:15'),(52,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-TEST-1813 from Delta Food Palace is ready for delivery pickup!',38,1,NULL,0,'2026-08-03 00:13:15'),(53,9,'RIDER_ACCEPTED','Rider Assigned','Rider Swift Rider Delta has accepted delivery for order #UE-TEST-1813.',38,1,24,1,'2026-08-03 00:13:15'),(54,1,'RIDER_ACCEPTED','Rider Assigned to Your Order','Rider Swift Rider Delta has been assigned to deliver order #UE-TEST-1813.',38,1,24,1,'2026-08-03 00:13:15'),(55,1,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-TEST-1813 is out for delivery!',38,1,24,1,'2026-08-03 00:13:15'),(56,9,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-TEST-1813 is now out for delivery.',38,1,24,1,'2026-08-03 00:13:15'),(57,1,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',38,1,24,1,'2026-08-03 00:13:15'),(58,9,'ORDER_DELIVERED','Order Delivered','Order #UE-TEST-1813 has been delivered successfully!',38,1,24,1,'2026-08-03 00:13:15'),(59,54,'NEW_VENDOR_APPLICATION','New Vendor Application','Pending Vendor Phase 8 has submitted a new Vendor application.',NULL,NULL,NULL,1,'2026-08-03 00:23:59'),(60,10,'ORDER_PLACED','New Order Received!','New order #UE-20260803-0532 has been placed for Mayor Breakfast.',39,2,NULL,1,'2026-08-03 00:28:16'),(61,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260803-0532: The restaurant is now preparing your food.',39,2,NULL,1,'2026-08-03 00:30:59'),(62,1,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260803-0532: Your order is ready for pickup/delivery.',39,2,NULL,1,'2026-08-03 00:31:14'),(63,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260803-0532 from Mayor Breakfast is ready for delivery pickup!',39,2,NULL,1,'2026-08-03 00:31:14'),(64,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260803-0532 from Mayor Breakfast is ready for delivery pickup!',39,2,NULL,1,'2026-08-03 00:31:14'),(65,1,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-TEST-1813 is out for delivery!',38,1,24,1,'2026-08-03 00:43:39'),(66,9,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-TEST-1813 is now out for delivery.',38,1,24,1,'2026-08-03 00:43:39'),(67,1,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',38,1,24,1,'2026-08-03 00:44:00'),(68,9,'ORDER_DELIVERED','Order Delivered','Order #UE-TEST-1813 has been delivered successfully!',38,1,24,1,'2026-08-03 00:44:00'),(69,10,'RIDER_ACCEPTED','Rider Assigned','Rider Swift Rider Delta has accepted delivery for order #UE-20260803-0532.',39,2,25,1,'2026-08-03 00:48:01'),(70,1,'RIDER_ACCEPTED','Rider Assigned to Your Order','Rider Swift Rider Delta has been assigned to deliver order #UE-20260803-0532.',39,2,25,1,'2026-08-03 00:48:01'),(71,1,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-20260803-0532 is out for delivery!',39,2,25,1,'2026-08-03 00:48:59'),(72,10,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-20260803-0532 is now out for delivery.',39,2,25,1,'2026-08-03 00:48:59'),(73,1,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',39,2,25,1,'2026-08-03 00:49:21'),(74,10,'ORDER_DELIVERED','Order Delivered','Order #UE-20260803-0532 has been delivered successfully!',39,2,25,1,'2026-08-03 00:49:21'),(75,54,'NEW_VENDOR_APPLICATION','New Vendor Application','Oliseneku Chinwemba has submitted a new Vendor application.',NULL,NULL,NULL,1,'2026-08-03 01:04:29'),(76,65,'ORDER_PLACED','New Order Received!','New order #UE-20260803-0371 has been placed for Mama Puts.',40,19,NULL,1,'2026-08-03 01:29:51'),(77,64,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260803-0371: The restaurant is now preparing your food.',40,19,NULL,0,'2026-08-03 01:30:27'),(78,64,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260803-0371: Your order is ready for pickup/delivery.',40,19,NULL,1,'2026-08-03 01:31:02'),(79,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260803-0371 from Mama Puts is ready for delivery pickup!',40,19,NULL,1,'2026-08-03 01:31:02'),(80,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260803-0371 from Mama Puts is ready for delivery pickup!',40,19,NULL,1,'2026-08-03 01:31:03'),(81,64,'ORDER_STATUS_UPDATE','Order Status Update','Order #UE-20260803-0371: Your order is out for delivery with our rider.',40,19,NULL,1,'2026-08-03 01:31:44'),(82,65,'RIDER_ACCEPTED','Rider Assigned','Rider Swift Rider Delta has accepted delivery for order #UE-20260803-0371.',40,19,26,1,'2026-08-03 01:32:12'),(83,64,'RIDER_ACCEPTED','Rider Assigned to Your Order','Rider Swift Rider Delta has been assigned to deliver order #UE-20260803-0371.',40,19,26,1,'2026-08-03 01:32:12'),(84,64,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-20260803-0371 is out for delivery!',40,19,26,1,'2026-08-03 01:32:17'),(85,65,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-20260803-0371 is now out for delivery.',40,19,26,1,'2026-08-03 01:32:17'),(86,64,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',40,19,26,1,'2026-08-03 01:32:25'),(87,65,'ORDER_DELIVERED','Order Delivered','Order #UE-20260803-0371 has been delivered successfully!',40,19,26,1,'2026-08-03 01:32:25'),(88,65,'ORDER_PLACED','New Order Received!','New order #UE-20260803-6288 has been placed for Mama Puts.',41,19,NULL,1,'2026-08-03 02:01:00'),(89,1,'ORDER_RECEIVED','Order Received!','Your order has been received!',41,19,NULL,0,'2026-08-03 02:01:00'),(90,10,'ORDER_PLACED','New Order Received!','New order #UE-20260803-1980 has been placed for Mayor Breakfast.',42,2,NULL,1,'2026-08-03 02:08:46'),(91,1,'ORDER_RECEIVED','Order Received!','Your order has been received!',42,2,NULL,0,'2026-08-03 02:08:46'),(92,9,'ORDER_PLACED','New Order Received!','New order #UE-20260804-3809 has been placed for Delta Food Palace.',43,1,NULL,1,'2026-08-04 17:30:16'),(93,66,'ORDER_RECEIVED','Order Received!','Your order has been received!',43,1,NULL,1,'2026-08-04 17:30:16'),(94,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260804-3809 from Delta Food Palace is ready for delivery pickup!',43,1,NULL,1,'2026-08-04 17:38:15'),(95,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260804-3809 from Delta Food Palace is ready for delivery pickup!',43,1,NULL,1,'2026-08-04 17:38:15'),(96,8,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-20260801-6776 is out for delivery!',27,1,20,0,'2026-08-04 17:59:00'),(97,9,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-20260801-6776 is now out for delivery.',27,1,20,1,'2026-08-04 17:59:00'),(98,8,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',27,1,20,0,'2026-08-04 17:59:01'),(99,9,'ORDER_DELIVERED','Order Delivered','Order #UE-20260801-6776 has been delivered successfully!',27,1,20,1,'2026-08-04 17:59:01'),(100,5,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-20260801-3469 is out for delivery!',22,4,17,1,'2026-08-04 17:59:02'),(101,37,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-20260801-3469 is now out for delivery.',22,4,17,0,'2026-08-04 17:59:02'),(102,5,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',22,4,17,1,'2026-08-04 17:59:04'),(103,37,'ORDER_DELIVERED','Order Delivered','Order #UE-20260801-3469 has been delivered successfully!',22,4,17,0,'2026-08-04 17:59:04'),(104,9,'RIDER_ACCEPTED','Rider Assigned','Rider Abraka Express Rider has accepted delivery for order #UE-20260804-3809.',43,1,27,1,'2026-08-04 18:00:10'),(105,66,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-20260804-3809 is out for delivery!',43,1,27,1,'2026-08-04 18:00:13'),(106,9,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-20260804-3809 is now out for delivery.',43,1,27,1,'2026-08-04 18:00:13'),(107,66,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',43,1,27,1,'2026-08-04 18:00:15'),(108,9,'ORDER_DELIVERED','Order Delivered','Order #UE-20260804-3809 has been delivered successfully!',43,1,27,1,'2026-08-04 18:00:15'),(109,9,'RIDER_ACCEPTED','Rider Assigned','Rider Abraka Express Rider has accepted delivery for order #UE-20260801-2432.',23,1,28,1,'2026-08-04 21:09:04'),(110,5,'OUT_FOR_DELIVERY','Order On The Way!','Your order #UE-20260801-2432 is out for delivery!',23,1,28,1,'2026-08-04 21:09:12'),(111,9,'OUT_FOR_DELIVERY','Order Out for Delivery','Order #UE-20260801-2432 is now out for delivery.',23,1,28,1,'2026-08-04 21:09:12'),(112,5,'ORDER_DELIVERED','Order Delivered!','Your order has been received!',23,1,28,1,'2026-08-04 21:09:13'),(113,9,'ORDER_DELIVERED','Order Delivered','Order #UE-20260801-2432 has been delivered successfully!',23,1,28,1,'2026-08-04 21:09:13'),(114,37,'RIDER_ACCEPTED','Rider Assigned','Rider Abraka Express Rider has accepted delivery for order #UE-20260801-3377.',25,4,29,0,'2026-08-04 21:17:50'),(115,65,'ORDER_PLACED','New Order Received!','New order #UE-20260808-7084 has been placed for Mama Puts.',44,19,NULL,0,'2026-08-08 13:26:21'),(116,5,'ORDER_RECEIVED','Order Received!','Your order has been received!',44,19,NULL,1,'2026-08-08 13:26:21'),(117,65,'ORDER_PLACED','New Order Received!','New order #UE-20260819-4658 has been placed for Mama Puts.',45,19,NULL,0,'2026-08-19 02:48:59'),(118,5,'ORDER_RECEIVED','Order Received!','Your order has been received!',45,19,NULL,1,'2026-08-19 02:48:59'),(119,65,'ORDER_PLACED','New Order Received!','New order #UE-20260819-7263 has been placed for Mama Puts.',46,19,NULL,0,'2026-08-19 02:58:27'),(120,5,'ORDER_RECEIVED','Order Received!','Your order has been received!',46,19,NULL,1,'2026-08-19 02:58:27'),(121,65,'ORDER_PLACED','New Order Received!','New order #UE-20260819-7744 has been placed for Mama Puts.',47,19,NULL,0,'2026-08-19 11:50:34'),(122,5,'ORDER_RECEIVED','Order Received!','Your order has been received!',47,19,NULL,1,'2026-08-19 11:50:34'),(123,37,'ORDER_PLACED','New Order Received!','New order #UE-20260819-1283 has been placed for Obinna Buka.',48,4,NULL,0,'2026-08-19 11:52:06'),(124,5,'ORDER_RECEIVED','Order Received!','Your order has been received!',48,4,NULL,1,'2026-08-19 11:52:06'),(125,37,'ORDER_PLACED','New Order Received!','New order #UE-20260819-8365 has been placed for Obinna Buka.',49,4,NULL,0,'2026-08-19 11:57:32'),(126,5,'ORDER_RECEIVED','Order Received!','Your order has been received!',49,4,NULL,1,'2026-08-19 11:57:32'),(127,37,'ORDER_PLACED','New Order Received!','New order #UE-20260825-8355 has been placed for Obinna Buka.',50,4,NULL,0,'2026-08-25 18:30:15'),(128,5,'ORDER_RECEIVED','Order Received!','Your order has been received!',50,4,NULL,0,'2026-08-25 18:30:15'),(129,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260803-1980 from Mayor Breakfast is ready for delivery pickup!',42,2,NULL,0,'2026-08-30 08:19:11'),(130,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260803-1980 from Mayor Breakfast is ready for delivery pickup!',42,2,NULL,0,'2026-08-30 08:19:11'),(131,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260801-6382 from Mayor Breakfast is ready for delivery pickup!',19,2,NULL,0,'2026-08-30 08:20:06'),(132,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260801-6382 from Mayor Breakfast is ready for delivery pickup!',19,2,NULL,0,'2026-08-30 08:20:06'),(133,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260802-7187 from Mayor Breakfast is ready for delivery pickup!',32,2,NULL,0,'2026-08-30 08:20:45'),(134,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260802-7187 from Mayor Breakfast is ready for delivery pickup!',32,2,NULL,0,'2026-08-30 08:20:45'),(135,25,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260802-4005 from Mayor Breakfast is ready for delivery pickup!',33,2,NULL,0,'2026-08-30 08:20:47'),(136,26,'READY_FOR_DELIVERY','Delivery Job Available!','Order #UE-20260802-4005 from Mayor Breakfast is ready for delivery pickup!',33,2,NULL,0,'2026-08-30 08:20:47');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `food_item_id` int(11) DEFAULT NULL,
  `food_name` varchar(200) NOT NULL,
  `food_slug` varchar(200) DEFAULT NULL,
  `category_name` varchar(100) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`order_id`),
  KEY `idx_order_items_food` (`food_item_id`),
  CONSTRAINT `fk_order_items_food` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,1,'Banga Soup & Native Starch','banga-soup-native-starch','Soups & Swallow',1,3500.00,3500.00,'2026-07-30 21:50:40'),(2,2,4,'Amala, Gbegiri & Ewedu','amala-gbegiri-ewedu','Soups & Swallow',1,3000.00,3000.00,'2026-07-30 22:10:35'),(3,2,NULL,'Golden Fried Plantains (Dodo)','golden-fried-plantains-dodo','Sides & Snacks',1,1200.00,1200.00,'2026-07-30 22:10:35'),(4,3,2,'Delicious Egusi Soup & Fufu','delicious-egusi-soup-fufu','Soups & Swallow',1,3200.00,3200.00,'2026-07-30 22:13:51'),(5,4,9,'All-American Breakfast Plate','all-american-breakfast-plate','Morning Specials',1,4500.00,4500.00,'2026-07-30 23:16:03'),(6,5,1,'Banga Soup & Native Starch','banga-soup-native-starch','Soups & Swallow',1,3500.00,3500.00,'2026-07-30 23:37:39'),(16,15,19,'Bread & Tea','-read-ea-1785495223','Sides & Snacks',1,2150.00,2150.00,'2026-07-31 11:23:50'),(17,16,19,'Bread & Tea','-read-ea-1785495223','Sides & Snacks',5,2150.00,10750.00,'2026-07-31 11:30:06'),(18,17,23,'Hamburger','-epper-oup-pecial-1785516716','Sides & Snacks',1,4501.00,4501.00,'2026-08-01 03:36:42'),(19,17,24,'Plantain & Egg','-lantain-gg-1785546833','Soups & Swallow',1,1451.00,1451.00,'2026-08-01 03:36:42'),(20,17,25,'Steamed Rice and Beans with Tomato Sauce','-teamed-ice-and-eans-with-omato-auce-1785546946','Rice & Mains',1,2101.00,2101.00,'2026-08-01 03:36:42'),(21,18,25,'Steamed Rice and Beans with Tomato Sauce','-teamed-ice-and-eans-with-omato-auce-1785546946','Rice & Mains',1,2101.00,2101.00,'2026-08-01 03:42:29'),(22,19,7,'Akamu (Pap) & Hot Moi Moi','akamu-pap-hot-moi-moi','Morning Specials',1,2000.00,2000.00,'2026-08-01 03:46:31'),(23,20,13,'Assorted Goat Meat Pepper Soup','assorted-goat-meat-pepper-soup','Peppersoup & Grills',1,3500.00,3500.00,'2026-08-01 03:47:20'),(24,20,14,'Special Nigerian Fried Rice','special-nigerian-fried-rice','Rice & Mains',1,3000.00,3000.00,'2026-08-01 03:47:20'),(25,21,19,'Bread & Tea','-read-ea-1785495223','Sides & Snacks',1,2150.00,2150.00,'2026-08-01 15:58:12'),(26,21,22,'Indomie','-ndomie-1785507431','Spaghetti',1,2000.00,2000.00,'2026-08-01 15:58:12'),(27,22,19,'Bread & Tea','-read-ea-1785495223','Sides & Snacks',1,2150.00,2150.00,'2026-08-01 16:00:35'),(28,23,25,'Steamed Rice and Beans with Tomato Sauce','-teamed-ice-and-eans-with-omato-auce-1785546946','Rice & Mains',1,2101.00,2101.00,'2026-08-01 16:01:43'),(29,24,13,'Assorted Goat Meat Pepper Soup','assorted-goat-meat-pepper-soup','Peppersoup & Grills',1,3500.00,3500.00,'2026-08-01 16:05:49'),(30,25,22,'Indomie','-ndomie-1785507431','Spaghetti',1,2000.00,2000.00,'2026-08-01 16:21:25'),(31,26,24,'Plantain & Egg','-lantain-gg-1785546833','Soups & Swallow',1,1451.00,1451.00,'2026-08-01 16:23:32'),(32,27,23,'Hamburger','-epper-oup-pecial-1785516716','Sides & Snacks',1,4501.00,4501.00,'2026-08-01 16:25:04'),(33,28,7,'Akamu (Pap) & Hot Moi Moi','akamu-pap-hot-moi-moi','Morning Specials',1,2000.00,2000.00,'2026-08-02 16:14:36'),(34,29,1,'Banga Soup & Native Starch','banga-soup-native-starch','Soups & Swallow',1,3500.00,3500.00,'2026-08-02 17:31:40'),(35,30,11,'Ham & Cheese Croissant','ham-cheese-croissant','Sandwiches & Bakery',1,2200.00,2200.00,'2026-08-02 19:06:03'),(36,31,11,'Ham & Cheese Croissant','ham-cheese-croissant','Sandwiches & Bakery',1,2200.00,2200.00,'2026-08-02 19:06:52'),(37,32,11,'Ham & Cheese Croissant','ham-cheese-croissant','Sandwiches & Bakery',1,2200.00,2200.00,'2026-08-02 19:07:26'),(38,33,11,'Ham & Cheese Croissant','ham-cheese-croissant','Sandwiches & Bakery',1,2200.00,2200.00,'2026-08-02 19:22:16'),(39,34,11,'Ham & Cheese Croissant','ham-cheese-croissant','Sandwiches & Bakery',1,2200.00,2200.00,'2026-08-02 19:53:14'),(40,36,25,'Steamed Rice and Beans with Tomato Sauce','-teamed-ice-and-eans-with-omato-auce-1785546946','Rice & Mains',1,2101.00,2101.00,'2026-08-02 21:32:37'),(41,37,11,'Ham & Cheese Croissant','ham-cheese-croissant','Sandwiches & Bakery',1,2200.00,2200.00,'2026-08-02 21:33:15'),(42,37,12,'Fresh Watermelon Juice','fresh-watermelon-juice','Cold Beverages',1,1500.00,1500.00,'2026-08-02 21:33:15'),(43,39,7,'Akamu (Pap) & Hot Moi Moi','akamu-pap-hot-moi-moi','Morning Specials',1,2000.00,2000.00,'2026-08-02 23:28:05'),(44,40,47,'TILAPIA FISH PEPPER SOUP','--1785716534','Soups & Swallow',1,500.00,500.00,'2026-08-03 00:29:49'),(45,40,48,'Goat meat pepper soup','-oat-meat-pepper-soup-1785716693','Soups & Swallow',1,1000.00,1000.00,'2026-08-03 00:29:49'),(46,41,48,'Goat meat pepper soup','-oat-meat-pepper-soup-1785716693','Soups & Swallow',1,1000.00,1000.00,'2026-08-03 01:00:49'),(47,42,7,'Akamu (Pap) & Hot Moi Moi','akamu-pap-hot-moi-moi','Morning Specials',1,2000.00,2000.00,'2026-08-03 01:08:32'),(48,43,26,'Golden Fried Plantains (Dodo)','golden-fried-plantains-dodo','Sides & Snacks',1,1200.00,1200.00,'2026-08-04 16:30:14'),(49,44,48,'Goat meat pepper soup','-oat-meat-pepper-soup-1785716693','Soups & Swallow',2,1000.00,2000.00,'2026-08-08 12:26:11'),(50,45,45,'Asun jollof rice and chicken','-sun-jollof-rice-and-chicken-1785716144','Rice & Mains',1,1500.00,1500.00,'2026-08-19 01:48:55'),(51,45,47,'TILAPIA FISH PEPPER SOUP','--1785716534','Soups & Swallow',1,500.00,500.00,'2026-08-19 01:48:55'),(52,45,48,'Goat meat pepper soup','-oat-meat-pepper-soup-1785716693','Soups & Swallow',1,1000.00,1000.00,'2026-08-19 01:48:55'),(53,46,45,'Asun jollof rice and chicken','-sun-jollof-rice-and-chicken-1785716144','Rice & Mains',1,1500.00,1500.00,'2026-08-19 01:58:22'),(54,46,46,'SUYA JOLLOF RICE, SALAD, PLANTAINS AND CHICKEN','--1785716343','Rice & Mains',1,1200.00,1200.00,'2026-08-19 01:58:22'),(55,46,47,'TILAPIA FISH PEPPER SOUP','--1785716534','Soups & Swallow',1,500.00,500.00,'2026-08-19 01:58:22'),(56,46,48,'Goat meat pepper soup','-oat-meat-pepper-soup-1785716693','Soups & Swallow',1,1000.00,1000.00,'2026-08-19 01:58:22'),(57,47,45,'Asun jollof rice and chicken','-sun-jollof-rice-and-chicken-1785716144','Rice & Mains',2,1500.00,3000.00,'2026-08-19 10:50:32'),(58,47,46,'SUYA JOLLOF RICE, SALAD, PLANTAINS AND CHICKEN','--1785716343','Rice & Mains',2,1200.00,2400.00,'2026-08-19 10:50:32'),(59,47,47,'TILAPIA FISH PEPPER SOUP','--1785716534','Soups & Swallow',2,500.00,1000.00,'2026-08-19 10:50:32'),(60,47,48,'Goat meat pepper soup','-oat-meat-pepper-soup-1785716693','Soups & Swallow',1,1000.00,1000.00,'2026-08-19 10:50:32'),(61,48,19,'Bread & Tea','-read-ea-1785495223','Sides & Snacks',1,2150.00,2150.00,'2026-08-19 10:52:04'),(62,48,22,'Indomie','-ndomie-1785507431','Spaghetti',1,2000.00,2000.00,'2026-08-19 10:52:04'),(63,49,22,'Indomie','-ndomie-1785507431','Spaghetti',1,2000.00,2000.00,'2026-08-19 10:57:31'),(64,50,22,'Indomie','-ndomie-1785507431','Spaghetti',1,2000.00,2000.00,'2026-08-25 17:30:14');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `restaurant_id` int(11) NOT NULL,
  `restaurant_name` varchar(150) NOT NULL,
  `delivery_address_id` int(11) DEFAULT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `recipient_phone` varchar(30) NOT NULL,
  `delivery_address` varchar(255) NOT NULL,
  `delivery_area` varchar(100) NOT NULL,
  `delivery_city` varchar(50) NOT NULL DEFAULT 'Abraka',
  `delivery_state` varchar(50) NOT NULL DEFAULT 'Delta State',
  `subtotal` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) NOT NULL DEFAULT 500.00,
  `total_amount` decimal(10,2) NOT NULL,
  `order_status` enum('PENDING_PAYMENT','CONFIRMED','PROCESSING','READY_FOR_DELIVERY','OUT_FOR_DELIVERY','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING_PAYMENT',
  `payment_status` enum('PENDING','PAID','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `payment_method` varchar(50) NOT NULL DEFAULT 'FLUTTERWAVE',
  `payment_reference` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_order_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_restaurant` (`restaurant_id`),
  KEY `idx_orders_status` (`order_status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `fk_orders_address` (`delivery_address_id`),
  KEY `idx_orders_archived` (`archived_at`),
  CONSTRAINT `fk_orders_address` FOREIGN KEY (`delivery_address_id`) REFERENCES `user_addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_restaurant` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'UE-20260730-9895',8,1,'Delta Food Palace',2,'Customer Test','08012345678','Room 5, Integrity Hostel, Campus 2 Gate','Site 2','Abraka','Delta State',3500.00,500.00,4000.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-1-1785448240','2026-07-30 21:50:40','2026-08-01 03:31:27',NULL),(2,'UE-20260731-0887',8,1,'Delta Food Palace',2,'Customer Test','08012345678','Room 5, Integrity Hostel, Campus 2 Gate','Site 2','Abraka','Delta State',4200.00,500.00,4700.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-2-1785449435','2026-07-30 22:10:35','2026-08-01 16:37:47',NULL),(3,'UE-20260731-3259',8,1,'Delta Food Palace',2,'Customer Test','08012345678','Room 5, Integrity Hostel, Campus 2 Gate','Site 2','Abraka','Delta State',3200.00,500.00,3700.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-3-1785449631','2026-07-30 22:13:51','2026-08-01 16:37:36',NULL),(4,'UE-20260731-5845',8,2,'Mayor Breakfast',2,'Customer Test','08012345678','Room 5, Integrity Hostel, Campus 2 Gate','Site 2','Abraka','Delta State',4500.00,500.00,5000.00,'PROCESSING','PAID','FLUTTERWAVE','UE-TX-4-1785453363','2026-07-30 23:16:03','2026-08-30 07:19:54',NULL),(5,'UE-20260731-0482',8,1,'Delta Food Palace',2,'Customer Test','08012345678','Room 5, Integrity Hostel, Campus 2 Gate','Site 2','Abraka','Delta State',3500.00,500.00,4000.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-5-1785454659','2026-07-30 23:37:39','2026-08-01 16:36:45',NULL),(15,'UE-20260731-3163',5,4,'Obinna Buka',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',2150.00,500.00,2650.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-15-1785497030','2026-07-31 11:23:50','2026-08-01 16:37:27',NULL),(16,'UE-20260731-5083',5,4,'Obinna Buka',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',10750.00,500.00,11250.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-16-1785497406','2026-07-31 11:30:06','2026-08-01 16:36:36',NULL),(17,'UE-20260801-5765',5,1,'Delta Food Palace',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',8053.00,500.00,8553.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-17-1785555402','2026-08-01 03:36:42','2026-08-01 16:38:28',NULL),(18,'UE-20260801-2106',5,1,'Delta Food Palace',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',2101.00,500.00,2601.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-18-1785555749','2026-08-01 03:42:29','2026-08-01 16:38:06',NULL),(19,'UE-20260801-6382',5,2,'Mayor Breakfast',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',2000.00,500.00,2500.00,'OUT_FOR_DELIVERY','PAID','FLUTTERWAVE','UE-TX-19-1785555991','2026-08-01 03:46:31','2026-08-30 07:20:15',NULL),(20,'UE-20260801-7317',5,3,'Royal Delta Buka',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',6500.00,500.00,7000.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-20-1785556040','2026-08-01 03:47:20','2026-08-01 16:36:54',NULL),(21,'UE-20260801-6716',5,4,'Obinna Buka',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',4150.00,500.00,4650.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-21-1785599892','2026-08-01 15:58:12','2026-08-01 16:51:36',NULL),(22,'UE-20260801-3469',5,4,'Obinna Buka',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',2150.00,500.00,2650.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-22-1785600035','2026-08-01 16:00:35','2026-08-04 16:59:04',NULL),(23,'UE-20260801-2432',5,1,'Delta Food Palace',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',2101.00,500.00,2601.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-23-1785600103','2026-08-01 16:01:43','2026-08-04 20:09:13',NULL),(24,'UE-20260801-5123',5,3,'Royal Delta Buka',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',3500.00,500.00,4000.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-24-1785600349','2026-08-01 16:05:49','2026-08-01 16:05:51',NULL),(25,'UE-20260801-3377',5,4,'Obinna Buka',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',2000.00,500.00,2500.00,'OUT_FOR_DELIVERY','PAID','FLUTTERWAVE','UE-TX-25-1785601285','2026-08-01 16:21:25','2026-08-01 16:29:23',NULL),(26,'UE-20260801-1878',1,1,'Delta Food Palace',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',1451.00,500.00,1951.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-26-1785601412','2026-08-01 16:23:32','2026-08-01 16:23:34',NULL),(27,'UE-20260801-6776',8,1,'Delta Food Palace',2,'Customer Test','08012345678','Room 5, Integrity Hostel, Campus 2 Gate','Site 2','Abraka','Delta State',4501.00,500.00,5001.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-27-1785601504','2026-08-01 16:25:04','2026-08-04 16:59:01',NULL),(28,'UE-20260802-2601',1,2,'Mayor Breakfast',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',2000.00,500.00,2500.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-28-1785687276','2026-08-02 16:14:36','2026-08-02 16:19:28',NULL),(29,'UE-20260802-8888',59,1,'Delta Food Palace',14,'Customer Rider Test','08099991111','15 Express Way','Site 2','Abraka','Delta State',3500.00,500.00,4000.00,'DELIVERED','PENDING','FLUTTERWAVE',NULL,'2026-08-02 17:31:40','2026-08-02 17:31:40',NULL),(30,'UE-20260802-5578',1,2,'Mayor Breakfast',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',2200.00,500.00,2700.00,'PENDING_PAYMENT','PENDING','FLUTTERWAVE',NULL,'2026-08-02 19:06:03','2026-08-02 19:06:03',NULL),(31,'UE-20260802-6900',1,2,'Mayor Breakfast',15,'Chinedu Okafor','08012345678','Faculty of Pharmacy','Site 3','Abraka','Delta State',2200.00,500.00,2700.00,'CANCELLED','CANCELLED','FLUTTERWAVE','UE-TX-31-1785697612','2026-08-02 19:06:52','2026-08-02 19:07:18',NULL),(32,'UE-20260802-7187',1,2,'Mayor Breakfast',15,'Chinedu Okafor','08012345678','Faculty of Pharmacy','Site 3','Abraka','Delta State',2200.00,500.00,2700.00,'READY_FOR_DELIVERY','PAID','FLUTTERWAVE','UE-TX-32-1785697646','2026-08-02 19:07:26','2026-08-30 07:20:45',NULL),(33,'UE-20260802-4005',1,2,'Mayor Breakfast',15,'Chinedu Okafor','08012345678','Faculty of Pharmacy','Site 3','Abraka','Delta State',2200.00,500.00,2700.00,'READY_FOR_DELIVERY','PAID','FLUTTERWAVE','UE-TX-33-1785698536','2026-08-02 19:22:16','2026-08-30 07:20:47',NULL),(34,'UE-20260802-0134',1,2,'Mayor Breakfast',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',2200.00,500.00,2700.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-34-1785700394','2026-08-02 19:53:14','2026-08-02 19:54:57',NULL),(35,'UE-TEST-8750',1,1,'Delta Food Palace',1,'Test Recipient','08012345678','Abraka Main','','Abraka','Delta State',2500.00,500.00,3000.00,'DELIVERED','PAID','FLUTTERWAVE',NULL,'2026-08-02 21:30:23','2026-08-02 21:35:25',NULL),(36,'UE-20260802-8109',1,1,'Delta Food Palace',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',2101.00,500.00,2601.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-36-1785706357','2026-08-02 21:32:37','2026-08-02 21:32:39',NULL),(37,'UE-20260802-7762',1,2,'Mayor Breakfast',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',3700.00,500.00,4200.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-37-1785706395','2026-08-02 21:33:15','2026-08-02 21:35:33',NULL),(38,'UE-TEST-1813',1,1,'Delta Food Palace',1,'Test Recipient','08012345678','Abraka Main','','Abraka','Delta State',2500.00,500.00,3000.00,'DELIVERED','PAID','FLUTTERWAVE',NULL,'2026-08-02 23:13:15','2026-08-02 23:44:00',NULL),(39,'UE-20260803-0532',1,2,'Mayor Breakfast',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',2000.00,500.00,2500.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-39-1785713285','2026-08-02 23:28:05','2026-08-02 23:49:21',NULL),(40,'UE-20260803-0371',64,19,'Mama Puts',16,'Nwachuku','09062053495','INTEGRITY HOSTEL','Site 1','Abraka','Delta State',1500.00,500.00,2000.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-40-1785716989','2026-08-03 00:29:49','2026-08-03 00:32:25',NULL),(41,'UE-20260803-6288',1,19,'Mama Puts',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',1000.00,500.00,1500.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-41-1785718849','2026-08-03 01:00:49','2026-08-03 01:01:00',NULL),(42,'UE-20260803-1980',1,2,'Mayor Breakfast',13,'Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',2000.00,500.00,2500.00,'OUT_FOR_DELIVERY','PAID','FLUTTERWAVE','UE-TX-42-1785719312','2026-08-03 01:08:32','2026-08-30 07:19:14',NULL),(43,'UE-20260804-3809',66,1,'Delta Food Palace',17,'Paul Aze','080907777777744','aunty rose street','Site 1','Abraka','Delta State',1200.00,500.00,1700.00,'DELIVERED','PAID','FLUTTERWAVE','UE-TX-43-1785861014','2026-08-04 16:30:14','2026-08-04 17:00:15',NULL),(44,'UE-20260808-7084',5,19,'Mama Puts',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',2000.00,500.00,2500.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-44-1786191971','2026-08-08 12:26:11','2026-08-19 01:16:50','2026-08-19 01:16:50'),(45,'UE-20260819-4658',5,19,'Mama Puts',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',3000.00,500.00,3500.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-45-1787104135','2026-08-19 01:48:55','2026-08-19 01:48:59',NULL),(46,'UE-20260819-7263',5,19,'Mama Puts',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',4200.00,500.00,4700.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-46-1787104702','2026-08-19 01:58:22','2026-08-19 01:58:27',NULL),(47,'UE-20260819-7744',5,19,'Mama Puts',18,'Chelseachi','08124971617','okpogoro street off blue filling station','Etor Road','Abraka','Delta State',7400.00,500.00,7900.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-47-1787136632','2026-08-19 10:50:32','2026-08-19 10:50:34',NULL),(48,'UE-20260819-1283',5,4,'Obinna Buka',18,'Chelseachi','08124971617','okpogoro street off blue filling station','Etor Road','Abraka','Delta State',4150.00,500.00,4650.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-48-1787136724','2026-08-19 10:52:04','2026-08-19 10:52:06',NULL),(49,'UE-20260819-8365',5,4,'Obinna Buka',18,'Chelseachi','08124971617','okpogoro street off blue filling station','Etor Road','Abraka','Delta State',2000.00,500.00,2500.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-49-1787137051','2026-08-19 10:57:31','2026-08-19 10:57:32',NULL),(50,'UE-20260825-8355',5,4,'Obinna Buka',12,'Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',2000.00,500.00,2500.00,'CONFIRMED','PAID','FLUTTERWAVE','UE-TX-50-1787679014','2026-08-25 17:30:14','2026-08-25 17:30:15',NULL);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `tx_ref` varchar(150) NOT NULL,
  `flw_ref` varchar(150) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'NGN',
  `status` enum('PENDING','SUCCESSFUL','FAILED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `raw_response` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_payment_tx_ref` (`tx_ref`),
  KEY `idx_payments_order` (`order_id`),
  KEY `idx_payments_user` (`user_id`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,8,'UE-TX-1-1785448240',NULL,4000.00,'NGN','SUCCESSFUL','{\"order_id\":1,\"tx_ref\":\"UE-TX-1-1785448240\",\"flw_ref\":null,\"status\":\"successful\"}','2026-07-30 21:50:40','2026-07-30 21:53:35'),(2,2,8,'UE-TX-2-1785449435',NULL,4700.00,'NGN','SUCCESSFUL','{\"order_id\":2,\"tx_ref\":\"UE-TX-2-1785449435\",\"flw_ref\":null,\"status\":\"successful\"}','2026-07-30 22:10:35','2026-07-30 22:10:46'),(3,3,8,'UE-TX-3-1785449631',NULL,3700.00,'NGN','SUCCESSFUL','{\"order_id\":3,\"tx_ref\":\"UE-TX-3-1785449631\",\"flw_ref\":null,\"status\":\"successful\"}','2026-07-30 22:13:51','2026-07-30 22:13:53'),(4,4,8,'UE-TX-4-1785453363',NULL,5000.00,'NGN','SUCCESSFUL','{\"order_id\":4,\"tx_ref\":\"UE-TX-4-1785453363\",\"flw_ref\":null,\"status\":\"successful\"}','2026-07-30 23:16:03','2026-07-30 23:16:06'),(5,5,8,'UE-TX-5-1785454659',NULL,4000.00,'NGN','SUCCESSFUL','{\"order_id\":5,\"tx_ref\":\"UE-TX-5-1785454659\",\"flw_ref\":null,\"status\":\"successful\"}','2026-07-30 23:37:39','2026-07-30 23:38:33'),(15,15,5,'UE-TX-15-1785497030',NULL,2650.00,'NGN','SUCCESSFUL','{\"order_id\":15,\"tx_ref\":\"UE-TX-15-1785497030\",\"flw_ref\":null,\"status\":\"successful\"}','2026-07-31 11:23:50','2026-07-31 11:23:53'),(16,16,5,'UE-TX-16-1785497406',NULL,11250.00,'NGN','SUCCESSFUL','{\"order_id\":16,\"tx_ref\":\"UE-TX-16-1785497406\",\"flw_ref\":null,\"status\":\"successful\"}','2026-07-31 11:30:06','2026-07-31 11:30:08'),(17,17,5,'UE-TX-17-1785555402',NULL,8553.00,'NGN','SUCCESSFUL','{\"order_id\":17,\"tx_ref\":\"UE-TX-17-1785555402\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 03:36:42','2026-08-01 03:36:46'),(18,18,5,'UE-TX-18-1785555749',NULL,2601.00,'NGN','SUCCESSFUL','{\"order_id\":18,\"tx_ref\":\"UE-TX-18-1785555749\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 03:42:29','2026-08-01 03:42:30'),(19,19,5,'UE-TX-19-1785555991',NULL,2500.00,'NGN','SUCCESSFUL','{\"order_id\":19,\"tx_ref\":\"UE-TX-19-1785555991\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 03:46:31','2026-08-01 03:46:32'),(20,20,5,'UE-TX-20-1785556040',NULL,7000.00,'NGN','SUCCESSFUL','{\"order_id\":20,\"tx_ref\":\"UE-TX-20-1785556040\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 03:47:20','2026-08-01 03:47:21'),(21,21,5,'UE-TX-21-1785599892',NULL,4650.00,'NGN','SUCCESSFUL','{\"order_id\":21,\"tx_ref\":\"UE-TX-21-1785599892\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 15:58:12','2026-08-01 15:58:14'),(22,22,5,'UE-TX-22-1785600035',NULL,2650.00,'NGN','SUCCESSFUL','{\"order_id\":22,\"tx_ref\":\"UE-TX-22-1785600035\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 16:00:35','2026-08-01 16:00:37'),(23,23,5,'UE-TX-23-1785600103',NULL,2601.00,'NGN','SUCCESSFUL','{\"order_id\":23,\"tx_ref\":\"UE-TX-23-1785600103\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 16:01:43','2026-08-01 16:01:45'),(24,24,5,'UE-TX-24-1785600349',NULL,4000.00,'NGN','SUCCESSFUL','{\"order_id\":24,\"tx_ref\":\"UE-TX-24-1785600349\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 16:05:49','2026-08-01 16:05:51'),(25,25,5,'UE-TX-25-1785601285',NULL,2500.00,'NGN','SUCCESSFUL','{\"order_id\":25,\"tx_ref\":\"UE-TX-25-1785601285\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 16:21:25','2026-08-01 16:21:27'),(26,26,1,'UE-TX-26-1785601412',NULL,1951.00,'NGN','SUCCESSFUL','{\"order_id\":26,\"tx_ref\":\"UE-TX-26-1785601412\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 16:23:32','2026-08-01 16:23:34'),(27,27,8,'UE-TX-27-1785601504',NULL,5001.00,'NGN','SUCCESSFUL','{\"order_id\":27,\"tx_ref\":\"UE-TX-27-1785601504\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-01 16:25:04','2026-08-01 16:25:06'),(28,28,1,'UE-TX-28-1785687276',NULL,2500.00,'NGN','SUCCESSFUL','{\"order_id\":28,\"tx_ref\":\"UE-TX-28-1785687276\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-02 16:14:36','2026-08-02 16:14:38'),(29,29,59,'UE-TX-29-1785691900',NULL,4000.00,'NGN','PENDING',NULL,'2026-08-02 17:31:40','2026-08-02 17:31:40'),(30,30,1,'UE-TX-30-1785697563',NULL,2700.00,'NGN','PENDING',NULL,'2026-08-02 19:06:03','2026-08-02 19:06:03'),(31,31,1,'UE-TX-31-1785697612',NULL,2700.00,'NGN','CANCELLED','{\"order_id\":31,\"tx_ref\":\"UE-TX-31-1785697612\",\"flw_ref\":null,\"status\":\"cancelled\"}','2026-08-02 19:06:52','2026-08-02 19:07:18'),(32,32,1,'UE-TX-32-1785697646',NULL,2700.00,'NGN','SUCCESSFUL','{\"order_id\":32,\"tx_ref\":\"UE-TX-32-1785697646\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-02 19:07:26','2026-08-02 19:07:27'),(33,33,1,'UE-TX-33-1785698536',NULL,2700.00,'NGN','SUCCESSFUL','{\"order_id\":33,\"tx_ref\":\"UE-TX-33-1785698536\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-02 19:22:16','2026-08-02 19:22:18'),(34,34,1,'UE-TX-34-1785700394',NULL,2700.00,'NGN','SUCCESSFUL','{\"order_id\":34,\"tx_ref\":\"UE-TX-34-1785700394\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-02 19:53:14','2026-08-02 19:53:16'),(35,36,1,'UE-TX-36-1785706357',NULL,2601.00,'NGN','SUCCESSFUL','{\"order_id\":36,\"tx_ref\":\"UE-TX-36-1785706357\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-02 21:32:37','2026-08-02 21:32:39'),(36,37,1,'UE-TX-37-1785706395',NULL,4200.00,'NGN','SUCCESSFUL','{\"order_id\":37,\"tx_ref\":\"UE-TX-37-1785706395\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-02 21:33:15','2026-08-02 21:33:16'),(37,39,1,'UE-TX-39-1785713285',NULL,2500.00,'NGN','SUCCESSFUL','{\"order_id\":39,\"tx_ref\":\"UE-TX-39-1785713285\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-02 23:28:05','2026-08-02 23:28:16'),(38,40,64,'UE-TX-40-1785716989',NULL,2000.00,'NGN','SUCCESSFUL','{\"order_id\":40,\"tx_ref\":\"UE-TX-40-1785716989\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-03 00:29:49','2026-08-03 00:29:51'),(39,41,1,'UE-TX-41-1785718849',NULL,1500.00,'NGN','SUCCESSFUL','{\"order_id\":41,\"tx_ref\":\"UE-TX-41-1785718849\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-03 01:00:49','2026-08-03 01:01:00'),(40,42,1,'UE-TX-42-1785719312',NULL,2500.00,'NGN','SUCCESSFUL','{\"order_id\":42,\"tx_ref\":\"UE-TX-42-1785719312\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-03 01:08:32','2026-08-03 01:08:46'),(41,43,66,'UE-TX-43-1785861014',NULL,1700.00,'NGN','SUCCESSFUL','{\"order_id\":43,\"tx_ref\":\"UE-TX-43-1785861014\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-04 16:30:14','2026-08-04 16:30:16'),(42,44,5,'UE-TX-44-1786191971',NULL,2500.00,'NGN','SUCCESSFUL','{\"order_id\":44,\"tx_ref\":\"UE-TX-44-1786191971\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-08 12:26:11','2026-08-08 12:26:21'),(43,45,5,'UE-TX-45-1787104135',NULL,3500.00,'NGN','SUCCESSFUL','{\"order_id\":45,\"tx_ref\":\"UE-TX-45-1787104135\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-19 01:48:55','2026-08-19 01:48:59'),(44,46,5,'UE-TX-46-1787104702',NULL,4700.00,'NGN','SUCCESSFUL','{\"order_id\":46,\"tx_ref\":\"UE-TX-46-1787104702\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-19 01:58:22','2026-08-19 01:58:27'),(45,47,5,'UE-TX-47-1787136632',NULL,7900.00,'NGN','SUCCESSFUL','{\"order_id\":47,\"tx_ref\":\"UE-TX-47-1787136632\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-19 10:50:32','2026-08-19 10:50:34'),(46,48,5,'UE-TX-48-1787136724',NULL,4650.00,'NGN','SUCCESSFUL','{\"order_id\":48,\"tx_ref\":\"UE-TX-48-1787136724\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-19 10:52:04','2026-08-19 10:52:06'),(47,49,5,'UE-TX-49-1787137051',NULL,2500.00,'NGN','SUCCESSFUL','{\"order_id\":49,\"tx_ref\":\"UE-TX-49-1787137051\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-19 10:57:31','2026-08-19 10:57:32'),(48,50,5,'UE-TX-50-1787679014',NULL,2500.00,'NGN','SUCCESSFUL','{\"order_id\":50,\"tx_ref\":\"UE-TX-50-1787679014\",\"flw_ref\":null,\"status\":\"successful\"}','2026-08-25 17:30:14','2026-08-25 17:30:15');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `restaurants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `owner_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `logo_image` varchar(500) DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `opening_hours` varchar(100) DEFAULT NULL,
  `status` enum('open','closed','temporarily_closed') NOT NULL DEFAULT 'open',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `logo_url` varchar(255) DEFAULT NULL,
  `cover_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_restaurant_slug` (`slug`),
  KEY `idx_restaurant_status` (`status`),
  KEY `idx_restaurant_active` (`is_active`),
  KEY `idx_restaurant_owner` (`owner_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,9,'Delta Food Palace','delta-food-palace','Specializing in authentic native Delta soups, starch, fufu, jollof rice, and traditional dinner specialties prepared with fresh local ingredients.','Traditional & Native Soups','Site II, Abraka, Delta State','',NULL,'src/Delta Food Palace/Delta Food Palace.webp','8:00 AM - 10:00 PM','open',1,'2026-07-28 18:55:17','2026-08-06 15:06:46',NULL,'/uploads/restaurants/rest_cover_1_1786028806_784d14c6.webp'),(2,10,'Mayor Breakfast','mayor-breakfast','Your premier morning stop for fluffy pancakes, freshly baked croissants, hot Akamu, egg sandwiches, and natural cold-pressed juices.','Breakfast, Bakery & Fresh Juices','Campus Gate, Abraka, Delta State',NULL,NULL,'src/Mayor Breakfast/Mayor Breakfast Restaurant.webp','6:30 AM - 4:00 PM','open',1,'2026-07-28 18:55:17','2026-08-30 13:04:17',NULL,NULL),(3,11,'Royal Delta Buka','royal-delta-buka','Authentic local buka flavors featuring spicy goat meat pepper soup, fried rice, catfish specials, and tasty fast food favorites.','Native Buka & Grills','Abraka Main Market Road, Delta State',NULL,NULL,'src/Royal Delta Buka/Royal Delta Buka.jpg','10:00 AM - 11:00 PM','open',1,'2026-07-28 18:55:17','2026-07-30 23:28:01',NULL,NULL),(4,37,'Obinna Buka','-binna-uka-37','Delicious meals prepared by Obinna Buka.','General','Abraka, Delta State','09062053495',NULL,NULL,'8:00 AM - 10:00 PM','open',1,'2026-07-31 10:50:20','2026-07-31 14:19:05','/uploads/restaurants/rest_logo_4_1785507518_d1987154.jpg','/uploads/restaurants/rest_cover_4_1785507530_6cf1d89f.jpg'),(9,47,'Unapproved Pending Kitchen','-napproved-ending-itchen-47','Delicious meals prepared by Unapproved Pending Kitchen.','General','Abraka, Delta State','08011223344',NULL,NULL,NULL,'open',0,'2026-07-31 13:30:59','2026-07-31 13:30:59',NULL,NULL),(10,48,'Unapproved Pending Kitchen','-napproved-ending-itchen-48','Delicious meals prepared by Unapproved Pending Kitchen.','General','Abraka, Delta State','08011223344',NULL,NULL,NULL,'open',0,'2026-07-31 13:31:00','2026-07-31 13:31:00',NULL,NULL),(11,49,'Unapproved Pending Kitchen','-napproved-ending-itchen-49','Delicious meals prepared by Unapproved Pending Kitchen.','General','Abraka, Delta State','08011223344',NULL,NULL,NULL,'open',0,'2026-07-31 13:38:59','2026-07-31 13:38:59',NULL,NULL),(12,55,'Test Buka','-est-uka-55','Delicious meals prepared by Test Buka.','General','Abraka, Delta State','08012345678',NULL,NULL,NULL,'open',0,'2026-08-02 17:12:45','2026-08-04 17:24:22',NULL,NULL),(13,56,'Pending Taste Buka','-ending-aste-uka-56','Delicious meals prepared by Pending Taste Buka.','General','Abraka, Delta State','08099887766',NULL,NULL,NULL,'open',0,'2026-08-02 17:31:26','2026-08-02 17:31:26',NULL,NULL),(14,58,'Unapproved Pending Kitchen','-napproved-ending-itchen-58','Delicious meals prepared by Unapproved Pending Kitchen.','General','Abraka, Delta State','08011223344',NULL,NULL,NULL,'open',0,'2026-08-02 17:31:32','2026-08-02 17:31:32',NULL,NULL),(18,63,'Unapproved Pending Kitchen','-napproved-ending-itchen-63','Delicious meals prepared by Unapproved Pending Kitchen.','General','Abraka, Delta State','08011223344',NULL,NULL,NULL,'open',0,'2026-08-02 23:23:59','2026-08-02 23:23:59',NULL,NULL),(19,65,'Mama Puts','-ama-uts-65','Delicious meals prepared by Mama Puts.','General','Abraka, Delta State','09060552248',NULL,NULL,'08:00 AM - 10:00 PM','open',1,'2026-08-03 00:04:29','2026-08-04 16:26:27','/uploads/restaurants/rest_logo_19_1785860777_4ddc2c44.jpg','/uploads/restaurants/rest_cover_19_1785860227_91a923a7.jpg');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_addresses`
--

DROP TABLE IF EXISTS `user_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL DEFAULT 'Home',
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `address` varchar(255) NOT NULL,
  `area` varchar(100) NOT NULL DEFAULT 'Abraka',
  `city` varchar(50) NOT NULL DEFAULT 'Abraka',
  `state` varchar(50) NOT NULL DEFAULT 'Delta State',
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_addresses_user` (`user_id`),
  KEY `idx_addresses_default` (`is_default`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_addresses`
--

LOCK TABLES `user_addresses` WRITE;
/*!40000 ALTER TABLE `user_addresses` DISABLE KEYS */;
INSERT INTO `user_addresses` VALUES (1,7,'Home','Test Customer','08033445566','AP road','Site 1','Abraka','Delta State',1,'2026-07-30 20:50:58','2026-07-30 20:50:58'),(2,8,'Home','Customer Test','08012345678','Room 5, Integrity Hostel, Campus 2 Gate','Site 2','Abraka','Delta State',1,'2026-07-30 21:48:16','2026-07-30 21:48:16'),(12,5,'Home','Chelseachi','08124971617','AP Road, Ghana Quarters','Site 1','Abraka','Delta State',1,'2026-07-31 11:23:45','2026-07-31 11:23:45'),(13,1,'School','Chinedu Okafor','08012345678','NDDC Hostel','Site 3','Abraka','Delta State',1,'2026-08-01 16:23:30','2026-08-01 16:23:30'),(14,59,'Hostel B','Customer Rider Test','08099991111','15 Express Way','Site 2','Abraka','Delta State',1,'2026-08-02 17:31:40','2026-08-02 17:31:40'),(15,1,'School','Chinedu Okafor','08012345678','Faculty of Pharmacy','Site 3','Abraka','Delta State',0,'2026-08-02 19:06:42','2026-08-02 19:06:42'),(16,64,'Work','Nwachuku','09062053495','INTEGRITY HOSTEL','Site 1','Abraka','Delta State',1,'2026-08-03 00:29:46','2026-08-03 00:29:46'),(17,66,'Site 1','Paul Aze','080907777777744','aunty rose street','Site 1','Abraka','Delta State',1,'2026-08-04 16:30:10','2026-08-04 16:30:10'),(18,5,'Site 2','Chelseachi','08124971617','okpogoro street off blue filling station','Etor Road','Abraka','Delta State',0,'2026-08-19 10:50:19','2026-08-19 10:50:19');
/*!40000 ALTER TABLE `user_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','vendor','rider','admin') NOT NULL DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `application_status` enum('APPROVED','PENDING','REJECTED') NOT NULL DEFAULT 'APPROVED',
  `vendor_code` varchar(50) DEFAULT NULL,
  `rider_code` varchar(50) DEFAULT NULL,
  `is_online` tinyint(1) NOT NULL DEFAULT 0,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `approved_at` timestamp NULL DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `vendor_code` (`vendor_code`),
  UNIQUE KEY `rider_code` (`rider_code`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Chinedu Okafor','chinedu@example.com','08022334455','$2y$10$yWa9Jrk8HmpB4iuokODVbupGZQFKrv65fXRMCdN8RSEmLz/A3aDqy','customer','2026-07-28 13:25:02','2026-08-15 14:59:35','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(2,'Adaeze Obi','test_1785245134773@example.com','08099887766','$2y$10$6VhhyL.YcRZErJf0/kBOtu/KAWEaVUNh6QqDMRr2nBA2rYnIlU0fi','customer','2026-07-28 13:25:35','2026-07-28 13:25:35','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(3,'Emeka BrowserTest','emeka.browser@example.com','08033445566','$2y$10$K7mXoPTueo3SdhrSCAJlReqoa0VaHwoHmYAEXvZZuXg5PU3GYAFsW','customer','2026-07-28 13:30:04','2026-07-28 13:30:04','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(4,'Test User','test@gmail.com','08011223344','$2y$10$yWa9Jrk8HmpB4iuokODVbupGZQFKrv65fXRMCdN8RSEmLz/A3aDqy','customer','2026-07-28 13:36:28','2026-08-15 14:59:35','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(5,'Chelseachi','chelseachi@gmail.com','08124971617','$2y$10$hvhSARBQNOdJ5kSedP1glOKpgN//QGcZaJRElh50dOKtvnCf1J5ZO','customer','2026-07-28 13:37:52','2026-07-28 13:37:52','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(6,'benny blues','benny@gmail.com','09062053495','$2y$10$n9uSMxvVI9Rjv2jKd4EHq.62mamWWOYehoFu0XT6JLjPz7RHsNUea','customer','2026-07-28 14:15:50','2026-07-28 14:15:50','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(7,'Test Customer','customer@example.com','08033445566','$2y$10$yWa9Jrk8HmpB4iuokODVbupGZQFKrv65fXRMCdN8RSEmLz/A3aDqy','customer','2026-07-30 18:22:20','2026-08-15 14:59:35','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(8,'Emeka Okonkwor','customertest@example.com','08099887766','$2y$10$zxYPB12373YK68YR5DevDehB8t9.d.I1fU8EScKNAXYKClH8yDxtq','customer','2026-07-30 21:27:07','2026-07-30 23:09:28','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(9,'Delta Palace Vendor','delta@urbaneats.com','08011112222','$2y$10$aADCtuZK/31V5NItm3RM3.caV9qZn6tSuSnCKxX3VBpdIQVYuh35K','vendor','2026-07-30 23:28:01','2026-08-30 06:29:29','APPROVED','UE-VND-000001',NULL,1,1,'2026-08-30 06:29:29',NULL,1),(10,'Mayor Breakfast Vendor','mayor@urbaneats.com','08033334444','$2y$10$aADCtuZK/31V5NItm3RM3.caV9qZn6tSuSnCKxX3VBpdIQVYuh35K','vendor','2026-07-30 23:28:01','2026-08-30 06:29:29','APPROVED','UE-VND-000002',NULL,1,1,'2026-08-30 06:29:29',NULL,1),(11,'Royal Delta Buka Vendor','buka@urbaneats.com','08055556666','$2y$10$aADCtuZK/31V5NItm3RM3.caV9qZn6tSuSnCKxX3VBpdIQVYuh35K','vendor','2026-07-30 23:28:01','2026-08-30 06:29:29','APPROVED','UE-VND-000003',NULL,1,1,'2026-08-30 06:29:29',NULL,1),(18,'Test Customer A','customer_test_a@urbaneats.com','08099990000','$2y$10$zMR8ULCRyReMYBEEd29d9OaGtj0XLsQ1xgfH5lvUu6UdudvuPXAee','customer','2026-07-31 09:43:37','2026-07-31 09:43:37','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(25,'Swift Rider Delta','rider1@urbaneats.com','08077778888','$2y$10$aADCtuZK/31V5NItm3RM3.caV9qZn6tSuSnCKxX3VBpdIQVYuh35K','rider','2026-07-31 10:01:45','2026-08-30 06:29:29','APPROVED',NULL,'UE-RDR-000001',1,1,'2026-08-30 06:29:29',NULL,1),(26,'Abraka Express Rider','rider2@urbaneats.com','08088889999','$2y$10$aADCtuZK/31V5NItm3RM3.caV9qZn6tSuSnCKxX3VBpdIQVYuh35K','rider','2026-07-31 10:01:45','2026-08-30 08:54:23','APPROVED',NULL,'UE-RDR-000002',1,1,'2026-08-30 06:29:29',NULL,1),(37,'Obinna','obinna@gmail.com','09062053495','$2y$10$tCEoAyu44VwALannFBnQze1fZfx4ZK3xkr4O6LsEd71Ryz2gneg2W','vendor','2026-07-31 10:50:20','2026-07-31 10:50:20','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(38,'Oliseneku Chinwemba','oliseneku2chinwemba@gmail.com','08124971617','$2y$10$4LekftfAZgYWV8sUwB2uSux2NoiXAqVK4JWIdBu4K.k3ZLUz1QHy.','rider','2026-07-31 12:09:44','2026-07-31 12:09:44','PENDING',NULL,NULL,0,1,NULL,NULL,1),(47,'Pending Vendor Phase 8','pending_v8_1785504658@urbaneats.com','08011223344','$2y$10$CWlTG2/bFH.EDrKHTqlC/O6A/rBI.maTCYDjOgTZlXx10ILtHsM46','vendor','2026-07-31 13:30:59','2026-07-31 13:30:59','PENDING',NULL,NULL,0,1,NULL,NULL,1),(48,'Pending Vendor Phase 8','pending_v8_1785504659@urbaneats.com','08011223344','$2y$10$FaqLFh2ww/BErM0tpDB2DuST0Krr5WYYBuw1XaCygP8HrozK8epb.','vendor','2026-07-31 13:31:00','2026-07-31 13:31:00','PENDING',NULL,NULL,0,1,NULL,NULL,1),(49,'Pending Vendor Phase 8','pending_v8_1785505139@urbaneats.com','08011223344','$2y$10$UViFEjRiuDUkBlq082UXm.F/SZkhQohm89/mLiPjnS37HzDKIS6lS','vendor','2026-07-31 13:38:59','2026-07-31 13:38:59','PENDING',NULL,NULL,0,1,NULL,NULL,1),(53,'Test Customer V5','customer_v5_1785505466@urbaneats.com','08099990000','$2y$10$cORLY5Yi0KTcirnKtJXBz.qifq8mzQUuWzRAhqnL21SxFxWPFNOlu','customer','2026-07-31 13:44:26','2026-07-31 13:44:26','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(54,'UrbanEats Admin','admin@urbaneats.com','08000000000','$2y$10$aADCtuZK/31V5NItm3RM3.caV9qZn6tSuSnCKxX3VBpdIQVYuh35K','admin','2026-08-01 03:44:36','2026-08-30 06:29:29','APPROVED',NULL,NULL,1,1,'2026-08-30 06:29:29',NULL,1),(55,'Test Vendor','testvendor@urbaneats.com','08012345678','$2y$10$D2Ri4bZRMgQ/uyBHb2MYROps4a8d3OVkD4xzGDpSSJ/K4ocQgeHye','vendor','2026-08-02 17:12:45','2026-08-04 17:24:22','REJECTED','UE-VND-000055',NULL,0,0,'2026-08-04 17:24:03',NULL,0),(56,'Pending Vendor Applicant','vendor_applicant_1785691886@urbaneats.com','08099887766','$2y$10$9zqLD8/uP6b8QKGzuDGWH.nlHZj1L1YemKnA/7JcZyYQXg8DZ/B7i','vendor','2026-08-02 17:31:26','2026-08-02 17:31:26','PENDING',NULL,NULL,0,1,NULL,NULL,1),(57,'Pending Rider Applicant','rider_applicant_1785691886@urbaneats.com','08088776655','$2y$10$u2ymiLs5IqpU1kOFfU7k.On9eF6rNDLjJWGOWiyxAT91zqJ6nB0lm','rider','2026-08-02 17:31:27','2026-08-02 18:46:13','REJECTED',NULL,NULL,0,1,NULL,NULL,1),(58,'Pending Vendor Phase 8','pending_v8_1785691892@urbaneats.com','08011223344','$2y$10$rDeWZj.hNQ5ucWtn3Hrjweo59uP95fGPR73OKD0Njl6z/olAY4dve','vendor','2026-08-02 17:31:32','2026-08-04 17:23:20','REJECTED',NULL,NULL,0,1,NULL,NULL,1),(59,'Customer Rider Test','cust_rider_test_1785691900@urbaneats.com','08099991111','$2y$10$9/q4IBEbgNeLAWbprPRtCO4W4cUKJN7aR4fMVfNz30FFhyBZCMuNK','customer','2026-08-02 17:31:40','2026-08-02 18:27:58','APPROVED',NULL,NULL,0,0,NULL,NULL,1),(63,'Pending Vendor Phase 8','pending_v8_1785713038@urbaneats.com','08011223344','$2y$10$2grWZCav.5VkYGeI12M1d.YVTHSttCGc2f1nl5EPbl0el4IpihQkO','vendor','2026-08-02 23:23:59','2026-08-04 17:23:09','REJECTED',NULL,NULL,0,1,NULL,NULL,1),(64,'Nwachuku','nwachuku@gmail.com','09062053495','$2y$10$W9BrQVTQr.QKbCSbEKOAP.EQWdQi7T9bJ2I5.rniD7b2Lwxxrpg4e','customer','2026-08-03 00:02:39','2026-08-03 00:02:39','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(65,'Oliseneku Chinwemba','olisenekuchinwemba@gmail.com','09060552248','$2y$10$y/NoJj9qZIT27Kz28Dp9nubApfdsgg5MPXGWaSGqrbgtnb8s7xLMK','vendor','2026-08-03 00:04:29','2026-08-03 00:42:15','APPROVED','UE-VND-000065',NULL,0,0,'2026-08-03 00:06:30',NULL,1),(66,'Paul Aze','paul@gmail.com','080907777777744','$2y$10$ylAIfHITnSNld9P4NDUmh.s.ZI0loXdUZMPNHfchoTWJ74vqPVg2y','customer','2026-08-04 16:29:01','2026-08-04 16:29:01','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(70,'Test Customer V5','customer_v5_1786028494@urbaneats.com','08099990000','$2y$10$Qd5SCUOLOuaXN97Gqix.1OrS5AjcZ0xyl88erHxcAqGjS6dpbNzRG','customer','2026-08-06 15:01:34','2026-08-06 15:01:34','APPROVED',NULL,NULL,0,1,NULL,NULL,1),(71,'Demo Customer','customer@urbaneats.com','08012345678','$2y$10$aADCtuZK/31V5NItm3RM3.caV9qZn6tSuSnCKxX3VBpdIQVYuh35K','customer','2026-08-30 06:29:29','2026-08-30 06:29:29','APPROVED',NULL,NULL,1,1,'2026-08-30 06:29:29',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'urbaneats_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-15 16:46:15
