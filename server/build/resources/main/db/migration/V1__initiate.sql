-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: vinaeatery
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `vinaeatery`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `vinaeatery` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `vinaeatery`;

--
-- Table structure for table `bill_details`
--

DROP TABLE IF EXISTS `bill_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill_details` (
  `food_id` int NOT NULL,
  `bill_id` int NOT NULL,
  `price` bigint NOT NULL,
  `quantity` bigint NOT NULL,
  `food_name_snapshot` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `food_unit_snapshot` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `food_price_snapshot` bigint NOT NULL,
  `total_price_detail` bigint NOT NULL,
  PRIMARY KEY (`food_id`,`bill_id`),
  KEY `FK_billDetails_bills` (`bill_id`),
  CONSTRAINT `FK_billDetails_bills` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`),
  CONSTRAINT `FK_billDetails_foods` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_details`
--

LOCK TABLES `bill_details` WRITE;
/*!40000 ALTER TABLE `bill_details` DISABLE KEYS */;
INSERT INTO `bill_details` VALUES (1,1,120000,1,'Thịt ba rọi nướng thơm lừng với sả và gia vị đặc trưng.','Phần',120000,120000),(1,2,120000,2,'Ba rọi nướng sả','Phần',120000,240000),(1,3,100000,1,'Ba rọi nướng sả','Phần',120000,100000),(1,4,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,6,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,7,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,8,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,10,120000,3,'Ba rọi nướng sả','Phần',120000,360000),(1,12,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,13,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,14,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,15,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(2,4,135000,2,'Bò xào cải thìa','Phần',135000,270000),(2,10,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,12,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,13,135000,2,'Bò xào cải thìa','Phần',135000,270000),(2,14,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,15,135000,2,'Bò xào cải thìa','Phần',135000,270000),(3,1,95000,1,'Món gỏi thanh mát với tôm sú, thịt heo và rau củ.','Phần',95000,95000),(3,4,95000,4,'Gỏi tôm thịt','Phần',95000,190000),(3,5,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,13,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,14,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(4,4,100000,3,'Mì xào bò phô mai','Phần',100000,100000),(4,5,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,10,100000,4,'Mì xào bò phô mai','Phần',100000,400000),(4,12,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,13,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,14,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,15,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(5,4,75000,1,'Đậu hũ kho nấm','Phần',75000,75000),(5,10,75000,1,'Đậu hũ kho nấm','Phần',75000,75000),(5,13,75000,2,'Đậu hũ kho nấm','Phần',75000,150000),(6,2,250000,2,'Lẩu dê lá chanh','Nồi',250000,500000),(6,4,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,5,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,12,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,13,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(7,2,70000,5,'Súp gà nấm','Tô',70000,350000),(7,10,70000,1,'Súp gà nấm','Tô',70000,70000),(7,12,70000,1,'Súp gà nấm','Tô',70000,70000),(7,15,70000,3,'Súp gà nấm','Tô',70000,210000),(8,10,95000,1,'Gà chiên bơ','Phần',95000,95000),(8,15,95000,2,'Gà chiên bơ','Phần',95000,190000),(9,3,90000,3,'Mực xào cay','Phần',110000,270000),(9,5,110000,1,'Mực xào cay','Phần',110000,110000),(9,10,110000,1,'Mực xào cay','Phần',110000,110000),(9,12,110000,1,'Mực xào cay','Phần',110000,110000),(9,13,110000,1,'Mực xào cay','Phần',110000,110000),(9,14,110000,1,'Mực xào cay','Phần',110000,110000),(10,4,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,5,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,10,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,12,65000,2,'Canh rong biển trứng','Tô',65000,130000),(10,13,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,14,65000,3,'Canh rong biển trứng','Tô',65000,195000),(11,13,120000,1,'Bún thịt nướng','Tô',120000,120000),(11,14,120000,1,'Bún thịt nướng','Tô',120000,120000),(12,1,45000,1,'Khoai tây chiên giòn, ăn kèm tương ớt.','Phần',45000,45000),(12,4,45000,3,'Khoai tây chiên','Phần',45000,45000),(12,13,45000,2,'Khoai tây chiên','Phần',45000,90000),(12,14,45000,1,'Khoai tây chiên','Phần',45000,45000),(13,4,85000,2,'Mì xào chay rau củ','Phần',85000,170000),(13,10,85000,1,'Mì xào chay rau củ','Phần',85000,85000),(13,12,85000,2,'Mì xào chay rau củ','Phần',85000,170000),(14,4,70000,3,'Gỏi cuốn đậu hũ','Phần',70000,210000),(14,10,70000,4,'Gỏi cuốn đậu hũ','Phần',70000,280000),(16,12,280000,1,'Lẩu hải sản chua cay','Nồi',280000,280000),(18,3,80000,1,'Lẩu thái chua cay','Nồi',100000,80000);
/*!40000 ALTER TABLE `bill_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime NOT NULL,
  `customer_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `customer_fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `customer_id` int NOT NULL,
  `customer_phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employee_id` int NOT NULL,
  `payment_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `payment_method_id` int NOT NULL,
  `payment_status` varchar(6) COLLATE utf8mb4_general_ci NOT NULL,
  `payment_at` datetime(6) NOT NULL,
  `payment_total_price` bigint NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(9) COLLATE utf8mb4_general_ci NOT NULL,
  `total_price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_bills_restaurants` (`restaurant_id`),
  KEY `FK_bills_employees` (`employee_id`),
  KEY `FK_bills_customers` (`customer_id`),
  CONSTRAINT `FK_bills_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK_bills_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_bills_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES (1,'2025-07-21 10:00:00','khachhang@gmail.com','Khách hàng',1,'0000000000',1,'thanh-toan-bang-tien-mat-1',1,'PAID','2025-07-21 10:00:00.000000',260000,1,'CONFIRMED',260000),(2,'2026-08-01 23:06:59','1@gmail.com','1',1,'1111111111',1,'don-mon-an-tao-thu-cong-mdoj0rwb',1,'PAID','2026-08-01 00:00:00.000000',1090000,1,'CONFIRMED',1090000),(3,'2026-08-01 23:08:40','2@gmail.com','2',1,'2222222222',1,'don-mon-an-tao-thu-cong-nvv271d2',1,'PAID','2026-08-01 00:00:00.000000',450000,1,'CONFIRMED',450000),(4,'2026-08-02 00:41:03','1@gmail.com','1',1,'1111111111',1,'TM-1785606063298',1,'PAID','2026-08-02 00:41:03.000000',1495000,1,'CONFIRMED',1495000),(5,'2026-08-02 01:02:34','tranvana@gmail.com','Trần Văn A',2,'0000000001',1,'260802_128518',5,'PAID','2026-08-02 01:02:34.000000',620000,1,'CONFIRMED',620000),(6,'2026-08-02 11:55:15','tranvana@gmail.com','Trần Văn A',2,'0000000001',1,'260802_743438',5,'PAID','2026-08-02 11:55:15.000000',120000,1,'CONFIRMED',120000),(7,'2026-08-02 12:02:29','tranvana@gmail.com','Trần Văn A',2,'0000000001',1,'260802_910449',5,'PAID','2026-08-02 12:02:29.000000',120000,1,'CONFIRMED',120000),(8,'2026-08-02 12:03:45','tranvana@gmail.com','Trần Văn A',2,'0000000001',1,'260802_192133',5,'PAID','2026-08-02 12:03:45.000000',120000,1,'CONFIRMED',120000),(9,'2026-08-02 12:14:04','tranvana@gmail.com','Trần Văn A',2,'0000000001',1,'TM-1785647644456',1,'PAID','2026-08-02 12:14:04.000000',0,1,'CONFIRMED',0),(10,'2026-08-02 12:33:58','tranvana@gmail.com','Trần Văn A',2,'0000000001',1,'260802_603747',5,'PAID','2026-08-02 12:33:58.000000',1675000,1,'CONFIRMED',1675000),(11,'2026-08-02 12:44:59','tranvana@gmail.com','Trần Văn A',2,'0000000001',1,'TM-1785649499450',1,'PAID','2026-08-02 12:44:59.000000',0,1,'CONFIRMED',0),(12,'2026-08-02 12:54:28','1@gmail.com','1',1,'1111111111',1,'TM-1785650068010',1,'PAID','2026-08-02 12:54:28.000000',1365000,1,'CONFIRMED',1365000),(13,'2026-08-02 13:04:34','tq@gmail.com','Thanh Quy',1,'11111111111',1,'TM-1785650674795',1,'PAID','2026-08-02 13:04:34.000000',1370000,1,'CONFIRMED',1370000),(14,'2026-08-02 13:16:16','1@gmail.com','Thanh Quy',1,'1111111111',1,'260802_537042',5,'PAID','2026-08-02 13:16:16.000000',920000,1,'CONFIRMED',920000),(15,'2026-08-02 13:41:21','tq@gmail.com','Thanh Quy',1,'1111111111',1,'260802_748915',5,'PAID','2026-08-02 13:41:21.000000',890000,1,'CONFIRMED',890000);
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_foods`
--

DROP TABLE IF EXISTS `category_foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_foods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_categoryFoods_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_categoryFoods_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_foods`
--

LOCK TABLES `category_foods` WRITE;
/*!40000 ALTER TABLE `category_foods` DISABLE KEYS */;
INSERT INTO `category_foods` VALUES (1,'Các món ăn nhẹ như gỏi, súp, chả giò dùng để khai vị.',NULL,'Khai vị',1,'ACTIVE'),(2,'Các món ăn chính như cơm, bún, phở, lẩu,...',NULL,'Món chính',1,'ACTIVE'),(3,'Các món ngọt hoặc trái cây dùng sau bữa ăn.',NULL,'Tráng miệng',1,'ACTIVE'),(4,'Nước ngọt, bia, rượu, sinh tố, nước ép,...',NULL,'Thức uống',1,'ACTIVE'),(5,'Món ăn chay sử dụng nguyên liệu từ thực vật.',NULL,'Món chay',1,'ACTIVE'),(6,'Các món rau trộn nhiều loại sốt đa dạng.',NULL,'Salad',1,'ACTIVE'),(7,'Món mì, bún xào, bún nước, hủ tiếu,...',NULL,'Mì & Bún',1,'ACTIVE'),(8,'Các món lẩu đa dạng như lẩu thái, lẩu nấm, lẩu bò,...',NULL,'Lẩu',1,'ACTIVE'),(9,'Các món nướng như thịt nướng, hải sản nướng,...',NULL,'Đồ nướng',1,'ACTIVE'),(10,'Các món chiên như gà rán, khoai tây chiên,...',NULL,'Đồ chiên',1,'ACTIVE'),(11,'Các món chế biến từ hải sản như tôm, cua, mực,...',NULL,'Hải sản',1,'ACTIVE'),(12,'Các món cơm dĩa, cơm phần, cơm chiên,...',NULL,'Cơm',1,'ACTIVE'),(13,'Hamburger, sandwich, xúc xích, gà rán,...',NULL,'Đồ ăn nhanh',1,'ACTIVE'),(14,'Món hấp như bánh bao, há cảo, cá hấp,...',NULL,'Đồ hấp',1,'ACTIVE'),(15,'Các loại canh, súp ăn kèm cơm hoặc khai vị.',NULL,'Canh & Súp',1,'ACTIVE');
/*!40000 ALTER TABLE `category_foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_ingredients`
--

DROP TABLE IF EXISTS `category_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_categoryIngredients_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_categoryIngredients_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_ingredients`
--

LOCK TABLES `category_ingredients` WRITE;
/*!40000 ALTER TABLE `category_ingredients` DISABLE KEYS */;
INSERT INTO `category_ingredients` VALUES (1,'Thịt heo, bò, dê, trâu... giàu đạm và sắt','Thịt đỏ',1,'ACTIVE'),(2,'Thịt gà, vịt, ngan... ít béo, dễ tiêu hóa','Thịt trắng',1,'ACTIVE'),(3,'Tôm, cua, cá, mực, nghêu, sò... từ biển và sông','Hải sản',1,'ACTIVE'),(4,'Trứng gia cầm, sữa tươi, sữa đặc, phô mai...','Trứng & Sữa',1,'ACTIVE'),(5,'Rau muống, cải thìa, cải ngọt, rau dền...','Rau ăn lá',1,'ACTIVE'),(6,'Cà rốt, khoai tây, hành tây, su su, bí đỏ...','Củ quả',1,'ACTIVE'),(7,'Muối, tiêu, đường, bột ngọt, hạt nêm...','Gia vị khô',1,'ACTIVE'),(8,'Nước mắm, nước tương, dầu hào, giấm, tương ớt...','Gia vị ướt',1,'ACTIVE'),(9,'Dầu ăn, mỡ heo, dầu mè, bơ...','Dầu mỡ',1,'ACTIVE'),(10,'Đậu hũ, nấm rơm, nấm mèo, nấm kim châm...','Đậu & Nấm',1,'ACTIVE'),(11,'Bột mì, bột năng, bột bắp, bún, mì, cơm...','Tinh bột',1,'ACTIVE'),(12,'Miến khô, nấm khô, mộc nhĩ, rong biển...','Thực phẩm khô',1,'ACTIVE'),(13,'Lá chanh, sả, gừng, quế, hồi, rau thơm...','Thảo mộc & Lá',1,'ACTIVE');
/*!40000 ALTER TABLE `category_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_tables`
--

DROP TABLE IF EXISTS `category_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `surcharge_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `surcharge_value` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_categoryTables_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_categoryTables_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_tables`
--

LOCK TABLES `category_tables` WRITE;
/*!40000 ALTER TABLE `category_tables` DISABLE KEYS */;
INSERT INTO `category_tables` VALUES (1,'Bàn tiêu chuẩn không phụ thu','Bàn thường',1,'ACTIVE','FIXED',0),(2,'View đẹp, phụ thu 5% hóa đơn','Bàn gần cửa sổ',1,'ACTIVE','FIXED',5),(3,'Không gian riêng tư, phụ thu cố định 100K','Bàn VIP',1,'ACTIVE','PERCENT',100000),(4,'Phòng kín không có máy lạnh, phụ thu 200K/lượt','Phòng riêng thường',1,'ACTIVE','FIXED',200000),(5,'Phòng kín có máy lạnh, phụ thu 500K/lượt','Phòng riêng Vip',1,'ACTIVE','FIXED',500000);
/*!40000 ALTER TABLE `category_tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `birthdate` date DEFAULT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `house_number` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `street_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ward` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `province` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrfbvkrffamfql7cjmen8v976v` (`email`),
  UNIQUE KEY `UKm3iom37efaxd5eucmxjqqcbe9` (`phone`),
  KEY `FK_customers_users` (`user_id`),
  CONSTRAINT `FK_customers_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'2002-02-28','Dùng để khi xử lý cho khách hàng chưa có tài khoản trên hệ thống','khachahang@gmail.com','Khách hàng','MALE',NULL,'0000000000','ACTIVE',9,'1','Đường Hùng Vương','Phường Tân An','Tỉnh Tây Ninh'),(2,'2000-07-02',NULL,'tranvana@gmail.com','Trần Văn A','MALE',NULL,'0000000001','ACTIVE',10,'25','Đường Trần Hưng Đạo','Phường Ninh Kiều','Thành phố Cần Thơ'),(3,'2000-08-20',NULL,'nguyenthib@gmail.com','Nguyễn Thị B','FEMALE',NULL,'0000000002','ACTIVE',11,'102','Đường Nguyễn Văn Linh','Phường Hải Châu','Thành phố Đà Nẵng');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `birthdate` date DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` varchar(6) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permission_id` int NOT NULL,
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `house_number` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `street_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ward` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `province` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKj9xgmd0ya5jmus09o0b8pqrpb` (`email`),
  UNIQUE KEY `UKgnponadwwxr5nm2tqe5b905hs` (`phone`),
  KEY `FK_employees_restaurants` (`restaurant_id`),
  KEY `FK_employees_users` (`user_id`),
  KEY `FK_employees_roles` (`role_id`),
  KEY `FK_employees_permissions` (`permission_id`),
  CONSTRAINT `FK_employees_permissions` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FK_employees_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_employees_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_employees_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'2003-09-10','quanly@gmail.com','Quản lý','MALE',NULL,1,'0000000000',1,'ACTIVE',4,'18','Nguyễn Đình Chiểu','Phường Võ Thị Sáu','Thành phố Hồ Chí Minh',NULL,1),(2,'1996-10-02','qlvanhanh@gmail.com','Quản lý vận hành','MALE',NULL,2,'0000000001',1,'ACTIVE',5,'45','Điện Biên Phủ','Phường Thạnh Mỹ Tây','Thành phố Hồ Chí Minh',NULL,2),(3,'2000-05-25','qlchongoi@gmail.com','Quản lý chổ ngồi','FEMALE',NULL,3,'0000000002',1,'ACTIVE',6,'72','Phan Văn Trị','Phường An Nhơn','Thành phố Hồ Chí Minh',NULL,3),(4,'2000-04-26','qlkhohang@gmail.com','Quản lý kho hàng','MALE',NULL,4,'0000000003',1,'ACTIVE',7,'126','Lũy Bán Bích','Phường Phú Thọ Hòa','Thành phố Hồ Chí Minh',NULL,4),(5,'2001-02-20','qlnhansu@gmail.com','Quản lý nhân sự','FEMALE',NULL,5,'0000000004',1,'ACTIVE',8,'39','Nguyễn Văn Linh','Phường Tân Mỹ','Thành phố Hồ Chí Minh',NULL,5);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_experiences`
--

DROP TABLE IF EXISTS `feedback_experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback_experiences` (
  `id` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `index` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_experiences`
--

LOCK TABLES `feedback_experiences` WRITE;
/*!40000 ALTER TABLE `feedback_experiences` DISABLE KEYS */;
INSERT INTO `feedback_experiences` VALUES ('GOOD','good-emotion.png','Hài lòng',4),('OKAY','okay-emotion.png','Bình thường',3),('PERFECT','perfect-emotion.png','Tuyệt vời',5),('POOR','poor-emotion.png','Không hài lòng',2),('TERRIBLE','terrible-emotion.png','Dở tệ',1);
/*!40000 ALTER TABLE `feedback_experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_scores`
--

DROP TABLE IF EXISTS `feedback_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback_scores` (
  `id` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `index` tinyint NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_scores`
--

LOCK TABLES `feedback_scores` WRITE;
/*!40000 ALTER TABLE `feedback_scores` DISABLE KEYS */;
INSERT INTO `feedback_scores` VALUES ('EMPLOYEE','Thái độ nhân viên',3),('FOOD','Chất lượng món ăn',1),('PLACE','Không gian và vệ sinh',5),('SERVICE','Dịch vụ mang lại',4),('SPEED','Tốc độ phục vụ',2);
/*!40000 ALTER TABLE `feedback_scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `at` datetime NOT NULL,
  `experience` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `score1` tinyint NOT NULL,
  `score2` tinyint NOT NULL,
  `score3` tinyint NOT NULL,
  `score4` tinyint NOT NULL,
  `score5` tinyint NOT NULL,
  `message` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_feedbacks_restaurants` (`restaurant_id`),
  KEY `FK_feedbacks_customers` (`customer_id`),
  CONSTRAINT `FK_feedbacks_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK_feedbacks_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,1,1,'2026-08-02 00:41:19','GOOD',4,5,3,4,5,'1'),(2,1,2,'2026-08-02 05:42:39','PERFECT',4,5,3,4,3,'1'),(3,1,2,'2026-08-02 12:04:00','PERFECT',5,5,5,5,5,'1'),(4,1,2,'2026-08-02 12:14:12','PERFECT',5,5,5,5,5,'1'),(5,1,2,'2026-08-02 12:40:58','PERFECT',5,4,5,4,5,'1'),(6,1,2,'2026-08-02 12:45:06','PERFECT',5,5,5,5,5,'1'),(7,1,1,'2026-08-02 12:54:43','PERFECT',5,5,5,5,5,'ngon á!'),(8,1,1,'2026-08-02 13:04:42','PERFECT',5,5,5,5,5,'1'),(9,1,1,'2026-08-02 13:17:50','PERFECT',5,5,5,5,5,'1'),(10,1,1,'2026-08-02 13:41:56','PERFECT',5,5,5,5,5,'món ăn của nhà hàng rất ngon ạ!');
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_floors_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_floors_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,'Sảnh chờ, nhà bếp, kho hàng...','Tầng 1',1,'INACTIVE'),(2,'Khu ăn uống bình dân','Tầng 2',1,'ACTIVE'),(3,'Khu gia đình, yên tĩnh','Tầng 3',1,'ACTIVE'),(4,'Khu VIP, máy lạnh đầy đủ','Tầng 4',1,'ACTIVE');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_food_id` int NOT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `price` bigint NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(12) COLLATE utf8mb4_general_ci NOT NULL,
  `unit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_foods_restaurants` (`restaurant_id`),
  KEY `FK_foods_categoryFoods` (`category_food_id`),
  CONSTRAINT `FK_foods_categoryFoods` FOREIGN KEY (`category_food_id`) REFERENCES `category_foods` (`id`),
  CONSTRAINT `FK_foods_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (1,9,'Thịt ba rọi nướng thơm lừng với sả và gia vị đặc trưng.',NULL,'Ba rọi nướng sả',120000,1,'SELLING','Phần'),(2,2,'Thịt bò thăn mềm mại xào cùng cải thìa tươi xanh.',NULL,'Bò xào cải thìa',135000,1,'SELLING','Phần'),(3,1,'Món gỏi thanh mát với tôm sú, thịt heo và rau củ.',NULL,'Gỏi tôm thịt',95000,1,'SELLING','Phần'),(4,7,'Mì trứng xào bò với phô mai béo ngậy.',NULL,'Mì xào bò phô mai',100000,1,'SELLING','Phần'),(5,5,'Đậu hũ trắng kho cùng nấm kim châm và gia vị đậm đà.',NULL,'Đậu hũ kho nấm',75000,1,'SELLING','Phần'),(6,8,'Lẩu thịt dê nấu với lá chanh, sả, rau nhúng đa dạng.',NULL,'Lẩu dê lá chanh',250000,1,'SELLING','Nồi'),(7,15,'Súp ức gà nấu cùng nấm, cà rốt và hành ngò.',NULL,'Súp gà nấm',70000,1,'SELLING','Tô'),(8,10,'Ức gà phi lê chiên vàng với bơ thơm ngậy.',NULL,'Gà chiên bơ',95000,1,'SELLING','Phần'),(9,11,'Mực ống xào với sả, ớt và gia vị đậm đà.',NULL,'Mực xào cay',110000,1,'SELLING','Phần'),(10,15,'Canh thanh mát với rong biển và trứng gà ta.',NULL,'Canh rong biển trứng',65000,1,'SELLING','Tô'),(11,7,'Thịt ba rọi nướng ăn kèm bún tươi, rau sống.',NULL,'Bún thịt nướng',120000,1,'SELLING','Tô'),(12,10,'Khoai tây chiên giòn, ăn kèm tương ớt.',NULL,'Khoai tây chiên',45000,1,'SELLING','Phần'),(13,5,'Mì trứng xào cùng nấm, cà rốt và cải thìa.',NULL,'Mì xào chay rau củ',85000,1,'SELLING','Phần'),(14,5,'Đậu hũ chiên cuốn rau và bún, chấm nước mắm chay.',NULL,'Gỏi cuốn đậu hũ',70000,1,'SELLING','Phần'),(15,13,'Bánh mì giòn ăn kèm trứng gà ốp la và pate.',NULL,'Bánh mì ốp la',40000,1,'SELLING','Ổ'),(16,8,'Tôm, mực, cá cùng rau lẩu và nước lẩu chua cay.',NULL,'Lẩu hải sản chua cay',280000,1,'SELLING','Nồi'),(17,7,'Phở nước truyền thống với thịt bò tái.',NULL,'Phở bò tái',75000,1,'SELLING','Tô'),(18,8,'Lẩu thái chua cay ngon đến tê lưỡi!','https://res.cloudinary.com/dzneg8cnu/image/upload/v1785584251/ca3d4dd9-631e-4351-b2be-efb9953ae419_images.webp','Lẩu thái chua cay',100000,1,'SELLING','Nồi');
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `functions`
--

DROP TABLE IF EXISTS `functions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `functions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `actions` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name_en` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name_vn` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `functions`
--

LOCK TABLES `functions` WRITE;
/*!40000 ALTER TABLE `functions` DISABLE KEYS */;
INSERT INTO `functions` VALUES (1,'Xem','dashboard','dashboard-profit','Thống kê Lợi nhuận'),(2,'Xem','dashboard','dashboard-revenue','Thống kê Doanh thu'),(3,'Xem','dashboard','dashboard-expense','Thống kê Chi tiêu'),(4,'Xem','dashboard','dashboard-feedback','Thống kê Đánh giá'),(5,'Xem','active','table-histories','Lịch sử bàn ăn'),(6,'Xem|Cập nhật','active','use-tables','Sử dụng bàn ăn'),(7,'Xem|Cập nhật','active','use-foods','Sử dụng món ăn'),(8,'Xem|Thêm|Cập nhật|Khóa','active','menus','Thực đơn'),(9,'Xem|Cập nhật','active','order-sheets','Phiếu gọi món'),(10,'Xem|Thêm','active','messages','Trò chuyện'),(11,'Xem|Thêm|Cập nhật','active','bills','Hoá đơn'),(12,'Xem|Thêm|Cập nhật','active','reservations','Đặt bàn'),(13,'Xem|Thêm|Cập nhật|Khóa','seat','floors','Tầng'),(14,'Xem|Thêm|Cập nhật|Khóa','seat','category-tables','Loại bàn ăn'),(15,'Xem|Thêm|Cập nhật|Khóa','seat','tables','Bàn ăn'),(16,'Xem|Thêm|Cập nhật','food','input-tickets','Phiếu nhập'),(17,'Xem|Thêm|Cập nhật|Khóa','food','suppliers','Nhà cung cấp'),(18,'Xem|Thêm|Cập nhật|Khóa','food','category-ingredients','Loại nguyên liệu'),(19,'Xem|Thêm|Cập nhật|Khóa','food','ingredients','Nguyên liệu'),(20,'Xem|Thêm|Cập nhật|Khóa','food','category-foods','Loại món ăn'),(21,'Xem|Thêm|Cập nhật|Khóa','food','foods','Món ăn'),(22,'Xem|Thêm|Cập nhật|Khóa','employee','roles','Chức vụ'),(23,'Xem|Thêm|Cập nhật|Khóa','employee','permissions','Quyền hạn'),(24,'Xem|Thêm|Cập nhật|Khóa','employee','employees','Nhân viên');
/*!40000 ALTER TABLE `functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `capacity` bigint NOT NULL,
  `category_ingredient_id` int NOT NULL,
  `date_create` date DEFAULT NULL,
  `date_remove` date DEFAULT NULL,
  `input_price` bigint DEFAULT NULL,
  `inventory` bigint DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `note` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `unit` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ingredients_restaurants` (`restaurant_id`),
  KEY `FK_ingredients_categoryIngredients` (`category_ingredient_id`),
  CONSTRAINT `FK_ingredients_categoryIngredients` FOREIGN KEY (`category_ingredient_id`) REFERENCES `category_ingredients` (`id`),
  CONSTRAINT `FK_ingredients_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (1,1,1,'2025-07-01',NULL,95000,50,'Thịt heo ba rọi','Dùng kho hoặc nướng',1,'ACTIVE','kg'),(2,1,1,'2025-07-01',NULL,230000,20,'Thịt bò thăn','Dùng áp chảo hoặc xào',1,'ACTIVE','kg'),(3,1,1,'2025-07-01',NULL,190000,189,'Thịt dê','Làm lẩu hoặc nướng ngũ vị',1,'ACTIVE','kg'),(4,1,2,'2025-07-01',NULL,85000,52,'Ức gà phi lê','Dùng xào hoặc salad',1,'ACTIVE','kg'),(5,1,2,'2025-07-01',NULL,125000,60,'Đùi vịt','Dùng nấu măng hoặc quay',1,'ACTIVE','kg'),(6,1,3,'2025-07-01',NULL,180000,177,'Tôm sú','Hấp, xào hoặc nấu canh',1,'ACTIVE','kg'),(7,1,3,'2025-07-01',NULL,150000,141,'Mực ống','Xào cay hoặc chiên giòn',1,'ACTIVE','kg'),(8,1,3,'2025-07-01',NULL,65000,61,'Cá basa phi lê','Dùng nấu lẩu hoặc chiên sả ớt',1,'ACTIVE','kg'),(9,1,4,'2025-07-01',NULL,5000,282,'Trứng gà ta','Chiên, hấp, kho, tạo kết dính',1,'ACTIVE','quả'),(10,380,4,'2025-07-01',NULL,15000,95,'Sữa đặc','Làm sốt hoặc pha nước chấm',1,'ACTIVE','ml'),(11,1,5,'2025-07-01',NULL,25000,98,'Cải thìa','Luộc hoặc xào tỏi',1,'ACTIVE','kg'),(12,1,5,'2025-07-01',NULL,18000,111,'Rau muống','Xào tỏi, ăn lẩu',1,'ACTIVE','kg'),(13,1,6,'2025-07-01',NULL,18000,79,'Cà rốt','Tạo màu và vị ngọt tự nhiên',1,'ACTIVE','kg'),(14,1,6,'2025-07-01',NULL,22000,109,'Khoai tây','Chiên, nấu súp, ninh',1,'ACTIVE','kg'),(15,500,7,'2025-07-01',NULL,3000,19,'Muối hột','Nêm nếm cơ bản',1,'ACTIVE','g'),(16,1000,7,'2025-07-01',NULL,10000,34,'Đường cát trắng','Tạo vị ngọt, làm caramel',1,'ACTIVE','g'),(17,500,8,'2025-07-01',NULL,18000,17,'Nước mắm Nam Ngư','Nước chấm hoặc ướp',1,'ACTIVE','ml'),(18,450,8,'2025-07-01',NULL,21000,11,'Dầu hào','Tạo độ bóng và vị mặn ngọt',1,'ACTIVE','ml'),(19,1000,9,'2025-07-01',NULL,45000,16,'Dầu ăn Tường An','Chiên, xào',1,'ACTIVE','ml'),(20,200,9,'2025-07-01',NULL,12000,27,'Bơ thực vật','Tạo mùi thơm và béo cho món Âu',1,'ACTIVE','g'),(21,1,10,'2025-07-01',NULL,3000,38,'Đậu hũ trắng','Kho, chiên, xào',1,'ACTIVE','miếng'),(22,150,10,'2025-07-01',NULL,15000,141,'Nấm kim châm','Dùng lẩu hoặc xào chay',1,'ACTIVE','g'),(23,500,11,'2025-07-01',NULL,10000,11,'Bún tươi','Ăn cùng nước lèo hoặc thịt nướng',1,'ACTIVE','g'),(24,300,11,'2025-07-01',NULL,8000,9,'Mì trứng khô','Luộc, xào, làm mì nước',1,'ACTIVE','g'),(25,200,12,'2025-07-01',NULL,12000,15,'Miến dong khô','Ngâm nước rồi nấu canh hoặc xào',1,'ACTIVE','g'),(26,100,12,'2025-07-01',NULL,15000,41,'Rong biển khô','Làm canh rong biển',1,'ACTIVE','g'),(27,50,13,'2025-07-01',NULL,7000,96,'Lá chanh','Khử mùi, tạo hương thơm',1,'ACTIVE','g'),(28,1,13,'2025-07-01',NULL,2000,96,'Sả cây','Dùng ướp, nấu lẩu',1,'ACTIVE','cây'),(29,100,13,'2025-07-01',NULL,6000,48,'Gừng tươi','Khử mùi tanh và tăng hương vị',1,'ACTIVE','g'),(30,1,4,'2025-07-01',NULL,5000,18,'Phô mai lát','Làm topping cho mì, bánh mì',1,'ACTIVE','miếng');
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `input_ticket_details`
--

DROP TABLE IF EXISTS `input_ticket_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `input_ticket_details` (
  `ingredient_id` int NOT NULL,
  `input_ticket_id` int NOT NULL,
  `input_price` bigint NOT NULL,
  `quantity` bigint NOT NULL,
  `ingredient_name_snapshot` varchar(256) COLLATE utf8mb4_general_ci NOT NULL,
  `ingredient_input_price_snapshot` bigint NOT NULL,
  `total_input_price_detail` bigint NOT NULL,
  PRIMARY KEY (`ingredient_id`,`input_ticket_id`),
  KEY `FK_inputTicketDetails_inputTickets` (`input_ticket_id`),
  CONSTRAINT `FK_inputTicketDetails_ingredients` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`),
  CONSTRAINT `FK_inputTicketDetails_inputTickets` FOREIGN KEY (`input_ticket_id`) REFERENCES `input_tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `input_ticket_details`
--

LOCK TABLES `input_ticket_details` WRITE;
/*!40000 ALTER TABLE `input_ticket_details` DISABLE KEYS */;
INSERT INTO `input_ticket_details` VALUES (1,1,95000,40,'Thịt heo ba rọi',95000,3800000),(1,23,95000,50,'Thịt heo ba rọi',95000,4750000),(2,1,230000,20,'Thịt bò thăn',230000,4600000),(2,5,230000,25,'Thịt bò thăn',230000,5750000),(2,25,230000,30,'Thịt bò thăn',230000,6900000),(3,3,190000,25,'Thịt dê',190000,4750000),(3,24,190000,20,'Thịt dê',190000,3800000),(4,2,85000,30,'Ức gà phi lê',85000,2550000),(4,23,85000,50,'Ức gà phi lê',85000,4250000),(5,2,125000,20,'Đùi vịt',125000,2500000),(5,25,125000,50,'Đùi vịt',125000,6250000),(6,1,180000,10,'Tôm sú',180000,1800000),(6,5,180000,20,'Tôm sú',180000,3600000),(6,24,180000,14,'Tôm sú',180000,2520000),(7,2,150000,15,'Mực ống',150000,2250000),(7,24,145000,20,'Mực ống',150000,2900000),(8,3,65000,30,'Cá basa phi lê',65000,1950000),(8,25,65000,50,'Cá basa phi lê',65000,3250000),(9,23,5000,200,'Trứng gà ta',5000,1000000),(10,25,15000,70,'Sữa đặc',15000,1050000),(11,1,25000,20,'Cải thìa',25000,500000),(11,25,20000,100,'Cải thìa',25000,2000000),(12,2,18000,40,'Rau muống',18000,720000),(12,23,18000,100,'Rau muống',18000,1800000),(13,3,18000,50,'Cà rốt',18000,900000),(13,23,20000,100,'Cà rốt',18000,2000000),(14,3,22000,40,'Khoai tây',22000,880000),(14,25,21000,100,'Khoai tây',22000,2100000),(17,5,18000,80,'Nước mắm Nam Ngư',18000,1440000),(17,25,16000,10,'Nước mắm Nam Ngư',18000,160000),(17,26,18000,5,'Nước mắm Nam Ngư',18000,90000),(17,27,18000,20,'Nước mắm Nam Ngư',18000,360000),(19,5,45000,30,'Dầu ăn Tường An',45000,1350000),(19,24,45000,50,'Dầu ăn Tường An',45000,2250000),(20,25,12000,20,'Bơ thực vật',12000,240000),(21,4,3000,100,'Đậu hũ trắng',3000,300000),(22,4,15000,50,'Nấm kim châm',15000,750000),(22,24,15000,100,'Nấm kim châm',15000,1500000),(23,4,10000,40,'Bún tươi',10000,400000),(24,4,8000,60,'Mì trứng khô',8000,480000),(26,25,15000,40,'Rong biển khô',15000,600000),(27,24,7000,100,'Lá chanh',7000,700000),(28,25,2000,100,'Sả cây',2000,200000),(29,24,6000,100,'Gừng tươi',6000,600000);
/*!40000 ALTER TABLE `input_ticket_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `input_tickets`
--

DROP TABLE IF EXISTS `input_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `input_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime NOT NULL,
  `employee_id` int NOT NULL,
  `payment_status` varchar(6) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(9) COLLATE utf8mb4_general_ci NOT NULL,
  `supplier_id` int NOT NULL,
  `total_input_price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_inputTickets_restaurants` (`restaurant_id`),
  KEY `FK_inputTickets_employees` (`employee_id`),
  KEY `FK_inputTickets_suppliers` (`supplier_id`),
  CONSTRAINT `FK_inputTickets_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_inputTickets_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_inputTickets_suppliers` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `input_tickets`
--

LOCK TABLES `input_tickets` WRITE;
/*!40000 ALTER TABLE `input_tickets` DISABLE KEYS */;
INSERT INTO `input_tickets` VALUES (1,'2025-03-01 08:00:00',1,'UNPAID',1,'CANCELLED',1,10700000),(2,'2025-03-15 09:30:00',2,'PAID',1,'CONFIRMED',2,8020000),(3,'2025-04-02 10:15:00',3,'PAID',1,'CONFIRMED',1,8480000),(4,'2025-04-20 14:00:00',4,'UNPAID',1,'PENDING',3,1930000),(5,'2025-05-10 08:45:00',5,'PAID',1,'CONFIRMED',2,12140000),(23,'2026-08-01 22:57:26',1,'PAID',1,'CONFIRMED',1,13800000),(24,'2026-08-02 12:15:26',1,'PAID',1,'CONFIRMED',1,14270000),(25,'2026-08-02 12:46:26',1,'PAID',1,'CONFIRMED',1,22750000),(26,'2026-08-02 13:08:38',1,'PAID',1,'CONFIRMED',1,90000),(27,'2026-08-02 13:34:45',1,'PAID',1,'CONFIRMED',1,360000);
/*!40000 ALTER TABLE `input_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managers`
--

DROP TABLE IF EXISTS `managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `managers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `birthdate` date NOT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `gender` varchar(6) COLLATE utf8mb4_general_ci NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `user_id` int NOT NULL,
  `house_number` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `street_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ward` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `province` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_managers_users` (`user_id`),
  CONSTRAINT `FK_managers_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `managers`
--

LOCK TABLES `managers` WRITE;
/*!40000 ALTER TABLE `managers` DISABLE KEYS */;
INSERT INTO `managers` VALUES (1,'2002-02-18',NULL,'thanhquy@gmail.com','Chủ cửa hàng Thanh Quy','MALE',NULL,'0000000001','ACTIVE',2,'123','Nguyễn Huệ','Bến Nghé','Thành phố Hồ Chí Minh'),(2,'1998-07-18',NULL,'phuoclong@gmail.com','Chủ nhà hàng Phước Long','MALE',NULL,'0000000002','ACTIVE',3,'45A','Lê Lợi','Phường 1','Tỉnh Đồng Nai');
/*!40000 ALTER TABLE `managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_details`
--

DROP TABLE IF EXISTS `menu_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_details` (
  `food_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`food_id`,`menu_id`),
  KEY `FK_menuDetails_menus` (`menu_id`),
  CONSTRAINT `FK_menuDetails_foods` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`),
  CONSTRAINT `FK_menuDetails_menus` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_details`
--

LOCK TABLES `menu_details` WRITE;
/*!40000 ALTER TABLE `menu_details` DISABLE KEYS */;
INSERT INTO `menu_details` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,1),(7,1),(8,1),(9,1),(10,1),(11,1),(12,1),(13,1),(14,1),(15,1),(16,1),(17,1),(1,2),(2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2),(1,3),(2,3),(3,3),(4,3),(5,3),(6,3),(7,3),(8,3),(9,3),(10,3),(11,3),(12,3),(13,3),(14,3),(1,4),(2,4),(3,4),(4,4),(5,4),(6,4),(7,4),(8,4),(9,4),(10,4),(11,4),(12,4),(13,4),(14,4),(15,4),(16,4),(17,4),(3,5),(5,5),(6,5),(8,5),(14,5),(18,5),(3,6),(4,6),(5,6),(8,6),(11,6),(13,6),(14,6),(18,6),(1,7),(2,7),(3,7),(12,7),(13,7),(17,7),(18,7),(2,8),(4,8),(6,8),(7,8),(8,8),(9,8),(16,8),(18,8);
/*!40000 ALTER TABLE `menu_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menus`
--

DROP TABLE IF EXISTS `menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` varchar(9) COLLATE utf8mb4_general_ci NOT NULL,
  `price` bigint NOT NULL,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `FK_menus_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_menus_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menus`
--

LOCK TABLES `menus` WRITE;
/*!40000 ALTER TABLE `menus` DISABLE KEYS */;
INSERT INTO `menus` VALUES (1,1,'ACTIVE','Menu Gọi Món','ALA_CARTE',0,NULL),(2,1,'ACTIVE','Buffet Standard','BUFFET',399000,NULL),(3,1,'ACTIVE','Buffet Premium','BUFFET',599000,NULL),(4,1,'ACTIVE','Buffet VIP','BUFFET',799000,NULL),(5,1,'ACTIVE','Buffet quốc khánh 02/09','BUFFET',290000,'Buffet mừng sự kiện ngày quốc khánh của đất nước!'),(6,1,'INACTIVE','Buffet mừng kỷ niệm nhà hàng thành lập 5 năm','BUFFET',500000,'Mừng kỷ niệm nhà hàng thành lập được 5 năm nên gói buffet có giá 500.000 đồng!'),(7,1,'INACTIVE','Buffet ngày 31/08','BUFFET',318000,NULL),(8,1,'ACTIVE','Buffet ngày 05/08','BUFFET',580000,NULL);
/*!40000 ALTER TABLE `menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_details`
--

DROP TABLE IF EXISTS `message_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_details` (
  `is_restaurant_send` bit(1) NOT NULL,
  `message_id` int NOT NULL,
  `send_at` datetime NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`is_restaurant_send`,`message_id`,`send_at`),
  KEY `FK_messageDetails_messages` (`message_id`),
  CONSTRAINT `FK_messageDetails_messages` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_details`
--

LOCK TABLES `message_details` WRITE;
/*!40000 ALTER TABLE `message_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `message_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime NOT NULL,
  `is_read` bit(1) DEFAULT NULL,
  `restaurant_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_messages_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_messages_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_sheet_details`
--

DROP TABLE IF EXISTS `order_sheet_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_sheet_details` (
  `food_id` int NOT NULL,
  `order_sheet_id` int NOT NULL,
  `price` bigint NOT NULL,
  `quantity` bigint NOT NULL,
  `food_name_snapshot` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `food_unit_snapshot` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `food_price_snapshot` bigint NOT NULL,
  `total_price_detail` bigint NOT NULL,
  PRIMARY KEY (`food_id`,`order_sheet_id`),
  KEY `FK_orderSheetDetails_orderSheets` (`order_sheet_id`),
  CONSTRAINT `FK_orderSheetDetails_foods` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`),
  CONSTRAINT `FK_orderSheetDetails_orderSheets` FOREIGN KEY (`order_sheet_id`) REFERENCES `order_sheets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_sheet_details`
--

LOCK TABLES `order_sheet_details` WRITE;
/*!40000 ALTER TABLE `order_sheet_details` DISABLE KEYS */;
INSERT INTO `order_sheet_details` VALUES (1,1,120000,2,'Thịt ba rọi nướng thơm lừng với sả và gia vị đặc trưng.','Phần',120000,240000),(1,2,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,4,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,5,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,6,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,9,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,10,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,13,120000,3,'Ba rọi nướng sả','Phần',120000,360000),(1,14,120000,1000,'Ba rọi nướng sả','Phần',120000,120000000),(1,17,120000,1000,'Ba rọi nướng sả','Phần',120000,120000000),(1,18,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,19,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,20,120000,1000,'Ba rọi nướng sả','Phần',120000,120000000),(1,21,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,22,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,23,120000,1000,'Ba rọi nướng sả','Phần',120000,120000000),(1,24,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,25,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,26,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,27,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,28,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,29,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,30,120000,2100,'Ba rọi nướng sả','Phần',120000,252000000),(1,31,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,32,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,33,120000,1000,'Ba rọi nướng sả','Phần',120000,120000000),(1,34,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(2,2,135000,2,'Bò xào cải thìa','Phần',135000,270000),(2,5,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,6,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,10,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,13,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,16,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,17,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,19,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,20,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,22,135000,2,'Bò xào cải thìa','Phần',135000,270000),(2,23,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,29,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,30,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,32,135000,2,'Bò xào cải thìa','Phần',135000,270000),(2,33,135000,1,'Bò xào cải thìa','Phần',135000,135000),(3,2,95000,4,'Gỏi tôm thịt','Phần',95000,190000),(3,3,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,4,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,6,95000,4,'Gỏi tôm thịt','Phần',95000,380000),(3,7,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,10,95000,3,'Gỏi tôm thịt','Phần',95000,285000),(3,11,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,15,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,16,95000,2,'Gỏi tôm thịt','Phần',95000,190000),(3,22,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,29,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(4,2,100000,3,'Mì xào bò phô mai','Phần',100000,100000),(4,3,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,4,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,5,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,7,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,8,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,10,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,11,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,13,100000,4,'Mì xào bò phô mai','Phần',100000,400000),(4,15,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,16,100000,2,'Mì xào bò phô mai','Phần',100000,200000),(4,19,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,22,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,29,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,32,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(5,3,75000,1,'Đậu hũ kho nấm','Phần',75000,75000),(5,6,75000,4,'Đậu hũ kho nấm','Phần',75000,300000),(5,11,75000,1,'Đậu hũ kho nấm','Phần',75000,75000),(5,13,75000,1,'Đậu hũ kho nấm','Phần',75000,75000),(5,15,75000,3,'Đậu hũ kho nấm','Phần',75000,225000),(5,22,75000,2,'Đậu hũ kho nấm','Phần',75000,150000),(6,3,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,4,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,6,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,7,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,8,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,10,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,11,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,15,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,19,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,22,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(7,10,70000,1,'Súp gà nấm','Tô',70000,70000),(7,12,70000,1,'Súp gà nấm','Tô',70000,70000),(7,13,70000,1,'Súp gà nấm','Tô',70000,70000),(7,16,70000,1,'Súp gà nấm','Tô',70000,70000),(7,19,70000,1,'Súp gà nấm','Tô',70000,70000),(7,32,70000,3,'Súp gà nấm','Tô',70000,210000),(8,12,95000,1,'Gà chiên bơ','Phần',95000,95000),(8,13,95000,1,'Gà chiên bơ','Phần',95000,95000),(8,16,95000,1,'Gà chiên bơ','Phần',95000,95000),(8,32,95000,2,'Gà chiên bơ','Phần',95000,190000),(9,7,110000,1,'Mực xào cay','Phần',110000,110000),(9,12,110000,1,'Mực xào cay','Phần',110000,110000),(9,13,110000,1,'Mực xào cay','Phần',110000,110000),(9,16,110000,1,'Mực xào cay','Phần',110000,110000),(9,19,110000,1,'Mực xào cay','Phần',110000,110000),(9,22,110000,1,'Mực xào cay','Phần',110000,110000),(9,29,110000,1,'Mực xào cay','Phần',110000,110000),(10,3,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,7,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,12,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,13,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,16,65000,4,'Canh rong biển trứng','Tô',65000,260000),(10,19,65000,2,'Canh rong biển trứng','Tô',65000,130000),(10,22,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,29,65000,3,'Canh rong biển trứng','Tô',65000,195000),(11,16,120000,1,'Bún thịt nướng','Tô',120000,120000),(11,22,120000,1,'Bún thịt nướng','Tô',120000,120000),(11,29,120000,1,'Bún thịt nướng','Tô',120000,120000),(12,2,45000,3,'Khoai tây chiên','Phần',45000,45000),(12,3,45000,1,'Khoai tây chiên','Phần',45000,45000),(12,22,45000,2,'Khoai tây chiên','Phần',45000,90000),(12,29,45000,1,'Khoai tây chiên','Phần',45000,45000),(13,2,85000,2,'Mì xào chay rau củ','Phần',85000,170000),(13,8,85000,1,'Mì xào chay rau củ','Phần',85000,85000),(13,13,85000,1,'Mì xào chay rau củ','Phần',85000,85000),(13,19,85000,2,'Mì xào chay rau củ','Phần',85000,170000),(14,2,70000,3,'Gỏi cuốn đậu hũ','Phần',70000,210000),(14,8,70000,1,'Gỏi cuốn đậu hũ','Phần',70000,70000),(14,13,70000,4,'Gỏi cuốn đậu hũ','Phần',70000,280000),(15,6,40000,3,'Bánh mì ốp la','Ổ',40000,120000),(16,6,280000,1,'Lẩu hải sản chua cay','Nồi',280000,280000),(16,10,280000,1,'Lẩu hải sản chua cay','Nồi',280000,280000),(16,19,280000,1,'Lẩu hải sản chua cay','Nồi',280000,280000);
/*!40000 ALTER TABLE `order_sheet_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_sheets`
--

DROP TABLE IF EXISTS `order_sheets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_sheets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime NOT NULL,
  `employee_id` int DEFAULT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `service_at` datetime DEFAULT NULL,
  `status` varchar(9) COLLATE utf8mb4_general_ci NOT NULL,
  `use_table_id` bigint NOT NULL,
  `total_price` bigint DEFAULT NULL,
  `cancel_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orderSheets_restaurants` (`restaurant_id`),
  KEY `FK_orderSheets_employees` (`employee_id`),
  KEY `FK_orderSheets_useTables` (`use_table_id`),
  CONSTRAINT `FK_orderSheets_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_orderSheets_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_orderSheets_useTables` FOREIGN KEY (`use_table_id`) REFERENCES `use_tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_sheets`
--

LOCK TABLES `order_sheets` WRITE;
/*!40000 ALTER TABLE `order_sheets` DISABLE KEYS */;
INSERT INTO `order_sheets` VALUES (1,'2026-01-11 00:00:00',NULL,NULL,NULL,1,NULL,'PENDING',1,240000,NULL),(2,'2026-08-01 23:23:07',1,NULL,'Làm món nhanh giúp tôi!',1,'2026-08-01 23:25:01','SERVICED',31,1105000,NULL),(3,'2026-08-01 23:23:17',1,NULL,'',1,'2026-08-01 23:25:06','SERVICED',31,630000,NULL),(4,'2026-08-01 23:23:26',NULL,NULL,'',1,NULL,'CANCELLED',31,565000,'2026-08-01 23:25:16'),(5,'2026-08-01 23:33:04',NULL,NULL,'',1,NULL,'CANCELLED',31,355000,'2026-08-01 23:33:54'),(6,'2026-08-02 00:51:13',1,'Thiếu nguyên liệu để nấu Đậu hũ kho nấm, mong khách hàng chọn món khác, nhà hàng cảm ơn!','lên món nhanh dùm!!!',1,NULL,'CANCELLED',33,1585000,'2026-08-02 00:52:31'),(7,'2026-08-02 00:51:22',1,NULL,'',1,'2026-08-02 00:52:46','SERVICED',33,620000,NULL),(8,'2026-08-02 00:57:37',1,NULL,'',1,NULL,'CANCELLED',33,505000,'2026-08-02 00:57:47'),(9,'2026-08-02 05:43:01',1,NULL,'',1,'2026-08-02 05:43:11','SERVICED',35,120000,NULL),(10,'2026-08-02 12:10:23',1,'Không đủ nguyên liệu, xin lỗi quý khách!','làm món ăn nhanh giúp tôi!',1,NULL,'CANCELLED',37,1240000,'2026-08-02 12:11:52'),(11,'2026-08-02 12:10:32',1,'Không đủ nguyên liệu cho món Đậu hủ kho nấm!','',1,NULL,'CANCELLED',37,520000,'2026-08-02 12:12:25'),(12,'2026-08-02 12:12:40',1,NULL,'',1,NULL,'CANCELLED',37,340000,'2026-08-02 12:13:38'),(13,'2026-08-02 12:23:29',1,'nhà hàng đã nghe!','làm món nhanh giúp tôi nha!',1,'2026-08-02 12:24:30','SERVICED',39,1675000,NULL),(14,'2026-08-02 12:23:42',1,'Không đủ nguyên liệu để làm món ăn này!','',1,NULL,'CANCELLED',39,120000000,'2026-08-02 12:24:58'),(15,'2026-08-02 12:23:53',NULL,NULL,'',1,NULL,'CANCELLED',39,670000,'2026-08-02 12:25:04'),(16,'2026-08-02 12:43:17',1,NULL,'làm món nhanh giúp tôi',1,NULL,'CANCELLED',41,1180000,'2026-08-02 12:44:35'),(17,'2026-08-02 12:43:33',1,NULL,'',1,NULL,'CANCELLED',41,120135000,'2026-08-02 12:44:38'),(18,'2026-08-02 12:43:39',1,NULL,'',1,NULL,'CANCELLED',41,120000,'2026-08-02 12:44:40'),(19,'2026-08-02 12:50:56',1,'các món ăn đã phục vụ cho gia đình mình ạ!','nhà hàng làm món nhanh giúp tôi!',1,'2026-08-02 12:52:28','SERVICED',43,1365000,NULL),(20,'2026-08-02 12:51:12',1,'Không đủ nguyên liệu để làm món Ba rọi nướng sả, mong gia đình có thể chọn món ăn khác giúp nhà hàng, nhà hàng cảm ơn!','',1,NULL,'CANCELLED',43,120135000,'2026-08-02 12:53:15'),(21,'2026-08-02 12:51:22',NULL,NULL,'',1,NULL,'CANCELLED',43,120000,'2026-08-02 12:53:20'),(22,'2026-08-02 12:56:14',1,'nhà hàng sẽ phục vụ món nhanh chóng cho gia đình mình ạ!','nhà hàng làm món ăn nhanh giúp gia đình!',1,'2026-08-02 12:57:22','SERVICED',45,1370000,NULL),(23,'2026-08-02 12:56:28',1,'Xin lỗi gia đình mình vì nhà hàng không đủ nguyên liệu để làm món Ba rọi nướng sả ạ!','',1,NULL,'CANCELLED',45,120135000,'2026-08-02 12:58:02'),(24,'2026-08-02 12:56:34',NULL,NULL,'',1,NULL,'CANCELLED',45,120000,'2026-08-02 12:58:07'),(25,'2026-08-02 12:59:59',NULL,NULL,'',1,NULL,'CANCELLED',45,120000,'2026-08-02 13:02:07'),(26,'2026-08-02 13:00:34',NULL,NULL,'',1,NULL,'CANCELLED',45,120000,'2026-08-02 13:02:34'),(27,'2026-08-02 13:00:46',NULL,NULL,'',1,NULL,'CANCELLED',45,120000,'2026-08-02 13:01:54'),(28,'2026-08-02 13:00:56',NULL,NULL,'',1,NULL,'CANCELLED',45,120000,'2026-08-02 13:01:05'),(29,'2026-08-02 13:07:39',1,'các món ăn đã được làm xong và sẽ đưa lên bàn gia đình mình ngay!','nhà hàng làm món nhanh giúp gia đình mình ạ!',1,'2026-08-02 13:09:59','SERVICED',47,920000,NULL),(30,'2026-08-02 13:07:53',1,'Nhà hàng xin lỗi gia đình mình vì không đủ nguyên liệu để làm món Ba rọi nướng sả','',1,NULL,'CANCELLED',47,252135000,'2026-08-02 13:10:33'),(31,'2026-08-02 13:07:59',NULL,NULL,'',1,NULL,'CANCELLED',47,120000,'2026-08-02 13:10:39'),(32,'2026-08-02 13:33:41',1,'nhà hàng đã làm xong các món ăn và sẽ đưa lên bàn ăn của gia đình mình ngay ạ!','nhà hàng làm món nhanh giúp gia đình mình!',1,'2026-08-02 13:36:10','SERVICED',49,890000,NULL),(33,'2026-08-02 13:33:53',1,'nhà hàng xin lỗi gia đình mình vì không đủ nguyên liệu để làm món Ba rọi nướng sả với số lượng lớn!','',1,NULL,'CANCELLED',49,120135000,'2026-08-02 13:36:52'),(34,'2026-08-02 13:33:59',NULL,NULL,'',1,NULL,'CANCELLED',49,120000,'2026-08-02 13:36:57');
/*!40000 ALTER TABLE `order_sheets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_machine_foods`
--

DROP TABLE IF EXISTS `payment_machine_foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_machine_foods` (
  `food_id` int NOT NULL,
  `payment_machine_id` int NOT NULL,
  `price` bigint NOT NULL,
  `quantity` bigint NOT NULL,
  `food_name_snapshot` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `food_unit_snapshot` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `food_price_snapshot` bigint NOT NULL,
  `total_price_detail` bigint NOT NULL,
  PRIMARY KEY (`food_id`,`payment_machine_id`),
  KEY `FK_paymentMachineFoods_paymentMachines` (`payment_machine_id`),
  CONSTRAINT `FK_paymentMachineFoods_foods` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`),
  CONSTRAINT `FK_paymentMachineFoods_paymentMachines` FOREIGN KEY (`payment_machine_id`) REFERENCES `payment_machines` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_machine_foods`
--

LOCK TABLES `payment_machine_foods` WRITE;
/*!40000 ALTER TABLE `payment_machine_foods` DISABLE KEYS */;
INSERT INTO `payment_machine_foods` VALUES (1,1,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,3,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,5,120000,3,'Ba rọi nướng sả','Phần',120000,360000),(1,7,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,8,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,9,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(1,10,120000,1,'Ba rọi nướng sả','Phần',120000,120000),(2,1,135000,2,'Bò xào cải thìa','Phần',135000,270000),(2,5,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,7,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,8,135000,2,'Bò xào cải thìa','Phần',135000,270000),(2,9,135000,1,'Bò xào cải thìa','Phần',135000,135000),(2,10,135000,2,'Bò xào cải thìa','Phần',135000,270000),(3,1,95000,4,'Gỏi tôm thịt','Phần',95000,190000),(3,2,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,8,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(3,9,95000,1,'Gỏi tôm thịt','Phần',95000,95000),(4,1,100000,3,'Mì xào bò phô mai','Phần',100000,100000),(4,2,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,5,100000,4,'Mì xào bò phô mai','Phần',100000,400000),(4,7,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,8,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,9,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(4,10,100000,1,'Mì xào bò phô mai','Phần',100000,100000),(5,1,75000,1,'Đậu hũ kho nấm','Phần',75000,75000),(5,5,75000,1,'Đậu hũ kho nấm','Phần',75000,75000),(5,8,75000,2,'Đậu hũ kho nấm','Phần',75000,150000),(6,1,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,2,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,7,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(6,8,250000,1,'Lẩu dê lá chanh','Nồi',250000,250000),(7,5,70000,1,'Súp gà nấm','Tô',70000,70000),(7,7,70000,1,'Súp gà nấm','Tô',70000,70000),(7,10,70000,3,'Súp gà nấm','Tô',70000,210000),(8,5,95000,1,'Gà chiên bơ','Phần',95000,95000),(8,10,95000,2,'Gà chiên bơ','Phần',95000,190000),(9,2,110000,1,'Mực xào cay','Phần',110000,110000),(9,5,110000,1,'Mực xào cay','Phần',110000,110000),(9,7,110000,1,'Mực xào cay','Phần',110000,110000),(9,8,110000,1,'Mực xào cay','Phần',110000,110000),(9,9,110000,1,'Mực xào cay','Phần',110000,110000),(10,1,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,2,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,5,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,7,65000,2,'Canh rong biển trứng','Tô',65000,130000),(10,8,65000,1,'Canh rong biển trứng','Tô',65000,65000),(10,9,65000,3,'Canh rong biển trứng','Tô',65000,195000),(11,8,120000,1,'Bún thịt nướng','Tô',120000,120000),(11,9,120000,1,'Bún thịt nướng','Tô',120000,120000),(12,1,45000,3,'Khoai tây chiên','Phần',45000,45000),(12,8,45000,2,'Khoai tây chiên','Phần',45000,90000),(12,9,45000,1,'Khoai tây chiên','Phần',45000,45000),(13,1,85000,2,'Mì xào chay rau củ','Phần',85000,170000),(13,5,85000,1,'Mì xào chay rau củ','Phần',85000,85000),(13,7,85000,2,'Mì xào chay rau củ','Phần',85000,170000),(14,1,70000,3,'Gỏi cuốn đậu hũ','Phần',70000,210000),(14,5,70000,4,'Gỏi cuốn đậu hũ','Phần',70000,280000),(16,7,280000,1,'Lẩu hải sản chua cay','Nồi',280000,280000);
/*!40000 ALTER TABLE `payment_machine_foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_machines`
--

DROP TABLE IF EXISTS `payment_machines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_machines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `restaurant_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `payment_method_id` int DEFAULT NULL,
  `at` datetime NOT NULL,
  `food_price` bigint DEFAULT NULL,
  `category_table_surcharge` bigint DEFAULT NULL,
  `customer_discount` bigint DEFAULT NULL,
  `total_price` bigint DEFAULT NULL,
  `payment_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_total_price` bigint DEFAULT NULL,
  `process_status` varchar(9) COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_paymentMachines_restaurants` (`restaurant_id`),
  KEY `FK_paymentMachines_employees` (`employee_id`),
  KEY `FK_paymentMachines_paymentMethods` (`payment_method_id`),
  CONSTRAINT `FK_paymentMachines_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_paymentMachines_paymentMethods` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  CONSTRAINT `FK_paymentMachines_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_machines`
--

LOCK TABLES `payment_machines` WRITE;
/*!40000 ALTER TABLE `payment_machines` DISABLE KEYS */;
INSERT INTO `payment_machines` VALUES (1,1,1,1,'2026-08-01 23:34:43',1495000,0,0,1495000,'TM-1785606063298',1495000,'COMPLETED','COMPLETED'),(2,1,1,5,'2026-08-02 00:58:06',620000,0,0,620000,'260802_128518',620000,'COMPLETED','COMPLETED'),(3,1,1,5,'2026-08-02 05:43:17',120000,0,0,120000,'260802_192133',120000,'COMPLETED','COMPLETED'),(4,1,1,1,'2026-08-02 12:13:44',0,0,0,0,'TM-1785647644456',0,'COMPLETED','COMPLETED'),(5,1,1,4,'2026-08-02 12:31:09',1675000,0,0,1675000,'260802_603747',1675000,'COMPLETED','COMPLETED'),(6,1,1,1,'2026-08-02 12:44:46',0,0,0,0,'TM-1785649499450',0,'COMPLETED','COMPLETED'),(7,1,1,1,'2026-08-02 12:53:52',1365000,0,0,1365000,'TM-1785650068010',1365000,'COMPLETED','COMPLETED'),(8,1,1,1,'2026-08-02 13:04:14',1370000,0,0,1370000,'TM-1785650674795',1370000,'COMPLETED','COMPLETED'),(9,1,1,5,'2026-08-02 13:15:00',920000,0,0,920000,'260802_537042',920000,'COMPLETED','COMPLETED'),(10,1,1,5,'2026-08-02 13:40:03',890000,0,0,890000,'260802_748915',890000,'COMPLETED','COMPLETED');
/*!40000 ALTER TABLE `payment_machines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'money-image.png','Thanh toán bằng tiền mặt'),(2,'atm-logo.png','Thanh toán bằng ngân hàng'),(3,'visa-master-jcb-logo.png','Thanh toán bằng Visa/Master/JCB'),(4,'momo-logo.png','Thanh toán ví MoMo'),(5,'zalopay-logo.png','Thanh toán ví ZaloPay'),(6,'vnpay-logo.png','Thanh toán bằng ví VNPay');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_details`
--

DROP TABLE IF EXISTS `permission_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_details` (
  `action` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `function_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`action`,`function_id`,`permission_id`),
  KEY `FK_permissionDetails_permissions` (`permission_id`),
  KEY `FK_permissionDetails_functions` (`function_id`),
  CONSTRAINT `FK_permissionDetails_functions` FOREIGN KEY (`function_id`) REFERENCES `functions` (`id`),
  CONSTRAINT `FK_permissionDetails_permissions` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_details`
--

LOCK TABLES `permission_details` WRITE;
/*!40000 ALTER TABLE `permission_details` DISABLE KEYS */;
INSERT INTO `permission_details` VALUES ('Cập nhật',6,1),('Cập nhật',7,1),('Cập nhật',8,1),('Cập nhật',9,1),('Cập nhật',11,1),('Cập nhật',12,1),('Cập nhật',13,1),('Cập nhật',14,1),('Cập nhật',15,1),('Cập nhật',16,1),('Cập nhật',17,1),('Cập nhật',18,1),('Cập nhật',19,1),('Cập nhật',20,1),('Cập nhật',21,1),('Cập nhật',22,1),('Cập nhật',23,1),('Cập nhật',24,1),('Khóa',8,1),('Khóa',13,1),('Khóa',14,1),('Khóa',15,1),('Khóa',17,1),('Khóa',18,1),('Khóa',19,1),('Khóa',20,1),('Khóa',21,1),('Khóa',22,1),('Khóa',23,1),('Khóa',24,1),('Thêm',8,1),('Thêm',10,1),('Thêm',11,1),('Thêm',12,1),('Thêm',13,1),('Thêm',14,1),('Thêm',15,1),('Thêm',16,1),('Thêm',17,1),('Thêm',18,1),('Thêm',19,1),('Thêm',20,1),('Thêm',21,1),('Thêm',22,1),('Thêm',23,1),('Thêm',24,1),('Xem',1,1),('Xem',2,1),('Xem',3,1),('Xem',4,1),('Xem',5,1),('Xem',6,1),('Xem',7,1),('Xem',8,1),('Xem',9,1),('Xem',10,1),('Xem',11,1),('Xem',12,1),('Xem',13,1),('Xem',14,1),('Xem',15,1),('Xem',16,1),('Xem',17,1),('Xem',18,1),('Xem',19,1),('Xem',20,1),('Xem',21,1),('Xem',22,1),('Xem',23,1),('Xem',24,1),('Cập nhật',6,2),('Cập nhật',7,2),('Cập nhật',8,2),('Cập nhật',9,2),('Cập nhật',11,2),('Cập nhật',12,2),('Khóa',8,2),('Thêm',8,2),('Thêm',10,2),('Thêm',11,2),('Thêm',12,2),('Xem',2,2),('Xem',4,2),('Xem',5,2),('Xem',6,2),('Xem',7,2),('Xem',8,2),('Xem',9,2),('Xem',10,2),('Xem',11,2),('Xem',12,2),('Cập nhật',13,3),('Cập nhật',14,3),('Cập nhật',15,3),('Khóa',13,3),('Khóa',14,3),('Khóa',15,3),('Thêm',13,3),('Thêm',14,3),('Thêm',15,3),('Xem',13,3),('Xem',14,3),('Xem',15,3),('Cập nhật',16,4),('Cập nhật',17,4),('Cập nhật',18,4),('Cập nhật',19,4),('Cập nhật',20,4),('Cập nhật',21,4),('Khóa',17,4),('Khóa',18,4),('Khóa',19,4),('Khóa',20,4),('Khóa',21,4),('Thêm',16,4),('Thêm',17,4),('Thêm',18,4),('Thêm',19,4),('Thêm',20,4),('Thêm',21,4),('Xem',3,4),('Xem',16,4),('Xem',17,4),('Xem',18,4),('Xem',19,4),('Xem',20,4),('Xem',21,4),('Cập nhật',22,5),('Cập nhật',23,5),('Cập nhật',24,5),('Khóa',22,5),('Khóa',23,5),('Khóa',24,5),('Thêm',22,5),('Thêm',23,5),('Thêm',24,5),('Xem',22,5),('Xem',23,5),('Xem',24,5);
/*!40000 ALTER TABLE `permission_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_permissions_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_permissions_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'Quản lý',1,'ACTIVE'),(2,'Quản lý vận hàng',1,'ACTIVE'),(3,'Quản lý chỗ ngồi',1,'ACTIVE'),(4,'Quản lý kho hàng',1,'ACTIVE'),(5,'Quản lý nhân sự',1,'ACTIVE'),(6,'Nhân viên phục vụ',1,'ACTIVE'),(7,'Nhân viên thực tập',1,'ACTIVE');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `food_id` int NOT NULL,
  `ingredient_id` int NOT NULL,
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  PRIMARY KEY (`food_id`,`ingredient_id`),
  KEY `FK_recipes_ingredients` (`ingredient_id`),
  CONSTRAINT `FK_recipes_foods` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`),
  CONSTRAINT `FK_recipes_ingredients` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,1,'1kg thịt ba rọi',1),(1,17,'500ml nước mắm',1),(1,19,'1000ml dầu ăn',1),(1,28,'1 cây sả',1),(1,29,'100g gừng',1),(2,2,'1kg thịt bò thăn',1),(2,11,'1kg cải thìa',1),(2,17,'500ml nước mắm',1),(2,18,'450ml dầu hào',1),(2,19,'1000ml dầu ăn',1),(3,1,'1kg thịt ba rọi',1),(3,6,'1kg tôm sú',1),(3,13,'1kg cà rốt',1),(3,16,'1000g đường',1),(3,17,'500ml nước mắm',1),(4,2,'1kg bò thăn',1),(4,19,'1 lít dầu ăn',1),(4,24,'300g mì trứng',1),(4,30,'2 miếng phô mai',2),(5,15,'500g muối hột',1),(5,17,'500ml nước mắm',1),(5,21,'2 miếng đậu hũ',2),(5,22,'150g nấm kim châm',1),(5,29,'100g gừng',1),(6,3,'1kg thịt dê',1),(6,12,'1kg rau muống',1),(6,27,'50g lá chanh',1),(6,28,'2 cây sả',2),(6,29,'100g gừng',1),(7,4,'1kg ức gà',1),(7,13,'1kg cà rốt',1),(7,15,'500g muối',1),(7,19,'1 lít dầu ăn',1),(7,22,'150g nấm kim châm',1),(8,4,'1kg ức gà phi lê',1),(8,15,'500g muối hột để ướp nhẹ',1),(8,19,'1 lít dầu ăn để chiên',1),(8,20,'200g bơ thực vật',1),(9,7,'1kg mực ống',1),(9,17,'500ml nước mắm',1),(9,19,'1 lít dầu ăn',1),(9,28,'1 cây sả băm nhỏ',1),(9,29,'100g gừng lát',1),(10,9,'2 quả trứng gà ta',2),(10,13,'1kg cà rốt',1),(10,15,'500g muối hột',1),(10,26,'100g rong biển khô',1),(11,1,'1kg thịt ba rọi nướng',1),(11,13,'1kg cà rốt ngâm chua',1),(11,17,'500ml nước mắm pha',1),(11,23,'500g bún tươi',1),(11,27,'50g lá chanh trang trí',1),(12,14,'1kg khoai tây',1),(12,15,'500g muối hột',1),(12,19,'1 lít dầu ăn',1),(13,11,'1kg cải thìa',1),(13,13,'1kg cà rốt',1),(13,19,'1 lít dầu ăn',1),(13,22,'150g nấm kim châm',1),(13,24,'300g mì trứng',1),(14,13,'1kg cà rốt bào sợi',1),(14,17,'500ml nước mắm chay pha loãng',1),(14,21,'2 miếng đậu hũ chiên',2),(14,23,'500g bún tươi',1),(15,9,'2 quả trứng gà ốp la',2),(15,20,'200g bơ thực vật',1),(16,6,'1kg tôm sú',1),(16,7,'1kg mực ống',1),(16,8,'1kg cá basa phi lê',1),(16,12,'1kg rau muống',1),(16,28,'2 cây sả đập dập',2),(16,29,'100g gừng',1),(17,2,'1kg thịt bò thăn',1),(17,15,'500g muối hột',1),(17,17,'500ml nước mắm',1),(17,25,'200g miến dong khô dùng thay bánh phở',1),(17,29,'100g gừng nướng để làm nước dùng',1),(18,6,'Tôm tươi',2),(18,7,'Mực tươi',1);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `arrive_at` datetime NOT NULL,
  `create_at` datetime NOT NULL,
  `customer_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `customer_fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `customer_id` int NOT NULL,
  `customer_note` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `customer_phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `employee_id` int DEFAULT NULL,
  `customer_guests` int NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(9) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_reservations_restaurants` (`restaurant_id`),
  KEY `FK_reservations_employees` (`employee_id`),
  KEY `FK_reservations_customers` (`customer_id`),
  CONSTRAINT `FK_reservations_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK_reservations_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_reservations_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,'2025-12-10 12:00:00','2025-12-06 00:00:00','1@gmail.com','1',1,NULL,'1111111111',NULL,4,1,'PENDING'),(2,'2025-12-12 12:00:00','2025-12-06 00:00:00','2@gmail.com','2',1,NULL,'2222222222',1,2,1,'CONFIRMED'),(3,'2025-12-15 12:00:00','2025-12-06 00:00:00','3@gmail.com','3',1,NULL,'3333333333',1,1,1,'CANCELLED');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_images`
--

DROP TABLE IF EXISTS `restaurant_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_images` (
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  PRIMARY KEY (`image`,`restaurant_id`),
  KEY `FK_restaurantImages_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_restaurantImages_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_images`
--

LOCK TABLES `restaurant_images` WRITE;
/*!40000 ALTER TABLE `restaurant_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `restaurant_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurants`
--

DROP TABLE IF EXISTS `restaurants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `house_number` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `street_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ward` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `province` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `manager_id` int NOT NULL,
  `open_at` time NOT NULL,
  `close_at` time NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_restaurants_email` (`email`),
  UNIQUE KEY `UK_restaurants_phone` (`phone`),
  KEY `FK_restaurants_managers` (`manager_id`),
  CONSTRAINT `FK_restaurants_managers` FOREIGN KEY (`manager_id`) REFERENCES `managers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,'Nhà hàng Thanh Quy','0000000000','thanhquy@gmail.com',10.776889,106.700897,'123','Nguyễn Huệ','Bến Nghé','TP.HCM',NULL,'ACTIVE',2,'07:00:00','20:00:00'),(2,'Nhà hàng Phước Long','0000000001','phuoclong@gmail.com',10.823099,106.629664,'456','Lê Văn Việt','Hiệp Phú','TP.HCM',NULL,'ACTIVE',2,'10:00:00','20:00:00');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_histories`
--

DROP TABLE IF EXISTS `role_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_histories` (
  `date_start` date NOT NULL,
  `employee_id` int NOT NULL,
  `role_id` int NOT NULL,
  `date_end` date DEFAULT NULL,
  PRIMARY KEY (`date_start`,`employee_id`,`role_id`),
  KEY `FK_roleHistories_employees` (`employee_id`),
  KEY `FK_roleHistories_roles` (`role_id`),
  CONSTRAINT `FK_roleHistories_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_roleHistories_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_histories`
--

LOCK TABLES `role_histories` WRITE;
/*!40000 ALTER TABLE `role_histories` DISABLE KEYS */;
INSERT INTO `role_histories` VALUES ('2025-04-01',2,6,'2025-07-09'),('2025-04-01',4,6,'2025-07-09'),('2025-05-01',3,6,'2025-07-09'),('2025-07-10',2,2,NULL),('2025-07-10',3,3,NULL),('2025-07-10',4,4,NULL),('2025-07-10',5,5,NULL),('2026-02-01',1,7,'2026-02-10'),('2026-02-11',1,6,'2026-02-20'),('2026-02-21',1,1,NULL);
/*!40000 ALTER TABLE `role_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `salary_type` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `salary_value` bigint NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_roles_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_roles_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Quản lý',1,'FIXED',20000000,'ACTIVE'),(2,'Quản lý vận hàng',1,'FIXED',10000000,'ACTIVE'),(3,'Quản lý chỗ ngồi',1,'FIXED',9000000,'ACTIVE'),(4,'Quản lý kho hàng',1,'FIXED',9200000,'ACTIVE'),(5,'Quản lý nhân sự',1,'FIXED',9500000,'ACTIVE'),(6,'Nhân viên phục vụ',1,'FIXED',7000000,'ACTIVE'),(7,'Nhân viên thực tập',1,'HOUR',22000,'ACTIVE');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `house_number` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `street_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `ward` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `province` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'contact@thucphamsachviet.vn','Công ty TNHH Thực Phẩm Sạch Việt','0909123456',1,'ACTIVE','123','Nguyễn Trãi','Phường 5','TP.HCM'),(2,'info@rauquamn.vn','Công ty Cổ phần Rau Quả Miền Bắc','0912345678',1,'ACTIVE','45','Lê Văn Lương','Phường Nhân Chính','Hà Nội'),(3,'support@antamfoods.vn','Công ty TNHH Nông Sản An Tâm','0988765432',1,'ACTIVE','88','Trường Chinh','Phường Phương Mai','Hà Nội'),(4,'sales@biendongseafood.vn','Công ty TNHH Thủy Hải Sản Biển Đông','0933555777',1,'ACTIVE','12','Võ Văn Kiệt','Phường Nguyễn Thái Bình','TP.HCM'),(5,'dongxanhorganic@gmail.com','HTX Nông nghiệp Hữu cơ Đồng Xanh','0944666888',1,'ACTIVE','Ấp 3','Tân Phú Trung','Xã Tân Phú Trung','TP.HCM'),(6,'gaosach@ankhang.vn','Công ty TNHH Gạo Sạch An Khang','0977111222',1,'ACTIVE','10','Tỉnh Lộ 10','Phường Tân Tạo','TP.HCM'),(7,'fruit.south@traicaynb.vn','Công ty TNHH Trái Cây Nam Bộ','0909888777',1,'ACTIVE','5','QL1A','Phường 10','Tiền Giang'),(8,'daxanh.rau@gmail.com','HTX Rau Sạch Đà Lạt Xanh','0966333444',1,'ACTIVE','Thôn Trạm Hành','Trạm Hành','Xã Trạm Hành','Lâm Đồng'),(9,'phuquocfishsauce@gmail.com','Công ty TNHH Nước Mắm Phú Quốc','0933222111',1,'ACTIVE','Tổ 1','Dương Đông','Phường Dương Đông','Kiên Giang'),(10,'matongtaybac@gmail.com','Công ty TNHH Mật Ong Rừng Tây Bắc','0988999000',1,'ACTIVE','Bản Hua Tát','Chiềng Hắc','Xã Chiềng Hắc','Sơn La'),(11,'coldfood@hanoi.vn','Công ty TNHH Thực Phẩm Đông Lạnh Hà Nội','0922333444',1,'INACTIVE','Km10','Quốc lộ 32','Phường Phúc Diễn','Hà Nội'),(12,'pending@supplier.com','Công ty Cổ phần Thực phẩm đóng hộp','0955111222',1,'INACTIVE','9','Nguyễn Hữu Thọ','Phường Khuê Trung','Đà Nẵng'),(13,'botmi@binhan.vn','Công ty TNHH Bột Mì Bình An','0909777666',1,'ACTIVE','KCN Tân Tạo','Tân Tạo','Phường Tân Tạo A','TP.HCM'),(14,'trungga@hoabinh.vn','HTX Trứng Gà Sạch Hòa Bình','0912666111',1,'ACTIVE','Xã Dân Chủ','Dân Chủ','Xã Dân Chủ','Hòa Bình'),(15,'dau.an@thucvatviet.vn','Công ty TNHH Dầu Ăn Thực Vật Việt','0922111000',1,'ACTIVE','7','Đường số 7','Phường Dĩ An','Bình Dương'),(16,'mekongorganic@gmail.com','Công ty TNHH Thực Phẩm Hữu Cơ Mekong','0933444555',1,'ACTIVE','QL91','QL91','Phường Mỹ Thới','An Giang'),(17,'muoi@bienviet.vn','Công ty TNHH Muối Biển Việt','0944222333',1,'ACTIVE','Xã Cồn Vạn','Cồn Vạn','Xã Cồn Vạn','Nam Định'),(18,'dauphu@hanoisoy.vn','HTX Đậu Phụ Sạch Hà Nội','0977333444',1,'ACTIVE','Thôn Yên Mỹ','Tam Hiệp','Xã Tam Hiệp','Hà Nội'),(19,'nongsan@taynguyen.vn','Công ty Cổ phần Nông Sản Tây Nguyên','0988111777',1,'ACTIVE','Tân Lợi','Tân Lợi','Phường Tân Lợi','Đắk Lắk'),(20,'hanhtim@vinhchau.vn','HTX Hành Tím Vĩnh Châu','0966444777',1,'ACTIVE','Vĩnh Hải','Vĩnh Hải','Xã Vĩnh Hải','Sóc Trăng');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tables`
--

DROP TABLE IF EXISTS `tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_table_id` int NOT NULL,
  `description` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `floor_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `seats` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tables_restaurants` (`restaurant_id`),
  KEY `FK_foods_floors` (`floor_id`),
  KEY `FK_foods_categoryTables` (`category_table_id`),
  CONSTRAINT `FK_foods_categoryTables` FOREIGN KEY (`category_table_id`) REFERENCES `category_tables` (`id`),
  CONSTRAINT `FK_foods_floors` FOREIGN KEY (`floor_id`) REFERENCES `floors` (`id`),
  CONSTRAINT `FK_tables_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tables`
--

LOCK TABLES `tables` WRITE;
/*!40000 ALTER TABLE `tables` DISABLE KEYS */;
INSERT INTO `tables` VALUES (1,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-01',1,4,'ACTIVE'),(2,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-02',1,4,'ACTIVE'),(3,2,'Bàn gần cửa sổ tầng 1',2,'Bàn T2-03',1,4,'ACTIVE'),(4,2,'Bàn gần cửa sổ tầng 1',2,'Bàn T2-04',1,6,'ACTIVE'),(5,1,'Bàn nhỏ tầng 1',2,'Bàn T2-05',1,2,'ACTIVE'),(6,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-06',1,4,'ACTIVE'),(7,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-07',1,4,'ACTIVE'),(8,2,'Bàn gần cửa sổ tầng 1',2,'Bàn T2-08',1,4,'ACTIVE'),(9,1,'Bàn lớn tầng 1',2,'Bàn T2-09',1,6,'ACTIVE'),(10,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-10',1,4,'ACTIVE'),(11,3,'Bàn VIP tầng 2',3,'Bàn T3-01',1,4,'ACTIVE'),(12,3,'Bàn VIP tầng 2',3,'Bàn T3-02',1,6,'ACTIVE'),(13,3,'Bàn VIP tầng 2',3,'Bàn T3-03',1,4,'ACTIVE'),(14,3,'Bàn VIP tầng 2',3,'Bàn T3-04',1,6,'ACTIVE'),(15,3,'Bàn VIP tầng 2',3,'Bàn T3-05',1,4,'ACTIVE'),(16,3,'Bàn VIP tầng 2',3,'Bàn T3-06',1,6,'ACTIVE'),(17,3,'Bàn VIP tầng 2',3,'Bàn T3-07',1,4,'ACTIVE'),(18,3,'Bàn VIP tầng 2',3,'Bàn T3-08',1,6,'ACTIVE'),(19,3,'Bàn VIP tầng 2',3,'Bàn T3-09',1,4,'ACTIVE'),(20,3,'Bàn VIP tầng 2',3,'Bàn T3-10',1,6,'ACTIVE'),(21,4,'Phòng riêng tầng 3',4,'Bàn T4-01',1,6,'ACTIVE'),(22,4,'Phòng riêng tầng 3',4,'Bàn T4-02',1,8,'ACTIVE'),(23,5,'Phòng riêng VIP tầng 3',4,'Bàn T4-03',1,10,'ACTIVE'),(24,4,'Phòng riêng tầng 3',4,'Bàn T4-04',1,6,'ACTIVE'),(25,4,'Phòng riêng tầng 3',4,'Bàn T4-05',1,8,'ACTIVE'),(26,5,'Phòng riêng VIP tầng 3',4,'Bàn T4-06',1,6,'ACTIVE'),(27,4,'Phòng riêng tầng 3',4,'Bàn T4-07',1,8,'ACTIVE'),(28,4,'Phòng riêng lớn tầng 3',4,'Bàn T4-08',1,10,'ACTIVE'),(29,4,'Phòng riêng tầng 3',4,'Bàn T4-09',1,6,'ACTIVE'),(30,4,'Phòng riêng tầng 3',4,'Bàn T4-10',1,8,'ACTIVE');
/*!40000 ALTER TABLE `tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `use_foods`
--

DROP TABLE IF EXISTS `use_foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `use_foods` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `food_id` int NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(13) COLLATE utf8mb4_general_ci NOT NULL,
  `end_at` datetime DEFAULT NULL,
  `start_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_useFoods_restaurants` (`restaurant_id`),
  KEY `FK_useFoods_foods` (`food_id`),
  KEY `FK_useFoods_employees` (`employee_id`),
  CONSTRAINT `FK_useFoods_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_useFoods_foods` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`),
  CONSTRAINT `FK_useFoods_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `use_foods`
--

LOCK TABLES `use_foods` WRITE;
/*!40000 ALTER TABLE `use_foods` DISABLE KEYS */;
INSERT INTO `use_foods` VALUES (1,NULL,1,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(2,NULL,2,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(3,NULL,3,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(4,NULL,4,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(5,NULL,5,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(6,NULL,6,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(7,NULL,7,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(8,NULL,8,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(9,NULL,9,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(10,NULL,10,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(11,NULL,11,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(12,NULL,12,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(13,NULL,13,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(14,NULL,14,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(15,NULL,15,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(16,NULL,16,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00'),(17,NULL,17,1,'CAN_ORDER',NULL,'2025-07-24 00:00:00');
/*!40000 ALTER TABLE `use_foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `use_tables`
--

DROP TABLE IF EXISTS `use_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `use_tables` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `customer_email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customer_fullname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `customer_phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `bill_id` int DEFAULT NULL,
  `reservation_id` int DEFAULT NULL,
  `restaurant_id` int NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `table_id` int NOT NULL,
  `end_at` datetime DEFAULT NULL,
  `start_at` datetime NOT NULL,
  `message_id` int DEFAULT NULL,
  `menu_id` int DEFAULT NULL,
  `payment_machine_id` int DEFAULT NULL,
  `feedback_id` int DEFAULT NULL,
  `customer_adult` int DEFAULT NULL,
  `customer_child` int DEFAULT NULL,
  `customer_guests` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_useTables_restaurants` (`restaurant_id`),
  KEY `FK_useTables_tables` (`table_id`),
  KEY `FK_useTables_employees` (`employee_id`),
  KEY `FK_useTables_customers` (`customer_id`),
  KEY `FK_useTables_bills` (`bill_id`),
  KEY `FK_useTables_reservations` (`reservation_id`),
  KEY `FK_useTables_messages` (`message_id`),
  KEY `FK_useTables_paymentMachines` (`payment_machine_id`),
  KEY `FK_useTables_feedbacks` (`feedback_id`),
  KEY `FK_useTables_menus` (`menu_id`),
  CONSTRAINT `FK_useTables_bills` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`),
  CONSTRAINT `FK_useTables_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK_useTables_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_useTables_feedbacks` FOREIGN KEY (`feedback_id`) REFERENCES `feedbacks` (`id`),
  CONSTRAINT `FK_useTables_menus` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`),
  CONSTRAINT `FK_useTables_messages` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`),
  CONSTRAINT `FK_useTables_paymentMachines` FOREIGN KEY (`payment_machine_id`) REFERENCES `payment_machines` (`id`),
  CONSTRAINT `FK_useTables_reservations` FOREIGN KEY (`reservation_id`) REFERENCES `reservations` (`id`),
  CONSTRAINT `FK_useTables_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_useTables_tables` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `use_tables`
--

LOCK TABLES `use_tables` WRITE;
/*!40000 ALTER TABLE `use_tables` DISABLE KEYS */;
INSERT INTO `use_tables` VALUES (1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',1,'2026-08-01 23:20:48','2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',2,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',3,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',4,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',5,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',6,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',7,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',8,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',9,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',10,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',11,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',12,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',13,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',14,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',15,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',16,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(17,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',17,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',18,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(19,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',19,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(20,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',20,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(21,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',21,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',22,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(23,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',23,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(24,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',24,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(25,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',25,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(26,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',26,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(27,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',27,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(28,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',28,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(29,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',29,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'EMPTY',30,NULL,'2025-07-24 00:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(31,'1@gmail.com','1',1,'1111111111',1,4,NULL,1,'OCCUPIED',1,'2026-08-02 00:41:19','2026-08-01 23:20:48',NULL,1,1,1,2,1,3),(32,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 00:50:28','2026-08-02 00:41:19',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(33,'tranvana@gmail.com','Trần Văn A',2,'0000000001',1,5,NULL,1,'OCCUPIED',1,'2026-08-02 05:42:39','2026-08-02 00:50:28',NULL,1,2,2,2,1,3),(34,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 05:42:50','2026-08-02 05:42:39',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(35,'tranvana@gmail.com','Trần Văn A',2,'0000000001',1,8,NULL,1,'OCCUPIED',1,'2026-08-02 12:04:00','2026-08-02 05:42:50',NULL,1,3,3,1,1,2),(36,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 12:09:27','2026-08-02 12:04:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(37,'tranvana@gmail.com','Trần Văn A',2,'0000000001',1,9,NULL,1,'OCCUPIED',1,'2026-08-02 12:14:12','2026-08-02 12:09:27',NULL,1,4,4,2,1,3),(38,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 12:22:34','2026-08-02 12:14:12',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(39,'tranvana@gmail.com','Trần Văn A',2,'0000000001',1,10,NULL,1,'OCCUPIED',1,'2026-08-02 12:40:58','2026-08-02 12:22:34',NULL,1,5,5,2,1,3),(40,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 12:41:35','2026-08-02 12:40:58',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(41,'tranvana@gmail.com','Trần Văn A',2,'0000000001',1,11,NULL,1,'OCCUPIED',1,'2026-08-02 12:45:06','2026-08-02 12:41:35',NULL,1,6,6,2,1,3),(42,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 12:50:10','2026-08-02 12:45:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(43,'1@gmail.com','1',1,'1111111111',1,12,NULL,1,'OCCUPIED',1,'2026-08-02 12:54:43','2026-08-02 12:50:10',NULL,1,7,7,2,1,3),(44,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 12:55:10','2026-08-02 12:54:43',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(45,'tq@gmail.com','Thanh Quy',1,'11111111111',1,13,NULL,1,'OCCUPIED',1,'2026-08-02 13:04:42','2026-08-02 12:55:10',NULL,1,8,8,2,1,3),(46,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 13:06:40','2026-08-02 13:04:42',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(47,'1@gmail.com','Thanh Quy',1,'1111111111',1,14,NULL,1,'OCCUPIED',1,'2026-08-02 13:17:50','2026-08-02 13:06:40',NULL,1,9,9,2,1,3),(48,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,'2026-08-02 13:32:41','2026-08-02 13:17:50',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(49,'tq@gmail.com','Thanh Quy',1,'1111111111',1,15,NULL,1,'OCCUPIED',1,'2026-08-02 13:41:56','2026-08-02 13:32:41',NULL,1,10,10,2,1,3),(50,NULL,NULL,NULL,NULL,1,NULL,NULL,1,'EMPTY',1,NULL,'2026-08-02 13:41:56',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `use_tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `method` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `refresh_token` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `role` varchar(8) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `status` varchar(8) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'HANDMADE','$2a$10$bhH/.jM0ks/qDcAhzFtKCO0b1LYyhTxF3lZrtxLVQ4KRWSbdhTRha','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTc4NjIyMTE4MCwiaWF0IjoxNzg2MTM0NzgwLCJ1c2VyIjp7InJvbGUiOiJST0xFX0FETUlOIiwibWV0aG9kIjoiSEFORE1BREUiLCJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInN0YXR1cyI6IkFDVElWRSJ9fQ.vGRgteYPRFMw2CR_9wxs1qDGb3fD78DpdzlQ-Fe8l2mpm7sZh_kgznrhPAnPJN-IV9HknAWSl0Y9yhWw5eUICw','ADMIN','ACTIVE','admin'),(2,'HANDMADE','$2a$10$JCdSVcRsSdWrIXlIA3nWFe5dnGydRYjoE33l7xr3YpxqrNxHnGQlG','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5hZ2VyMCIsImV4cCI6MTc4NjI5NzQxOCwiaWF0IjoxNzg2MjExMDE4LCJ1c2VyIjp7InJvbGUiOiJST0xFX01BTkFHRVIiLCJtZXRob2QiOiJIQU5ETUFERSIsImlkIjoyLCJhdXRob3JpdGllcyI6WyJEQVNIQk9BUkRfUFJPRklUX19SRUFEIiwiREFTSEJPQVJEX1JFVkVOVUVfX1JFQUQiLCJEQVNIQk9BUkRfRVhQRU5TRV9fUkVBRCIsIkRBU0hCT0FSRF9GRUVEQkFDS19fUkVBRCIsIlRBQkxFX0hJU1RPUklFU19fUkVBRCIsIlVTRV9UQUJMRVNfX1JFQUQiLCJVU0VfVEFCTEVTX19VUERBVEUiLCJVU0VfRk9PRFNfX1JFQUQiLCJVU0VfRk9PRFNfX1VQREFURSIsIk1FTlVTX19SRUFEIiwiTUVOVVNfX0NSRUFURSIsIk1FTlVTX19VUERBVEUiLCJNRU5VU19fREVMRVRFIiwiT1JERVJfU0hFRVRTX19SRUFEIiwiT1JERVJfU0hFRVRTX19VUERBVEUiLCJNRVNTQUdFU19fUkVBRCIsIk1FU1NBR0VTX19DUkVBVEUiLCJCSUxMU19fUkVBRCIsIkJJTExTX19DUkVBVEUiLCJCSUxMU19fVVBEQVRFIiwiUkVTRVJWQVRJT05TX19SRUFEIiwiUkVTRVJWQVRJT05TX19DUkVBVEUiLCJSRVNFUlZBVElPTlNfX1VQREFURSIsIkZMT09SU19fUkVBRCIsIkZMT09SU19fQ1JFQVRFIiwiRkxPT1JTX19VUERBVEUiLCJGTE9PUlNfX0RFTEVURSIsIkNBVEVHT1JZX1RBQkxFU19fUkVBRCIsIkNBVEVHT1JZX1RBQkxFU19fQ1JFQVRFIiwiQ0FURUdPUllfVEFCTEVTX19VUERBVEUiLCJDQVRFR09SWV9UQUJMRVNfX0RFTEVURSIsIlRBQkxFU19fUkVBRCIsIlRBQkxFU19fQ1JFQVRFIiwiVEFCTEVTX19VUERBVEUiLCJUQUJMRVNfX0RFTEVURSIsIklOUFVUX1RJQ0tFVFNfX1JFQUQiLCJJTlBVVF9USUNLRVRTX19DUkVBVEUiLCJJTlBVVF9USUNLRVRTX19VUERBVEUiLCJTVVBQTElFUlNfX1JFQUQiLCJTVVBQTElFUlNfX0NSRUFURSIsIlNVUFBMSUVSU19fVVBEQVRFIiwiU1VQUExJRVJTX19ERUxFVEUiLCJDQVRFR09SWV9JTkdSRURJRU5UU19fUkVBRCIsIkNBVEVHT1JZX0lOR1JFRElFTlRTX19DUkVBVEUiLCJDQVRFR09SWV9JTkdSRURJRU5UU19fVVBEQVRFIiwiQ0FURUdPUllfSU5HUkVESUVOVFNfX0RFTEVURSIsIklOR1JFRElFTlRTX19SRUFEIiwiSU5HUkVESUVOVFNfX0NSRUFURSIsIklOR1JFRElFTlRTX19VUERBVEUiLCJJTkdSRURJRU5UU19fREVMRVRFIiwiQ0FURUdPUllfRk9PRFNfX1JFQUQiLCJDQVRFR09SWV9GT09EU19fQ1JFQVRFIiwiQ0FURUdPUllfRk9PRFNfX1VQREFURSIsIkNBVEVHT1JZX0ZPT0RTX19ERUxFVEUiLCJGT09EU19fUkVBRCIsIkZPT0RTX19DUkVBVEUiLCJGT09EU19fVVBEQVRFIiwiRk9PRFNfX0RFTEVURSIsIlJPTEVTX19SRUFEIiwiUk9MRVNfX0NSRUFURSIsIlJPTEVTX19VUERBVEUiLCJST0xFU19fREVMRVRFIiwiUEVSTUlTU0lPTlNfX1JFQUQiLCJQRVJNSVNTSU9OU19fQ1JFQVRFIiwiUEVSTUlTU0lPTlNfX1VQREFURSIsIlBFUk1JU1NJT05TX19ERUxFVEUiLCJFTVBMT1lFRVNfX1JFQUQiLCJFTVBMT1lFRVNfX0NSRUFURSIsIkVNUExPWUVFU19fVVBEQVRFIiwiRU1QTE9ZRUVTX19ERUxFVEUiXSwidXNlcm5hbWUiOiJtYW5hZ2VyMCIsInN0YXR1cyI6IkFDVElWRSJ9fQ.UGbIplTefhvlVG92vkE1AmDpcEz7tOEZp2Vgj1kzTbZVxjNf2HbJgVR9wRyLVlspYvaBGnOQVjR5u-VaZnynsw','MANAGER','ACTIVE','manager0'),(3,'HANDMADE','$2a$10$Y8zeMZCmycfAlk0ecbJnhepUDk1aTazZyAIbSS.3QdmdPSQNGTHDq',NULL,'MANAGER','ACTIVE','manager1'),(4,'HANDMADE','$2a$10$7rcbF5789gXaTvRqXmpFMe9srjpVvh5u64OvDK78WIJAAdlUqKq8m','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbXBsb3llZTAiLCJleHAiOjE3ODYyMjI2NzEsImlhdCI6MTc4NjEzNjI3MSwidXNlciI6eyJyb2xlIjoiUk9MRV9FTVBMT1lFRSIsIm1ldGhvZCI6IkhBTkRNQURFIiwiaWQiOjQsImF1dGhvcml0aWVzIjpbIlVTRV9UQUJMRVNfX1VQREFURSIsIlVTRV9GT09EU19fVVBEQVRFIiwiTUVOVVNfX1VQREFURSIsIk9SREVSX1NIRUVUU19fVVBEQVRFIiwiQklMTFNfX1VQREFURSIsIlJFU0VSVkFUSU9OU19fVVBEQVRFIiwiRkxPT1JTX19VUERBVEUiLCJDQVRFR09SWV9UQUJMRVNfX1VQREFURSIsIlRBQkxFU19fVVBEQVRFIiwiSU5QVVRfVElDS0VUU19fVVBEQVRFIiwiU1VQUExJRVJTX19VUERBVEUiLCJDQVRFR09SWV9JTkdSRURJRU5UU19fVVBEQVRFIiwiSU5HUkVESUVOVFNfX1VQREFURSIsIkNBVEVHT1JZX0ZPT0RTX19VUERBVEUiLCJGT09EU19fVVBEQVRFIiwiUk9MRVNfX1VQREFURSIsIlBFUk1JU1NJT05TX19VUERBVEUiLCJFTVBMT1lFRVNfX1VQREFURSIsIk1FTlVTX19ERUxFVEUiLCJGTE9PUlNfX0RFTEVURSIsIkNBVEVHT1JZX1RBQkxFU19fREVMRVRFIiwiVEFCTEVTX19ERUxFVEUiLCJTVVBQTElFUlNfX0RFTEVURSIsIkNBVEVHT1JZX0lOR1JFRElFTlRTX19ERUxFVEUiLCJJTkdSRURJRU5UU19fREVMRVRFIiwiQ0FURUdPUllfRk9PRFNfX0RFTEVURSIsIkZPT0RTX19ERUxFVEUiLCJST0xFU19fREVMRVRFIiwiUEVSTUlTU0lPTlNfX0RFTEVURSIsIkVNUExPWUVFU19fREVMRVRFIiwiTUVOVVNfX0NSRUFURSIsIk1FU1NBR0VTX19DUkVBVEUiLCJCSUxMU19fQ1JFQVRFIiwiUkVTRVJWQVRJT05TX19DUkVBVEUiLCJGTE9PUlNfX0NSRUFURSIsIkNBVEVHT1JZX1RBQkxFU19fQ1JFQVRFIiwiVEFCTEVTX19DUkVBVEUiLCJJTlBVVF9USUNLRVRTX19DUkVBVEUiLCJTVVBQTElFUlNfX0NSRUFURSIsIkNBVEVHT1JZX0lOR1JFRElFTlRTX19DUkVBVEUiLCJJTkdSRURJRU5UU19fQ1JFQVRFIiwiQ0FURUdPUllfRk9PRFNfX0NSRUFURSIsIkZPT0RTX19DUkVBVEUiLCJST0xFU19fQ1JFQVRFIiwiUEVSTUlTU0lPTlNfX0NSRUFURSIsIkVNUExPWUVFU19fQ1JFQVRFIiwiREFTSEJPQVJEX1BST0ZJVF9fUkVBRCIsIkRBU0hCT0FSRF9SRVZFTlVFX19SRUFEIiwiREFTSEJPQVJEX0VYUEVOU0VfX1JFQUQiLCJEQVNIQk9BUkRfRkVFREJBQ0tfX1JFQUQiLCJUQUJMRV9ISVNUT1JJRVNfX1JFQUQiLCJVU0VfVEFCTEVTX19SRUFEIiwiVVNFX0ZPT0RTX19SRUFEIiwiTUVOVVNfX1JFQUQiLCJPUkRFUl9TSEVFVFNfX1JFQUQiLCJNRVNTQUdFU19fUkVBRCIsIkJJTExTX19SRUFEIiwiUkVTRVJWQVRJT05TX19SRUFEIiwiRkxPT1JTX19SRUFEIiwiQ0FURUdPUllfVEFCTEVTX19SRUFEIiwiVEFCTEVTX19SRUFEIiwiSU5QVVRfVElDS0VUU19fUkVBRCIsIlNVUFBMSUVSU19fUkVBRCIsIkNBVEVHT1JZX0lOR1JFRElFTlRTX19SRUFEIiwiSU5HUkVESUVOVFNfX1JFQUQiLCJDQVRFR09SWV9GT09EU19fUkVBRCIsIkZPT0RTX19SRUFEIiwiUk9MRVNfX1JFQUQiLCJQRVJNSVNTSU9OU19fUkVBRCIsIkVNUExPWUVFU19fUkVBRCJdLCJ1c2VybmFtZSI6ImVtcGxveWVlMCIsInN0YXR1cyI6IkFDVElWRSJ9fQ.FnkdmLinWb5KuYG0EPOX3-HJgIcOgXyhkOZ8Bqx34DG6vujguEnAY-5fl0KebbOAOroYzUM9noLV2ti42anSwg','EMPLOYEE','ACTIVE','employee0'),(5,'HANDMADE','$2a$10$NtuTmHa926tz6DyAv1/3b.L4pjE4tiWrAgPfXl/ohPIjK3dpz/dE2','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbXBsb3llZTEiLCJleHAiOjE3ODU2ODc1MjAsImlhdCI6MTc4NTYwMTEyMCwidXNlciI6eyJyb2xlIjoiTmjDom4gdmnDqm4gbmjDoCBow6BuZyIsIm1ldGhvZCI6IkhBTkRNQURFIiwiaWQiOjUsInVzZXJuYW1lIjoiZW1wbG95ZWUxIiwic3RhdHVzIjoiQUNUSVZFIn19.qWJxE0qVpOsek825nA9Kt2DD6awVE1bi9eTzUy5ut1kJDDw413cHPO0Bbukfu1Dqv7NL2pgC2gy88rUuAMDeZw','EMPLOYEE','ACTIVE','employee1'),(6,'HANDMADE','$2a$10$JSQaUZ2U50IrDgYQisO3heahc1xISrhtQ423EViMXJus.I5cavY9S',NULL,'EMPLOYEE','ACTIVE','employee2'),(7,'HANDMADE','$2a$10$jODPwwMUJ/73.kPmHhdXguyFbdt1dHV.ypHZzqfsKLY0w2e985y0u','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbXBsb3llZTMiLCJleHAiOjE3ODYyMjI2OTcsImlhdCI6MTc4NjEzNjI5NywidXNlciI6eyJyb2xlIjoiUk9MRV9FTVBMT1lFRSIsIm1ldGhvZCI6IkhBTkRNQURFIiwiaWQiOjcsImF1dGhvcml0aWVzIjpbIklOUFVUX1RJQ0tFVFNfX1VQREFURSIsIlNVUFBMSUVSU19fVVBEQVRFIiwiQ0FURUdPUllfSU5HUkVESUVOVFNfX1VQREFURSIsIklOR1JFRElFTlRTX19VUERBVEUiLCJDQVRFR09SWV9GT09EU19fVVBEQVRFIiwiRk9PRFNfX1VQREFURSIsIlNVUFBMSUVSU19fREVMRVRFIiwiQ0FURUdPUllfSU5HUkVESUVOVFNfX0RFTEVURSIsIklOR1JFRElFTlRTX19ERUxFVEUiLCJDQVRFR09SWV9GT09EU19fREVMRVRFIiwiRk9PRFNfX0RFTEVURSIsIklOUFVUX1RJQ0tFVFNfX0NSRUFURSIsIlNVUFBMSUVSU19fQ1JFQVRFIiwiQ0FURUdPUllfSU5HUkVESUVOVFNfX0NSRUFURSIsIklOR1JFRElFTlRTX19DUkVBVEUiLCJDQVRFR09SWV9GT09EU19fQ1JFQVRFIiwiRk9PRFNfX0NSRUFURSIsIkRBU0hCT0FSRF9FWFBFTlNFX19SRUFEIiwiSU5QVVRfVElDS0VUU19fUkVBRCIsIlNVUFBMSUVSU19fUkVBRCIsIkNBVEVHT1JZX0lOR1JFRElFTlRTX19SRUFEIiwiSU5HUkVESUVOVFNfX1JFQUQiLCJDQVRFR09SWV9GT09EU19fUkVBRCIsIkZPT0RTX19SRUFEIl0sInVzZXJuYW1lIjoiZW1wbG95ZWUzIiwic3RhdHVzIjoiQUNUSVZFIn19.vQ7oFGRytp9xiwmlx7q4RDzebUPRbQUr_vj2DCKMDtbwKWGiyn9DzXgsv_LeWkxMa32xmZ8Dwfko2KEUYup7Zg','EMPLOYEE','ACTIVE','employee3'),(8,'HANDMADE','$2a$10$GZ43yo1RYp7Yybl7AcvP8O9aV0fLffTJvNfuJyEX.o00gGYlZ/iuC','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbXBsb3llZTQiLCJleHAiOjE3ODYyMjI4OTgsImlhdCI6MTc4NjEzNjQ5OCwidXNlciI6eyJyb2xlIjoiUk9MRV9FTVBMT1lFRSIsIm1ldGhvZCI6IkhBTkRNQURFIiwiaWQiOjgsImF1dGhvcml0aWVzIjpbIlJPTEVTX19VUERBVEUiLCJQRVJNSVNTSU9OU19fVVBEQVRFIiwiRU1QTE9ZRUVTX19VUERBVEUiLCJST0xFU19fREVMRVRFIiwiUEVSTUlTU0lPTlNfX0RFTEVURSIsIkVNUExPWUVFU19fREVMRVRFIiwiUk9MRVNfX0NSRUFURSIsIlBFUk1JU1NJT05TX19DUkVBVEUiLCJFTVBMT1lFRVNfX0NSRUFURSIsIlJPTEVTX19SRUFEIiwiUEVSTUlTU0lPTlNfX1JFQUQiLCJFTVBMT1lFRVNfX1JFQUQiXSwidXNlcm5hbWUiOiJlbXBsb3llZTQiLCJzdGF0dXMiOiJBQ1RJVkUifX0.nIoWGOM5_ree8W24jmyFOjE_RkylKKD0EyBPedBgc4jHWcrFTpcFgIWdaj0IZKsa9FIFjym47Rbml6NNknA7BA','EMPLOYEE','ACTIVE','employee4'),(9,'HANDMADE','$2a$10$1gNzH9YaB01Cd..ucbPlI.Bdx6UdtIyu3.3jrbcQY3J4W5Qy5w1qa',NULL,'CUSTOMER','ACTIVE','customer-guest'),(10,'HANDMADE','$2a$10$aHFolHaNYoVtzX2PFL6/T.EA5Ak4ciPwkaFlFJft2HYbIrwxXtDC.',NULL,'CUSTOMER','ACTIVE','customer0'),(11,'HANDMADE','$2a$10$IhIBM99z/aZD.6pQ5Oya.O6uMNAiUmS1/6AQuyX.wDmRTBbkFb7x.',NULL,'CUSTOMER','ACTIVE','customer1');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-09  6:00:02
