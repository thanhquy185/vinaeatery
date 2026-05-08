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

CREATE DATABASE IF NOT EXISTS `vinaeatery` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `vinaeatery`;

--
-- Table structure for table `allowance_details`
--

DROP TABLE IF EXISTS `allowance_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allowance_details` (
  `allowance_id` int NOT NULL,
  `category_allowance_id` int NOT NULL,
  `employee_id` int NOT NULL,
  PRIMARY KEY (`allowance_id`,`category_allowance_id`,`employee_id`),
  KEY `FK_allowanceDetails_employees` (`employee_id`),
  KEY `FK_allowanceDetails_categoryAllowances` (`category_allowance_id`),
  CONSTRAINT `FK_allowanceDetails_allowances` FOREIGN KEY (`allowance_id`) REFERENCES `allowances` (`id`),
  CONSTRAINT `FK_allowanceDetails_categoryAllowances` FOREIGN KEY (`category_allowance_id`) REFERENCES `category_allowances` (`id`),
  CONSTRAINT `FK_allowanceDetails_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allowance_details`
--

LOCK TABLES `allowance_details` WRITE;
/*!40000 ALTER TABLE `allowance_details` DISABLE KEYS */;
INSERT INTO `allowance_details` VALUES (1,1,1),(1,2,1),(1,3,1),(1,15,1);
/*!40000 ALTER TABLE `allowance_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `allowances`
--

DROP TABLE IF EXISTS `allowances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `allowances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `note` mediumtext COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_allowances_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_allowances_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `allowances`
--

LOCK TABLES `allowances` WRITE;
/*!40000 ALTER TABLE `allowances` DISABLE KEYS */;
INSERT INTO `allowances` VALUES (1,'2026-02','Phụ cấp tháng 02/2026','',1,_binary '');
/*!40000 ALTER TABLE `allowances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `employee_id` int NOT NULL,
  `leave_status` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `restaurant_id` int NOT NULL,
  `shift_id` int NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_attendances_restaurants` (`restaurant_id`),
  KEY `FK_attendances_employees` (`employee_id`),
  KEY `FK_attendances_shifts` (`shift_id`),
  CONSTRAINT `FK_attendances_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_attendances_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_attendances_shifts` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
INSERT INTO `attendances` VALUES (1,'06:58:00','12:02:00','2026-02-01',1,'PAID',1,1,3);
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_allowances`
--

DROP TABLE IF EXISTS `category_allowances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_allowances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `money` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_categoryAllowances_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_categoryAllowances_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_allowances`
--

LOCK TABLES `category_allowances` WRITE;
/*!40000 ALTER TABLE `category_allowances` DISABLE KEYS */;
INSERT INTO `category_allowances` VALUES (1,'Hỗ trợ chi phí ăn trong ca làm việc',30000,'Phụ cấp ăn ca',1,_binary ''),(2,'Hỗ trợ chi phí đi lại cho nhân viên',200000,'Phụ cấp xăng xe',1,_binary ''),(3,'Hỗ trợ phí gửi xe hàng tháng',100000,'Phụ cấp gửi xe',1,_binary ''),(4,'Hỗ trợ liên lạc công việc',150000,'Phụ cấp điện thoại',1,_binary ''),(5,'Áp dụng cho tổ trưởng, quản lý ca',500000,'Phụ cấp trách nhiệm',1,_binary ''),(6,'Thưởng khi đi làm đầy đủ, đúng giờ',300000,'Phụ cấp chuyên cần',1,_binary ''),(7,'Áp dụng cho ca làm việc ban đêm',40000,'Phụ cấp ca đêm',1,_binary ''),(8,'Áp dụng khi làm ngoài giờ quy định',50000,'Phụ cấp làm thêm giờ',1,_binary ''),(9,'Hỗ trợ chi phí đồng phục nhân viên',100000,'Phụ cấp đồng phục',1,_binary ''),(10,'Hỗ trợ khi tham gia training',200000,'Phụ cấp đào tạo',1,_binary ''),(11,'Thưởng theo hiệu suất làm việc',300000,'Phụ cấp KPI',1,_binary ''),(12,'Quà sinh nhật (miễn phí)',0,'Phụ cấp sinh nhật',1,_binary ''),(13,'Thưởng vào các dịp lễ lớn',500000,'Phụ cấp lễ tết',1,_binary ''),(14,'Nhà hàng hỗ trợ hoàn toàn phí gửi xe',0,'Phụ cấp giữ xe miễn phí',1,_binary ''),(15,'Hỗ trợ thuê nhà cho nhân viên xa',1000000,'Phụ cấp nhà ở',1,_binary '');
/*!40000 ALTER TABLE `category_allowances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_foods`
--

DROP TABLE IF EXISTS `category_foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_foods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
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
INSERT INTO `category_foods` VALUES (1,'Các món ăn nhẹ như gỏi, súp, chả giò dùng để khai vị.',NULL,'Khai vị',1,_binary ''),(2,'Các món ăn chính như cơm, bún, phở, lẩu,...',NULL,'Món chính',1,_binary ''),(3,'Các món ngọt hoặc trái cây dùng sau bữa ăn.',NULL,'Tráng miệng',1,_binary ''),(4,'Nước ngọt, bia, rượu, sinh tố, nước ép,...',NULL,'Thức uống',1,_binary ''),(5,'Món ăn chay sử dụng nguyên liệu từ thực vật.',NULL,'Món chay',1,_binary ''),(6,'Các món rau trộn nhiều loại sốt đa dạng.',NULL,'Salad',1,_binary ''),(7,'Món mì, bún xào, bún nước, hủ tiếu,...',NULL,'Mì & Bún',1,_binary ''),(8,'Các món lẩu đa dạng như lẩu thái, lẩu nấm, lẩu bò,...',NULL,'Lẩu',1,_binary ''),(9,'Các món nướng như thịt nướng, hải sản nướng,...',NULL,'Đồ nướng',1,_binary ''),(10,'Các món chiên như gà rán, khoai tây chiên,...',NULL,'Đồ chiên',1,_binary ''),(11,'Các món chế biến từ hải sản như tôm, cua, mực,...',NULL,'Hải sản',1,_binary ''),(12,'Các món cơm dĩa, cơm phần, cơm chiên,...',NULL,'Cơm',1,_binary ''),(13,'Hamburger, sandwich, xúc xích, gà rán,...',NULL,'Đồ ăn nhanh',1,_binary ''),(14,'Món hấp như bánh bao, há cảo, cá hấp,...',NULL,'Đồ hấp',1,_binary ''),(15,'Các loại canh, súp ăn kèm cơm hoặc khai vị.',NULL,'Canh & Súp',1,_binary '');
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
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
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
INSERT INTO `category_ingredients` VALUES (1,'Thịt heo, bò, dê, trâu... giàu đạm và sắt','Thịt đỏ',1,_binary ''),(2,'Thịt gà, vịt, ngan... ít béo, dễ tiêu hóa','Thịt trắng',1,_binary ''),(3,'Tôm, cua, cá, mực, nghêu, sò... từ biển và sông','Hải sản',1,_binary ''),(4,'Trứng gia cầm, sữa tươi, sữa đặc, phô mai...','Trứng & Sữa',1,_binary ''),(5,'Rau muống, cải thìa, cải ngọt, rau dền...','Rau ăn lá',1,_binary ''),(6,'Cà rốt, khoai tây, hành tây, su su, bí đỏ...','Củ quả',1,_binary ''),(7,'Muối, tiêu, đường, bột ngọt, hạt nêm...','Gia vị khô',1,_binary ''),(8,'Nước mắm, nước tương, dầu hào, giấm, tương ớt...','Gia vị ướt',1,_binary ''),(9,'Dầu ăn, mỡ heo, dầu mè, bơ...','Dầu mỡ',1,_binary ''),(10,'Đậu hũ, nấm rơm, nấm mèo, nấm kim châm...','Đậu & Nấm',1,_binary ''),(11,'Bột mì, bột năng, bột bắp, bún, mì, cơm...','Tinh bột',1,_binary ''),(12,'Miến khô, nấm khô, mộc nhĩ, rong biển...','Thực phẩm khô',1,_binary ''),(13,'Lá chanh, sả, gừng, quế, hồi, rau thơm...','Thảo mộc & Lá',1,_binary '');
/*!40000 ALTER TABLE `category_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_insurances`
--

DROP TABLE IF EXISTS `category_insurances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_insurances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_percent` float NOT NULL,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `employee_percent` float NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_categoryInsurances_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_categoryInsurances_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_insurances`
--

LOCK TABLES `category_insurances` WRITE;
/*!40000 ALTER TABLE `category_insurances` DISABLE KEYS */;
INSERT INTO `category_insurances` VALUES (1,17.5,'Chế độ hưu trí, ốm đau, thai sản, tai nạn lao động',8,'Bảo hiểm xã hội',1,_binary ''),(2,3,'Hỗ trợ chi phí khám chữa bệnh',1.5,'Bảo hiểm y tế',1,_binary ''),(3,1,'Hỗ trợ tài chính khi mất việc làm',1,'Bảo hiểm thất nghiệp',1,_binary ''),(4,0.5,'Bảo hiểm tai nạn trong quá trình làm việc',0,'Bảo hiểm tai nạn lao động',1,_binary ''),(5,5,'Gói khám chữa bệnh cao cấp tại bệnh viện tư',0,'Bảo hiểm sức khỏe cao cấp',1,_binary ''),(6,2,'Bảo hiểm dài hạn cho rủi ro tử vong',0,'Bảo hiểm nhân thọ',1,_binary ''),(7,1.5,'Chi trả khi mắc bệnh nghiêm trọng',0,'Bảo hiểm bệnh hiểm nghèo',1,_binary ''),(8,1,'Hỗ trợ nhân viên trong trường hợp đặc biệt',0,'Quỹ phúc lợi nội bộ',1,_binary '');
/*!40000 ALTER TABLE `category_insurances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_permission_tickets`
--

DROP TABLE IF EXISTS `category_permission_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_permission_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_permission_tickets`
--

LOCK TABLES `category_permission_tickets` WRITE;
/*!40000 ALTER TABLE `category_permission_tickets` DISABLE KEYS */;
INSERT INTO `category_permission_tickets` VALUES (1,'Nhân viên xin nghỉ làm có báo trước','Xin nghỉ phép',1,_binary ''),(2,'Nhân viên xin nghỉ do vấn đề sức khỏe','Xin nghỉ ốm',1,_binary ''),(3,'Xin nghỉ để giải quyết việc cá nhân','Xin nghỉ việc riêng',1,_binary ''),(4,'Xin phép đi làm trễ so với ca đăng ký','Xin đi trễ',1,_binary ''),(5,'Xin phép về trước giờ kết thúc ca','Xin về sớm',1,_binary ''),(6,'Xin đổi ca làm việc với nhân viên khác','Xin đổi ca',1,_binary ''),(7,'Xin đăng ký làm bù ca đã nghỉ','Xin làm bù',1,_binary ''),(8,'Xin đăng ký làm thêm ngoài ca chính','Xin làm thêm giờ',1,_binary ''),(9,'Xin nghỉ làm và không tính lương','Xin nghỉ không lương',1,_binary ''),(10,'Xin nghỉ gấp do tình huống đột xuất','Xin nghỉ khẩn cấp',1,_binary ''),(11,'Đi hỗ trợ hoặc làm việc tại chi nhánh khác','Xin đi công tác',1,_binary ''),(12,'Xin thay đổi giờ bắt đầu hoặc kết thúc ca','Xin điều chỉnh ca',1,_binary '');
/*!40000 ALTER TABLE `category_permission_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_reward_punishes`
--

DROP TABLE IF EXISTS `category_reward_punishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_reward_punishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `handle` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_reward_punishes`
--

LOCK TABLES `category_reward_punishes` WRITE;
/*!40000 ALTER TABLE `category_reward_punishes` DISABLE KEYS */;
INSERT INTO `category_reward_punishes` VALUES (1,'Áp dụng cho nhân viên đi làm đúng giờ, không đi trễ trong ca','REWARD','Thưởng đi làm đúng giờ',1,_binary ''),(2,'Nhân viên không nghỉ ca, không đổi ca trong tháng','REWARD','Thưởng làm đủ ca trong tháng',1,_binary ''),(3,'Áp dụng khi nhân viên làm thêm giờ theo yêu cầu nhà hàng','REWARD','Thưởng làm thêm giờ',1,_binary ''),(4,'Thưởng cho ca làm vào thứ 7, chủ nhật hoặc ngày lễ','REWARD','Thưởng tăng ca cuối tuần',1,_binary ''),(5,'Nhân viên hoàn thành tốt công việc, được quản lý đánh giá cao','REWARD','Thưởng hiệu suất tốt',1,_binary ''),(6,'Áp dụng khi doanh thu ca hoặc ngày vượt chỉ tiêu','REWARD','Thưởng doanh thu',1,_binary ''),(7,'Nhân viên hỗ trợ tốt đồng nghiệp trong ca làm','REWARD','Thưởng hỗ trợ đồng nghiệp',1,_binary ''),(8,'Đi làm đầy đủ, không nghỉ không phép trong tháng','REWARD','Thưởng chuyên cần',1,_binary ''),(9,'Nhân viên đi trễ so với thời gian quy định của ca làm','PUNISH','Phạt đi trễ',1,_binary ''),(10,'Tự ý rời ca làm trước giờ kết thúc','PUNISH','Phạt về sớm',1,_binary ''),(11,'Nghỉ ca không báo trước hoặc không được quản lý duyệt','PUNISH','Phạt nghỉ không phép',1,_binary ''),(12,'Không đến làm việc mà không có lý do chính đáng','PUNISH','Phạt bỏ ca',1,_binary ''),(13,'Không tuân thủ quy trình phục vụ hoặc chế biến','PUNISH','Phạt làm sai quy trình',1,_binary ''),(14,'Có phản ánh tiêu cực từ khách hàng','PUNISH','Phạt thái độ phục vụ kém',1,_binary ''),(15,'Không đảm bảo vệ sinh khu vực làm việc','PUNISH','Phạt gây mất vệ sinh',1,_binary ''),(16,'Làm hư hỏng dụng cụ, thiết bị của nhà hàng','PUNISH','Phạt làm hỏng tài sản',1,_binary ''),(17,'Không tuân thủ quy định về đồng phục và tác phong','PUNISH','Phạt không mặc đồng phục',1,_binary ''),(18,'Vi phạm nội quy, quy định chung của nhà hàng','PUNISH','Phạt vi phạm nội quy',1,_binary '');
/*!40000 ALTER TABLE `category_reward_punishes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_tables`
--

DROP TABLE IF EXISTS `category_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  `surcharge_type` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `surcharge_value` bigint DEFAULT NULL,
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
INSERT INTO `category_tables` VALUES (1,'Bàn tiêu chuẩn không phụ thu','Bàn thường',1,_binary '',NULL,NULL),(2,'View đẹp, phụ thu 5% hóa đơn','Bàn gần cửa sổ',1,_binary '','FIXED',5),(3,'Không gian riêng tư, phụ thu cố định 100K','Bàn VIP',1,_binary '','PERCENT',100000),(4,'Phòng kín không có máy lạnh, phụ thu 200K/lượt','Phòng riêng thường',1,_binary '','FIXED',200000),(5,'Phòng kín có máy lạnh, phụ thu 500K/lượt','Phòng riêng Vip',1,_binary '','FIXED',500000);
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
  `address` text COLLATE utf8mb4_general_ci,
  `birthday` date DEFAULT NULL,
  `create_at` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` bit(1) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` bit(1) NOT NULL,
  `user_id` int NOT NULL,
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
INSERT INTO `customers` VALUES (1,'',NULL,'2025-12-02 00:00:00','Dùng để khi xử lý cho khách hàng chưa có tài khoản trên hệ thống','khachahang@gmail.com','Khách hàng',NULL,NULL,'0000000000',_binary '',9),(2,'',NULL,'2025-12-02 00:00:00',NULL,'tranvana@gmail.com','Trần Văn A',NULL,NULL,'0000000001',_binary '',10),(3,'',NULL,'2025-12-02 00:00:00',NULL,'nguyenthib@gmail.com','Nguyễn Thị B',NULL,NULL,'0000000002',_binary '',11);
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
  `address` text COLLATE utf8mb4_general_ci,
  `birthday` date DEFAULT NULL,
  `create_at` datetime NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` bit(1) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permission_id` int NOT NULL,
  `phone` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKj9xgmd0ya5jmus09o0b8pqrpb` (`email`),
  UNIQUE KEY `UKgnponadwwxr5nm2tqe5b905hs` (`phone`),
  KEY `FK_employees_restaurants` (`restaurant_id`),
  KEY `FK_employees_users` (`user_id`),
  KEY `FK_employees_permissions` (`permission_id`),
  CONSTRAINT `FK_employees_permissions` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),
  CONSTRAINT `FK_employees_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_employees_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'địa chỉ quản lý',NULL,'2025-07-10 00:00:00','quanly@gmail.com','Quản lý',NULL,NULL,1,'0000000000',1,_binary '',4),(2,'địa chỉ ql vận hành',NULL,'2025-07-10 00:00:00','qlvanhanh@gmail.com','Quản lý vận hành',NULL,NULL,2,'0000000001',1,_binary '',5),(3,'địa chỉ ql chổ ngồi',NULL,'2025-07-10 00:00:00','qlchongoi@gmail.com','Quản lý chổ ngồi',NULL,NULL,3,'0000000002',1,_binary '',6),(4,'địa chỉ ql kho hàng',NULL,'2025-07-10 00:00:00','qlkhohang@gmail.com','Quản lý kho hàng',NULL,NULL,4,'0000000003',1,_binary '',7),(5,'địa chỉ ql nhân sự',NULL,'2025-07-10 00:00:00','qlnhansu@gmail.com','Quản lý nhân sự',NULL,NULL,5,'0000000004',1,_binary '',8);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `floors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
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
INSERT INTO `floors` VALUES (1,'Sảnh chờ, nhà bếp, kho hàng...','Tầng 1',1,_binary '\0'),(2,'Khu ăn uống bình dân','Tầng 2',1,_binary ''),(3,'Khu gia đình, yên tĩnh','Tầng 3',1,_binary ''),(4,'Khu VIP, máy lạnh đầy đủ','Tầng 4',1,_binary '');
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
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` bigint NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  `unit` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_foods_restaurants` (`restaurant_id`),
  KEY `FK_foods_categoryFoods` (`category_food_id`),
  CONSTRAINT `FK_foods_categoryFoods` FOREIGN KEY (`category_food_id`) REFERENCES `category_foods` (`id`),
  CONSTRAINT `FK_foods_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (1,9,'Thịt ba rọi nướng thơm lừng với sả và gia vị đặc trưng.',NULL,'Ba rọi nướng sả',120000,1,_binary '','Phần'),(2,2,'Thịt bò thăn mềm mại xào cùng cải thìa tươi xanh.',NULL,'Bò xào cải thìa',135000,1,_binary '','Phần'),(3,1,'Món gỏi thanh mát với tôm sú, thịt heo và rau củ.',NULL,'Gỏi tôm thịt',95000,1,_binary '','Phần'),(4,7,'Mì trứng xào bò với phô mai béo ngậy.',NULL,'Mì xào bò phô mai',100000,1,_binary '','Phần'),(5,5,'Đậu hũ trắng kho cùng nấm kim châm và gia vị đậm đà.',NULL,'Đậu hũ kho nấm',75000,1,_binary '','Phần'),(6,8,'Lẩu thịt dê nấu với lá chanh, sả, rau nhúng đa dạng.',NULL,'Lẩu dê lá chanh',250000,1,_binary '','Nồi'),(7,15,'Súp ức gà nấu cùng nấm, cà rốt và hành ngò.',NULL,'Súp gà nấm',70000,1,_binary '','Tô'),(8,10,'Ức gà phi lê chiên vàng với bơ thơm ngậy.',NULL,'Gà chiên bơ',95000,1,_binary '','Phần'),(9,11,'Mực ống xào với sả, ớt và gia vị đậm đà.',NULL,'Mực xào cay',110000,1,_binary '','Phần'),(10,15,'Canh thanh mát với rong biển và trứng gà ta.',NULL,'Canh rong biển trứng',65000,1,_binary '','Tô'),(11,7,'Thịt ba rọi nướng ăn kèm bún tươi, rau sống.',NULL,'Bún thịt nướng',120000,1,_binary '','Tô'),(12,10,'Khoai tây chiên giòn, ăn kèm tương ớt.',NULL,'Khoai tây chiên',45000,1,_binary '','Phần'),(13,5,'Mì trứng xào cùng nấm, cà rốt và cải thìa.',NULL,'Mì xào chay rau củ',85000,1,_binary '','Phần'),(14,5,'Đậu hũ chiên cuốn rau và bún, chấm nước mắm chay.',NULL,'Gỏi cuốn đậu hũ',70000,1,_binary '','Phần'),(15,13,'Bánh mì giòn ăn kèm trứng gà ốp la và pate.',NULL,'Bánh mì ốp la',40000,1,_binary '','Ổ'),(16,8,'Tôm, mực, cá cùng rau lẩu và nước lẩu chua cay.',NULL,'Lẩu hải sản chua cay',280000,1,_binary '','Nồi'),(17,7,'Phở nước truyền thống với thịt bò tái.',NULL,'Phở bò tái',75000,1,_binary '','Tô');
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
  `actions` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name_en` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name_vn` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `functions`
--

LOCK TABLES `functions` WRITE;
/*!40000 ALTER TABLE `functions` DISABLE KEYS */;
INSERT INTO `functions` VALUES (1,'Xem','dashboard','dashboard-profit','Thống kê Lợi nhuận'),(2,'Xem','dashboard','dashboard-orders','Thống kê Đơn món ăn'),(3,'Xem','dashboard','dashboard-input-tickets','Thống kê Phiếu nhập'),(4,'Xem','dashboard','dashboard-human','Thống kê Nhân sự'),(5,'Xem','active','table-histories','Lịch sử bàn ăn'),(6,'Xem|Cập nhật','active','use-tables','Sử dụng bàn ăn'),(7,'Xem|Cập nhật','active','use-foods','Sử dụng món ăn'),(8,'Xem|Cập nhật','active','order-sheets','Phiếu gọi món'),(9,'Xem|Thêm','active','messages','Trò chuyện'),(10,'Xem|Thêm|Cập nhật','active','orders','Đơn món ăn'),(11,'Xem|Thêm|Cập nhật','active','order-tables','Đơn đặt bàn'),(12,'Xem|Thêm|Cập nhật|Khóa','seat','floors','Tầng'),(13,'Xem|Thêm|Cập nhật|Khóa','seat','category-tables','Loại bàn ăn'),(14,'Xem|Thêm|Cập nhật|Khóa','seat','tables','Bàn ăn'),(15,'Xem|Thêm|Cập nhật','food','input-tickets','Phiếu nhập'),(16,'Xem|Thêm|Cập nhật|Khóa','food','suppliers','Nhà cung cấp'),(17,'Xem|Thêm|Cập nhật|Khóa','food','category-ingredients','Loại nguyên liệu'),(18,'Xem|Thêm|Cập nhật|Khóa','food','ingredients','Nguyên liệu'),(19,'Xem|Thêm|Cập nhật|Khóa','food','category-foods','Loại món ăn'),(20,'Xem|Thêm|Cập nhật|Khóa','food','foods','Món ăn'),(21,'Xem','employee','payslips','Bảng lương'),(22,'Xem|Cập nhật','employee','attendances','Chấm công'),(23,'Xem|Thêm|Cập nhật','employee','salary-advances','Ứng lương'),(24,'Xem|Thêm|Cập nhật|Khóa','employee','schedules','Lịch làm'),(25,'Xem|Thêm|Cập nhật|Khóa','employee','shifts','Ca làm'),(26,'Xem|Thêm|Cập nhật|Khóa','employee','category-allowances','Loại phụ cấp'),(27,'Xem|Thêm|Cập nhật|Khóa','employee','allowances','Phụ cấp'),(28,'Xem|Thêm|Cập nhật|Khóa','employee','category-insurances','Loại bảo hiểm'),(29,'Xem|Thêm|Cập nhật|Khóa','employee','insurances','Bảo hiểm'),(30,'Xem|Thêm|Cập nhật|Khóa','employee','category-permission-tickets','Loại đơn xin phép'),(31,'Xem|Thêm|Cập nhật','employee','permission-tickets','Đơn xin phép'),(32,'Xem|Thêm|Cập nhật|Khóa','employee','category-reward-punishes','Loại thưởng - phạt'),(33,'Xem|Thêm|Cập nhật','employee','reward-punishes','Thưởng - Phạt'),(34,'Xem|Thêm|Cập nhật|Khóa','employee','roles','Chức vụ'),(35,'Xem|Thêm|Cập nhật|Khóa','employee','permissions','Quyền hạn'),(36,'Xem|Thêm|Cập nhật|Khóa','employee','employees','Nhân viên');
/*!40000 ALTER TABLE `functions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `handle_payments`
--

DROP TABLE IF EXISTS `handle_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `handle_payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `is_employee_handle` bit(1) DEFAULT NULL,
  `is_handling` bit(1) DEFAULT NULL,
  `pay_method_id` int DEFAULT NULL,
  `pay_total_price` bigint DEFAULT NULL,
  `status` int NOT NULL,
  `use_table_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_handlePayments_useTables` (`use_table_id`),
  KEY `FK_handlePayments_employees` (`employee_id`),
  KEY `FK_handlePayments_payMethods` (`pay_method_id`),
  CONSTRAINT `FK_handlePayments_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_handlePayments_payMethods` FOREIGN KEY (`pay_method_id`) REFERENCES `pay_methods` (`id`),
  CONSTRAINT `FK_handlePayments_useTables` FOREIGN KEY (`use_table_id`) REFERENCES `use_tables` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `handle_payments`
--

LOCK TABLES `handle_payments` WRITE;
/*!40000 ALTER TABLE `handle_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `handle_payments` ENABLE KEYS */;
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
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `note` mediumtext COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  `unit` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
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
INSERT INTO `ingredients` VALUES (1,1,1,'2025-07-01',NULL,95000,20,'Thịt heo ba rọi','Dùng kho hoặc nướng',1,_binary '','kg'),(2,1,1,'2025-07-01',NULL,230000,10,'Thịt bò thăn','Dùng áp chảo hoặc xào',1,_binary '','kg'),(3,1,1,'2025-07-01',NULL,190000,5,'Thịt dê','Làm lẩu hoặc nướng ngũ vị',1,_binary '','kg'),(4,1,2,'2025-07-01',NULL,85000,15,'Ức gà phi lê','Dùng xào hoặc salad',1,_binary '','kg'),(5,1,2,'2025-07-01',NULL,125000,10,'Đùi vịt','Dùng nấu măng hoặc quay',1,_binary '','kg'),(6,1,3,'2025-07-01',NULL,180000,10,'Tôm sú','Hấp, xào hoặc nấu canh',1,_binary '','kg'),(7,1,3,'2025-07-01',NULL,150000,8,'Mực ống','Xào cay hoặc chiên giòn',1,_binary '','kg'),(8,1,3,'2025-07-01',NULL,65000,12,'Cá basa phi lê','Dùng nấu lẩu hoặc chiên sả ớt',1,_binary '','kg'),(9,1,4,'2025-07-01',NULL,5000,100,'Trứng gà ta','Chiên, hấp, kho, tạo kết dính',1,_binary '','quả'),(10,380,4,'2025-07-01',NULL,15000,25,'Sữa đặc','Làm sốt hoặc pha nước chấm',1,_binary '','ml'),(11,1,5,'2025-07-01',NULL,25000,12,'Cải thìa','Luộc hoặc xào tỏi',1,_binary '','kg'),(12,1,5,'2025-07-01',NULL,18000,18,'Rau muống','Xào tỏi, ăn lẩu',1,_binary '','kg'),(13,1,6,'2025-07-01',NULL,18000,18,'Cà rốt','Tạo màu và vị ngọt tự nhiên',1,_binary '','kg'),(14,1,6,'2025-07-01',NULL,22000,14,'Khoai tây','Chiên, nấu súp, ninh',1,_binary '','kg'),(15,500,7,'2025-07-01',NULL,3000,50,'Muối hột','Nêm nếm cơ bản',1,_binary '','g'),(16,1000,7,'2025-07-01',NULL,10000,40,'Đường cát trắng','Tạo vị ngọt, làm caramel',1,_binary '','g'),(17,500,8,'2025-07-01',NULL,18000,30,'Nước mắm Nam Ngư','Nước chấm hoặc ướp',1,_binary '','ml'),(18,450,8,'2025-07-01',NULL,21000,20,'Dầu hào','Tạo độ bóng và vị mặn ngọt',1,_binary '','ml'),(19,1000,9,'2025-07-01',NULL,45000,25,'Dầu ăn Tường An','Chiên, xào',1,_binary '','ml'),(20,200,9,'2025-07-01',NULL,12000,10,'Bơ thực vật','Tạo mùi thơm và béo cho món Âu',1,_binary '','g'),(21,1,10,'2025-07-01',NULL,3000,60,'Đậu hũ trắng','Kho, chiên, xào',1,_binary '','miếng'),(22,150,10,'2025-07-01',NULL,15000,8,'Nấm kim châm','Dùng lẩu hoặc xào chay',1,_binary '','g'),(23,500,11,'2025-07-01',NULL,10000,20,'Bún tươi','Ăn cùng nước lèo hoặc thịt nướng',1,_binary '','g'),(24,300,11,'2025-07-01',NULL,8000,25,'Mì trứng khô','Luộc, xào, làm mì nước',1,_binary '','g'),(25,200,12,'2025-07-01',NULL,12000,15,'Miến dong khô','Ngâm nước rồi nấu canh hoặc xào',1,_binary '','g'),(26,100,12,'2025-07-01',NULL,15000,10,'Rong biển khô','Làm canh rong biển',1,_binary '','g'),(27,50,13,'2025-07-01',NULL,7000,10,'Lá chanh','Khử mùi, tạo hương thơm',1,_binary '','g'),(28,1,13,'2025-07-01',NULL,2000,30,'Sả cây','Dùng ướp, nấu lẩu',1,_binary '','cây'),(29,100,13,'2025-07-01',NULL,6000,20,'Gừng tươi','Khử mùi tanh và tăng hương vị',1,_binary '','g'),(30,1,4,'2025-07-01',NULL,5000,40,'Phô mai lát','Làm topping cho mì, bánh mì',1,_binary '','miếng');
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
  `price` bigint DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
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
INSERT INTO `input_ticket_details` VALUES (1,1,95000,50),(1,6,95000,10),(1,10,95000,53),(1,19,95000,82),(1,21,95000,28),(2,1,230000,20),(2,14,230000,21),(2,22,230000,41),(3,5,190000,93),(3,13,190000,98),(4,3,85000,26),(4,9,85000,87),(4,11,85000,89),(5,2,125000,31),(5,5,125000,53),(5,8,125000,36),(5,19,125000,56),(5,20,125000,92),(6,2,180000,77),(6,4,180000,52),(6,7,180000,48),(6,9,180000,53),(6,11,180000,38),(7,2,150000,58),(7,4,150000,59),(7,16,150000,34),(7,18,150000,42),(7,20,150000,59),(8,8,65000,13),(8,11,65000,37),(8,13,65000,60),(8,16,65000,43),(8,17,65000,43),(9,6,5000,97),(9,12,5000,21),(9,17,5000,48),(9,18,5000,48),(9,21,5000,53),(10,5,15000,66),(10,12,15000,38),(10,19,15000,50),(10,20,15000,51),(11,6,25000,28),(11,13,25000,70),(11,17,25000,29),(11,20,25000,11),(12,2,18000,60),(12,4,18000,36),(12,6,18000,48),(12,7,18000,55),(12,9,18000,43),(12,10,18000,20),(12,21,18000,36),(13,1,18000,50),(13,2,18000,58),(13,12,18000,68),(13,16,18000,67),(14,1,22000,50),(14,3,22000,23),(14,5,22000,32),(14,18,22000,34),(15,9,3000,60),(15,13,3000,29),(15,15,3000,23),(15,19,3000,67),(15,22,3000,18),(16,6,10000,83),(16,15,10000,23),(16,16,10000,66),(17,4,18000,57),(17,7,18000,47),(17,10,18000,25),(17,12,18000,97),(17,15,18000,33),(17,22,18000,29),(18,3,21000,74),(18,5,21000,42),(18,8,21000,84),(18,14,21000,20),(18,16,21000,78),(18,20,21000,72),(19,3,45000,55),(19,8,45000,83),(19,10,45000,85),(19,13,45000,42),(19,14,45000,97),(20,4,12000,75),(20,22,12000,30);
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
  `pay_status` bit(1) NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` tinyint NOT NULL,
  `supplier_id` int NOT NULL,
  `total_price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_inputTickets_restaurants` (`restaurant_id`),
  KEY `FK_inputTickets_employees` (`employee_id`),
  KEY `FK_inputTickets_suppliers` (`supplier_id`),
  CONSTRAINT `FK_inputTickets_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_inputTickets_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_inputTickets_suppliers` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `input_tickets`
--

LOCK TABLES `input_tickets` WRITE;
/*!40000 ALTER TABLE `input_tickets` DISABLE KEYS */;
INSERT INTO `input_tickets` VALUES (1,'2025-03-22 08:17:22',1,_binary '',1,3,2,11350000),(2,'2025-04-01 08:17:22',5,_binary '\0',1,0,2,28559000),(3,'2025-03-23 08:17:22',5,_binary '\0',1,1,1,6745000),(4,'2025-04-01 08:17:22',5,_binary '',1,1,3,20784000),(5,'2025-03-23 08:17:22',5,_binary '',1,2,7,26871000),(6,'2025-04-02 08:17:22',1,_binary '',1,2,5,3829000),(7,'2025-03-24 08:17:22',1,_binary '',1,3,5,10476000),(8,'2025-04-03 08:17:22',1,_binary '\0',1,0,7,10844000),(9,'2025-03-25 08:17:22',5,_binary '\0',1,2,6,17889000),(10,'2025-04-03 08:17:22',1,_binary '\0',1,1,8,9670000),(11,'2025-03-26 08:17:22',5,_binary '',1,3,8,16810000),(12,'2025-04-04 08:17:22',5,_binary '\0',1,0,6,3645000),(13,'2025-03-27 08:17:22',1,_binary '',1,2,10,26247000),(14,'2025-04-05 08:17:22',5,_binary '\0',1,3,9,9615000),(15,'2025-03-28 08:17:22',1,_binary '\0',1,0,11,893000),(16,'2025-04-06 08:17:22',1,_binary '\0',1,3,11,11399000),(17,'2025-03-29 08:17:22',5,_binary '\0',1,0,3,3760000),(18,'2025-04-07 08:17:22',1,_binary '',1,2,7,7288000),(19,'2025-03-30 08:17:22',5,_binary '\0',1,1,4,15741000),(20,'2025-04-08 08:17:22',5,_binary '\0',1,2,3,22902000),(21,'2025-03-31 08:17:22',1,_binary '\0',1,0,2,3573000),(22,'2025-04-09 08:17:22',5,_binary '',1,0,3,10366000);
/*!40000 ALTER TABLE `input_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance_details`
--

DROP TABLE IF EXISTS `insurance_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance_details` (
  `category_insurance_id` int NOT NULL,
  `employee_id` int NOT NULL,
  `insurance_id` int NOT NULL,
  PRIMARY KEY (`category_insurance_id`,`employee_id`,`insurance_id`),
  KEY `FK_insuranceDetails_insurances` (`insurance_id`),
  KEY `FK_insuranceDetails_employees` (`employee_id`),
  CONSTRAINT `FK_insuranceDetails_categoryInsurances` FOREIGN KEY (`category_insurance_id`) REFERENCES `category_insurances` (`id`),
  CONSTRAINT `FK_insuranceDetails_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_insuranceDetails_insurances` FOREIGN KEY (`insurance_id`) REFERENCES `insurances` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance_details`
--

LOCK TABLES `insurance_details` WRITE;
/*!40000 ALTER TABLE `insurance_details` DISABLE KEYS */;
INSERT INTO `insurance_details` VALUES (1,1,1),(2,1,1),(3,1,1);
/*!40000 ALTER TABLE `insurance_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurances`
--

DROP TABLE IF EXISTS `insurances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `note` mediumtext COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_insurances_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_insurances_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurances`
--

LOCK TABLES `insurances` WRITE;
/*!40000 ALTER TABLE `insurances` DISABLE KEYS */;
INSERT INTO `insurances` VALUES (1,'2026-02','Bảo hiểm tháng 02/2026','',1,_binary '');
/*!40000 ALTER TABLE `insurances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managers`
--

DROP TABLE IF EXISTS `managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `managers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` text COLLATE utf8mb4_general_ci,
  `birthday` date DEFAULT NULL,
  `create_at` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `gender` bit(1) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `status` bit(1) NOT NULL,
  `user_id` int NOT NULL,
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
INSERT INTO `managers` VALUES (1,'',NULL,'2025-12-02 00:00:00',NULL,'thanhquy@gmail.com','Chủ cửa hàng Thanh Quy',NULL,NULL,'0000000001',_binary '',2),(2,'',NULL,'2025-12-02 00:00:00',NULL,'phuoclong@gmail.com','Chủ nhà hàng Phước Long',NULL,NULL,'0000000002',_binary '',3);
/*!40000 ALTER TABLE `managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_details`
--

DROP TABLE IF EXISTS `message_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_details` (
  `is_admin_send` bit(1) NOT NULL,
  `message_id` int NOT NULL,
  `send_at` datetime NOT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`is_admin_send`,`message_id`,`send_at`),
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
  `is_read` bit(1) DEFAULT NULL,
  `restaurant_id` int NOT NULL,
  `use_table_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_messages_restaurants` (`restaurant_id`),
  KEY `FK_messages_useTables` (`use_table_id`),
  CONSTRAINT `FK_messages_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_messages_useTables` FOREIGN KEY (`use_table_id`) REFERENCES `use_tables` (`id`)
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
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_details` (
  `food_id` int NOT NULL,
  `order_id` int NOT NULL,
  `price` bigint DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
  PRIMARY KEY (`food_id`,`order_id`),
  KEY `FK_orderDetails_orders` (`order_id`),
  CONSTRAINT `FK_orderDetails_foods` FOREIGN KEY (`food_id`) REFERENCES `foods` (`id`),
  CONSTRAINT `FK_orderDetails_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,1,120000,1),(3,1,95000,1),(12,1,45000,1);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
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
  `price` bigint DEFAULT NULL,
  `quantity` bigint DEFAULT NULL,
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
INSERT INTO `order_sheet_details` VALUES (1,1,120000,2),(4,1,100000,4),(9,1,110000,1);
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
  `message` text COLLATE utf8mb4_general_ci,
  `note` text COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `service_at` datetime DEFAULT NULL,
  `status` tinyint NOT NULL,
  `table_id` int NOT NULL,
  `total_price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orderSheets_restaurants` (`restaurant_id`),
  KEY `FK_orderSheets_employees` (`employee_id`),
  KEY `FK_orderSheets_tables` (`table_id`),
  CONSTRAINT `FK_orderSheets_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_orderSheets_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_orderSheets_tables` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_sheets`
--

LOCK TABLES `order_sheets` WRITE;
/*!40000 ALTER TABLE `order_sheets` DISABLE KEYS */;
INSERT INTO `order_sheets` VALUES (1,'2026-01-11 00:00:00',NULL,NULL,NULL,1,NULL,0,1,750000);
/*!40000 ALTER TABLE `order_sheets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_tables`
--

DROP TABLE IF EXISTS `order_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `arrive_at` datetime NOT NULL,
  `create_at` datetime NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `customer_fullname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `customer_id` int NOT NULL,
  `customer_note` mediumtext COLLATE utf8mb4_general_ci,
  `customer_phone` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `employee_id` int DEFAULT NULL,
  `guests` int NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orderTables_restaurants` (`restaurant_id`),
  KEY `FK_orderTables_employees` (`employee_id`),
  KEY `FK_orderTables_customers` (`customer_id`),
  CONSTRAINT `FK_orderTables_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK_orderTables_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_orderTables_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_tables`
--

LOCK TABLES `order_tables` WRITE;
/*!40000 ALTER TABLE `order_tables` DISABLE KEYS */;
INSERT INTO `order_tables` VALUES (1,'2025-12-10 12:00:00','2025-12-06 00:00:00','1@gmail.com','1',1,NULL,'1111111111',NULL,4,1,0),(2,'2025-12-12 12:00:00','2025-12-06 00:00:00','2@gmail.com','2',1,NULL,'2222222222',1,2,1,2),(3,'2025-12-15 12:00:00','2025-12-06 00:00:00','3@gmail.com','3',1,NULL,'3333333333',1,1,1,1);
/*!40000 ALTER TABLE `order_tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime NOT NULL,
  `customer_email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `customer_fullname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `customer_id` int NOT NULL,
  `customer_phone` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `employee_id` int NOT NULL,
  `pay_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `pay_method_id` int NOT NULL,
  `pay_status` bit(1) NOT NULL,
  `pay_time` datetime(6) NOT NULL,
  `pay_total_price` bigint NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` tinyint NOT NULL,
  `total_price` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_orders_restaurants` (`restaurant_id`),
  KEY `FK_orders_employees` (`employee_id`),
  KEY `FK_orders_customers` (`customer_id`),
  CONSTRAINT `FK_orders_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK_orders_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_orders_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2025-07-21 10:00:00','khachhang@gmail.com','Khách hàng',1,'0000000000',1,'thanh-toan-bang-tien-mat-1',1,_binary '','2025-07-21 10:00:00.000000',260000,1,2,260000);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pay_methods`
--

DROP TABLE IF EXISTS `pay_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pay_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pay_methods`
--

LOCK TABLES `pay_methods` WRITE;
/*!40000 ALTER TABLE `pay_methods` DISABLE KEYS */;
INSERT INTO `pay_methods` VALUES (1,'money-image.png','Thanh toán bằng tiền mặt'),(2,'atm-logo.png','Thanh toán bằng ngân hàng'),(3,'visa-master-jcb-logo.png','Thanh toán bằng Visa/Master/JCB'),(4,'momo-logo.png','Thanh toán ví MoMo'),(5,'zalopay-logo.png','Thanh toán ví ZaloPay'),(6,'vnpay-logo.png','Thanh toán bằng ví VNPay');
/*!40000 ALTER TABLE `pay_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_details`
--

DROP TABLE IF EXISTS `permission_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_details` (
  `action` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
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
INSERT INTO `permission_details` VALUES ('Cập nhật',6,1),('Cập nhật',7,1),('Cập nhật',8,1),('Cập nhật',10,1),('Cập nhật',11,1),('Cập nhật',12,1),('Cập nhật',13,1),('Cập nhật',14,1),('Cập nhật',15,1),('Cập nhật',16,1),('Cập nhật',17,1),('Cập nhật',18,1),('Cập nhật',19,1),('Cập nhật',20,1),('Cập nhật',22,1),('Cập nhật',23,1),('Cập nhật',24,1),('Cập nhật',25,1),('Cập nhật',26,1),('Cập nhật',27,1),('Cập nhật',28,1),('Cập nhật',29,1),('Cập nhật',30,1),('Cập nhật',31,1),('Cập nhật',32,1),('Cập nhật',33,1),('Cập nhật',34,1),('Cập nhật',35,1),('Cập nhật',36,1),('Khóa',12,1),('Khóa',13,1),('Khóa',14,1),('Khóa',16,1),('Khóa',17,1),('Khóa',18,1),('Khóa',19,1),('Khóa',20,1),('Khóa',24,1),('Khóa',25,1),('Khóa',26,1),('Khóa',27,1),('Khóa',28,1),('Khóa',29,1),('Khóa',30,1),('Khóa',32,1),('Khóa',34,1),('Khóa',35,1),('Khóa',36,1),('Thêm',9,1),('Thêm',10,1),('Thêm',11,1),('Thêm',12,1),('Thêm',13,1),('Thêm',14,1),('Thêm',15,1),('Thêm',16,1),('Thêm',17,1),('Thêm',18,1),('Thêm',19,1),('Thêm',20,1),('Thêm',23,1),('Thêm',24,1),('Thêm',25,1),('Thêm',26,1),('Thêm',27,1),('Thêm',28,1),('Thêm',29,1),('Thêm',30,1),('Thêm',31,1),('Thêm',32,1),('Thêm',33,1),('Thêm',34,1),('Thêm',35,1),('Thêm',36,1),('Xem',1,1),('Xem',2,1),('Xem',3,1),('Xem',4,1),('Xem',5,1),('Xem',6,1),('Xem',7,1),('Xem',8,1),('Xem',9,1),('Xem',10,1),('Xem',11,1),('Xem',12,1),('Xem',13,1),('Xem',14,1),('Xem',15,1),('Xem',16,1),('Xem',17,1),('Xem',18,1),('Xem',19,1),('Xem',20,1),('Xem',21,1),('Xem',22,1),('Xem',23,1),('Xem',24,1),('Xem',25,1),('Xem',26,1),('Xem',27,1),('Xem',28,1),('Xem',29,1),('Xem',30,1),('Xem',31,1),('Xem',32,1),('Xem',33,1),('Xem',34,1),('Xem',35,1),('Xem',36,1),('Cập nhật',6,2),('Cập nhật',7,2),('Cập nhật',8,2),('Cập nhật',10,2),('Cập nhật',11,2),('Thêm',9,2),('Thêm',10,2),('Thêm',11,2),('Xem',2,2),('Xem',5,2),('Xem',6,2),('Xem',7,2),('Xem',8,2),('Xem',9,2),('Xem',10,2),('Xem',11,2),('Cập nhật',12,3),('Cập nhật',13,3),('Cập nhật',14,3),('Khóa',12,3),('Khóa',13,3),('Khóa',14,3),('Thêm',12,3),('Thêm',13,3),('Thêm',14,3),('Xem',12,3),('Xem',13,3),('Xem',14,3),('Cập nhật',15,4),('Cập nhật',16,4),('Cập nhật',17,4),('Cập nhật',18,4),('Cập nhật',19,4),('Cập nhật',20,4),('Khóa',16,4),('Khóa',17,4),('Khóa',18,4),('Khóa',19,4),('Khóa',20,4),('Thêm',15,4),('Thêm',16,4),('Thêm',17,4),('Thêm',18,4),('Thêm',19,4),('Thêm',20,4),('Xem',3,4),('Xem',15,4),('Xem',16,4),('Xem',17,4),('Xem',18,4),('Xem',19,4),('Xem',20,4),('Cập nhật',22,5),('Cập nhật',23,5),('Cập nhật',24,5),('Cập nhật',25,5),('Cập nhật',26,5),('Cập nhật',27,5),('Cập nhật',28,5),('Cập nhật',29,5),('Cập nhật',30,5),('Cập nhật',31,5),('Cập nhật',32,5),('Cập nhật',33,5),('Cập nhật',34,5),('Cập nhật',35,5),('Cập nhật',36,5),('Khóa',24,5),('Khóa',25,5),('Khóa',26,5),('Khóa',27,5),('Khóa',28,5),('Khóa',29,5),('Khóa',30,5),('Khóa',32,5),('Khóa',34,5),('Khóa',35,5),('Khóa',36,5),('Thêm',23,5),('Thêm',24,5),('Thêm',25,5),('Thêm',26,5),('Thêm',27,5),('Thêm',28,5),('Thêm',29,5),('Thêm',30,5),('Thêm',31,5),('Thêm',32,5),('Thêm',33,5),('Thêm',34,5),('Thêm',35,5),('Thêm',36,5),('Xem',5,5),('Xem',20,5),('Xem',22,5),('Xem',23,5),('Xem',24,5),('Xem',25,5),('Xem',26,5),('Xem',27,5),('Xem',28,5),('Xem',29,5),('Xem',30,5),('Xem',31,5),('Xem',32,5),('Xem',33,5),('Xem',34,5),('Xem',35,5),('Xem',36,5);
/*!40000 ALTER TABLE `permission_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_tickets`
--

DROP TABLE IF EXISTS `permission_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_permission_ticket_id` int NOT NULL,
  `create_at` datetime NOT NULL,
  `date` date NOT NULL,
  `employee_handle_id` int DEFAULT NULL,
  `employee_main_id` int NOT NULL,
  `reason` mediumtext COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `status` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_permissionTickets_restaurants` (`restaurant_id`),
  KEY `FK_permissionTickets_employees_handle` (`employee_handle_id`),
  KEY `FK_permissionTickets_employees_main` (`employee_main_id`),
  KEY `FK_permissionTickets_categoryPermissionTickets` (`category_permission_ticket_id`),
  CONSTRAINT `FK_permissionTickets_categoryPermissionTickets` FOREIGN KEY (`category_permission_ticket_id`) REFERENCES `category_permission_tickets` (`id`),
  CONSTRAINT `FK_permissionTickets_employees_handle` FOREIGN KEY (`employee_handle_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_permissionTickets_employees_main` FOREIGN KEY (`employee_main_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_permissionTickets_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_tickets`
--

LOCK TABLES `permission_tickets` WRITE;
/*!40000 ALTER TABLE `permission_tickets` DISABLE KEYS */;
INSERT INTO `permission_tickets` VALUES (1,3,'2026-02-06 00:00:00','2026-02-01',1,1,'có việc cá nhân cần nghỉ làm',1,0);
/*!40000 ALTER TABLE `permission_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
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
INSERT INTO `permissions` VALUES (1,'Quản lý',1,_binary ''),(2,'Quản lý vận hàng',1,_binary ''),(3,'Quản lý chỗ ngồi',1,_binary ''),(4,'Quản lý kho hàng',1,_binary ''),(5,'Quản lý nhân sự',1,_binary ''),(6,'Nhân viên phục vụ',1,_binary ''),(7,'Nhân viên thực tập',1,_binary '');
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
  `note` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
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
INSERT INTO `recipes` VALUES (1,1,'1kg thịt ba rọi',1),(1,17,'500ml nước mắm',1),(1,19,'1000ml dầu ăn',1),(1,28,'1 cây sả',1),(1,29,'100g gừng',1),(2,2,'1kg thịt bò thăn',1),(2,11,'1kg cải thìa',1),(2,17,'500ml nước mắm',1),(2,18,'450ml dầu hào',1),(2,19,'1000ml dầu ăn',1),(3,1,'1kg thịt ba rọi',1),(3,6,'1kg tôm sú',1),(3,13,'1kg cà rốt',1),(3,16,'1000g đường',1),(3,17,'500ml nước mắm',1),(4,2,'1kg bò thăn',1),(4,19,'1 lít dầu ăn',1),(4,24,'300g mì trứng',1),(4,30,'2 miếng phô mai',2),(5,15,'500g muối hột',1),(5,17,'500ml nước mắm',1),(5,21,'2 miếng đậu hũ',2),(5,22,'150g nấm kim châm',1),(5,29,'100g gừng',1),(6,3,'1kg thịt dê',1),(6,12,'1kg rau muống',1),(6,27,'50g lá chanh',1),(6,28,'2 cây sả',2),(6,29,'100g gừng',1),(7,4,'1kg ức gà',1),(7,13,'1kg cà rốt',1),(7,15,'500g muối',1),(7,19,'1 lít dầu ăn',1),(7,22,'150g nấm kim châm',1),(8,4,'1kg ức gà phi lê',1),(8,15,'500g muối hột để ướp nhẹ',1),(8,19,'1 lít dầu ăn để chiên',1),(8,20,'200g bơ thực vật',1),(9,7,'1kg mực ống',1),(9,17,'500ml nước mắm',1),(9,19,'1 lít dầu ăn',1),(9,28,'1 cây sả băm nhỏ',1),(9,29,'100g gừng lát',1),(10,9,'2 quả trứng gà ta',2),(10,13,'1kg cà rốt',1),(10,15,'500g muối hột',1),(10,26,'100g rong biển khô',1),(11,1,'1kg thịt ba rọi nướng',1),(11,13,'1kg cà rốt ngâm chua',1),(11,17,'500ml nước mắm pha',1),(11,23,'500g bún tươi',1),(11,27,'50g lá chanh trang trí',1),(12,14,'1kg khoai tây',1),(12,15,'500g muối hột',1),(12,19,'1 lít dầu ăn',1),(13,11,'1kg cải thìa',1),(13,13,'1kg cà rốt',1),(13,19,'1 lít dầu ăn',1),(13,22,'150g nấm kim châm',1),(13,24,'300g mì trứng',1),(14,13,'1kg cà rốt bào sợi',1),(14,17,'500ml nước mắm chay pha loãng',1),(14,21,'2 miếng đậu hũ chiên',2),(14,23,'500g bún tươi',1),(15,9,'2 quả trứng gà ốp la',2),(15,20,'200g bơ thực vật',1),(16,6,'1kg tôm sú',1),(16,7,'1kg mực ống',1),(16,8,'1kg cá basa phi lê',1),(16,12,'1kg rau muống',1),(16,28,'2 cây sả đập dập',2),(16,29,'100g gừng',1),(17,2,'1kg thịt bò thăn',1),(17,15,'500g muối hột',1),(17,17,'500ml nước mắm',1),(17,25,'200g miến dong khô dùng thay bánh phở',1),(17,29,'100g gừng nướng để làm nước dùng',1);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_images`
--

DROP TABLE IF EXISTS `restaurant_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_images` (
  `image` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
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
  `address` text COLLATE utf8mb4_general_ci NOT NULL,
  `create_at` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `manager_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(11) COLLATE utf8mb4_general_ci NOT NULL,
  `rating` float NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKfe6aq2gbudopv20yl6b77798m` (`email`),
  UNIQUE KEY `UKr1mxr41imimdysdpjttdiiv4k` (`phone`),
  KEY `FK_restaurants_managers` (`manager_id`),
  CONSTRAINT `FK_restaurants_managers` FOREIGN KEY (`manager_id`) REFERENCES `managers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurants`
--

LOCK TABLES `restaurants` WRITE;
/*!40000 ALTER TABLE `restaurants` DISABLE KEYS */;
INSERT INTO `restaurants` VALUES (1,'','2025-12-02 00:00:00',NULL,'thanhquy@gmail.com',2,'Nhà hàng Thanh Quy','0000000000',5,_binary ''),(2,'','2025-12-02 00:00:00',NULL,'phuoclong@gmail.com',2,'Nhà hàng Phước Long','0000000001',4.5,_binary '');
/*!40000 ALTER TABLE `restaurants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_punishes`
--

DROP TABLE IF EXISTS `reward_punishes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_punishes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_reward_punish_id` int NOT NULL,
  `create_at` datetime NOT NULL,
  `date` date NOT NULL,
  `employee_handle_id` int DEFAULT NULL,
  `employee_main_id` int NOT NULL,
  `money` bigint NOT NULL,
  `reason` mediumtext COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `status` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_rewardPunishes_restaurants` (`restaurant_id`),
  KEY `FK_rewardPunishes_employees_handle` (`employee_handle_id`),
  KEY `FK_rewardPunishes_employees_main` (`employee_main_id`),
  KEY `FK_rewardPunishes_categoryRewardPunishes` (`category_reward_punish_id`),
  CONSTRAINT `FK_rewardPunishes_categoryRewardPunishes` FOREIGN KEY (`category_reward_punish_id`) REFERENCES `category_reward_punishes` (`id`),
  CONSTRAINT `FK_rewardPunishes_employees_handle` FOREIGN KEY (`employee_handle_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_rewardPunishes_employees_main` FOREIGN KEY (`employee_main_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_rewardPunishes_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_punishes`
--

LOCK TABLES `reward_punishes` WRITE;
/*!40000 ALTER TABLE `reward_punishes` DISABLE KEYS */;
INSERT INTO `reward_punishes` VALUES (1,3,'2026-02-06 00:00:00','2026-02-01',1,1,200000,'thấy siêng thưởng thêm',1,0);
/*!40000 ALTER TABLE `reward_punishes` ENABLE KEYS */;
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
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `salary_type` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `salary_value` bigint NOT NULL,
  `status` bit(1) NOT NULL,
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
INSERT INTO `roles` VALUES (1,'Quản lý',1,'Lương cố định',20000000,_binary ''),(2,'Quản lý vận hàng',1,'Lương cố định',10000000,_binary ''),(3,'Quản lý chỗ ngồi',1,'Lương cố định',9000000,_binary ''),(4,'Quản lý kho hàng',1,'Lương cố định',9200000,_binary ''),(5,'Quản lý nhân sự',1,'Lương cố định',9500000,_binary ''),(6,'Nhân viên phục vụ',1,'Lương cố định',7000000,_binary ''),(7,'Nhân viên thực tập',1,'Lương theo giờ',22000,_binary '');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_advances`
--

DROP TABLE IF EXISTS `salary_advances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_advances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `create_at` datetime NOT NULL,
  `date` date NOT NULL,
  `employee_handle_id` int DEFAULT NULL,
  `employee_main_id` int NOT NULL,
  `money` bigint NOT NULL,
  `reason` mediumtext COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `status` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_salaryAdvances_restaurants` (`restaurant_id`),
  KEY `FK_salaryAdvances_employees_handle` (`employee_handle_id`),
  KEY `FK_salaryAdvances_employees_main` (`employee_main_id`),
  CONSTRAINT `FK_salaryAdvances_employees_handle` FOREIGN KEY (`employee_handle_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_salaryAdvances_employees_main` FOREIGN KEY (`employee_main_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_salaryAdvances_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_advances`
--

LOCK TABLES `salary_advances` WRITE;
/*!40000 ALTER TABLE `salary_advances` DISABLE KEYS */;
INSERT INTO `salary_advances` VALUES (1,'2026-02-06 00:00:00','2026-02-01',1,1,2000000,'gia đình có chuyện cần ứng lương trước',1,0);
/*!40000 ALTER TABLE `salary_advances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_employees`
--

DROP TABLE IF EXISTS `schedule_employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule_employees` (
  `employee_id` int NOT NULL,
  `schedule_id` int NOT NULL,
  PRIMARY KEY (`employee_id`,`schedule_id`),
  KEY `FK_scheduleEmployees_employees_schedule` (`schedule_id`),
  CONSTRAINT `FK_scheduleEmployees_employees_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_scheduleEmployees_employees_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_employees`
--

LOCK TABLES `schedule_employees` WRITE;
/*!40000 ALTER TABLE `schedule_employees` DISABLE KEYS */;
INSERT INTO `schedule_employees` VALUES (1,1);
/*!40000 ALTER TABLE `schedule_employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedule_shifts`
--

DROP TABLE IF EXISTS `schedule_shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedule_shifts` (
  `schedule_id` int NOT NULL,
  `shift_id` int NOT NULL,
  PRIMARY KEY (`schedule_id`,`shift_id`),
  KEY `FK_scheduleShifts_shifts_shift` (`shift_id`),
  CONSTRAINT `FK_scheduleShifts_shifts_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`),
  CONSTRAINT `FK_scheduleShifts_shifts_shift` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedule_shifts`
--

LOCK TABLES `schedule_shifts` WRITE;
/*!40000 ALTER TABLE `schedule_shifts` DISABLE KEYS */;
INSERT INTO `schedule_shifts` VALUES (1,1);
/*!40000 ALTER TABLE `schedule_shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_end` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date_start` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `note` mediumtext COLLATE utf8mb4_general_ci,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_schedules_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_schedules_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,'2026-02-28','2026-02-01','Lịch làm tháng 02/2026','Lịch làm cố định dành cho tháng 2',1,_binary '');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shift_details`
--

DROP TABLE IF EXISTS `shift_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shift_details` (
  `day_of_week` int NOT NULL,
  `shift_id` int NOT NULL,
  `time_end` time NOT NULL,
  `time_start` time NOT NULL,
  PRIMARY KEY (`day_of_week`,`shift_id`,`time_end`,`time_start`),
  KEY `FK_shiftDetails_shifts` (`shift_id`),
  CONSTRAINT `FK_shiftDetails_shifts` FOREIGN KEY (`shift_id`) REFERENCES `shifts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shift_details`
--

LOCK TABLES `shift_details` WRITE;
/*!40000 ALTER TABLE `shift_details` DISABLE KEYS */;
INSERT INTO `shift_details` VALUES (1,1,'12:00:00','07:00:00'),(2,1,'12:00:00','07:00:00'),(3,1,'12:00:00','07:00:00'),(4,1,'12:00:00','07:00:00'),(5,1,'12:00:00','07:00:00'),(6,1,'12:00:00','07:00:00'),(7,1,'12:00:00','07:00:00'),(1,2,'17:00:00','12:00:00'),(2,2,'17:00:00','12:00:00'),(3,2,'17:00:00','12:00:00'),(4,2,'17:00:00','12:00:00'),(5,2,'17:00:00','12:00:00'),(6,2,'17:00:00','12:00:00'),(7,2,'17:00:00','12:00:00'),(1,3,'22:00:00','17:00:00'),(2,3,'22:00:00','17:00:00'),(3,3,'22:00:00','17:00:00'),(4,3,'22:00:00','17:00:00'),(5,3,'22:00:00','17:00:00'),(6,3,'22:00:00','17:00:00'),(7,3,'22:00:00','17:00:00'),(1,4,'12:00:00','07:00:00'),(2,5,'12:00:00','07:00:00'),(3,6,'12:00:00','07:00:00'),(4,7,'12:00:00','07:00:00'),(5,8,'12:00:00','07:00:00'),(6,9,'12:00:00','07:00:00'),(7,10,'12:00:00','07:00:00'),(1,11,'17:00:00','12:00:00'),(2,12,'17:00:00','12:00:00'),(3,13,'17:00:00','12:00:00'),(4,14,'17:00:00','12:00:00'),(5,15,'17:00:00','12:00:00'),(6,16,'17:00:00','12:00:00'),(7,17,'17:00:00','12:00:00'),(1,18,'22:00:00','17:00:00'),(2,19,'22:00:00','17:00:00'),(3,20,'22:00:00','17:00:00'),(4,21,'22:00:00','17:00:00'),(5,22,'22:00:00','17:00:00'),(6,23,'22:00:00','17:00:00'),(7,24,'22:00:00','17:00:00');
/*!40000 ALTER TABLE `shift_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shifts`
--

DROP TABLE IF EXISTS `shifts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shifts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_shifts_restaurants` (`restaurant_id`),
  CONSTRAINT `FK_shifts_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shifts`
--

LOCK TABLES `shifts` WRITE;
/*!40000 ALTER TABLE `shifts` DISABLE KEYS */;
INSERT INTO `shifts` VALUES (1,'Ca sáng đủ ngày',1,_binary ''),(2,'Ca chiều đủ ngày',1,_binary ''),(3,'Ca tối đủ ngày',1,_binary ''),(4,'Ca sáng thứ 2',1,_binary ''),(5,'Ca sáng thứ 3',1,_binary ''),(6,'Ca sáng thứ 4',1,_binary ''),(7,'Ca sáng thứ 5',1,_binary ''),(8,'Ca sáng thứ 6',1,_binary ''),(9,'Ca sáng thứ 7',1,_binary ''),(10,'Ca sáng Chủ nhật',1,_binary ''),(11,'Ca chiều thứ 2',1,_binary ''),(12,'Ca chiều thứ 3',1,_binary ''),(13,'Ca chiều thứ 4',1,_binary ''),(14,'Ca chiều thứ 5',1,_binary ''),(15,'Ca chiều thứ 6',1,_binary ''),(16,'Ca chiều thứ 7',1,_binary ''),(17,'Ca chiều Chủ nhật',1,_binary ''),(18,'Ca tối thứ 2',1,_binary ''),(19,'Ca tối thứ 3',1,_binary ''),(20,'Ca tối thứ 4',1,_binary ''),(21,'Ca tối thứ 5',1,_binary ''),(22,'Ca tối thứ 6',1,_binary ''),(23,'Ca tối thứ 7',1,_binary ''),(24,'Ca tối Chủ nhật',1,_binary '');
/*!40000 ALTER TABLE `shifts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` text COLLATE utf8mb4_general_ci,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `phone` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `restaurant_id` int NOT NULL,
  `status` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'123 Đường Nguyễn Trãi, Phường 5, TP.HCM','contact@thucphamsachviet.vn','Công ty TNHH Thực Phẩm Sạch Việt','0909123456',1,_binary ''),(2,'45 Lê Văn Lương, Phường Nhân Chính, Hà Nội','info@rauquamn.vn','Công ty Cổ phần Rau Quả Miền Bắc','0912345678',1,_binary ''),(3,'88 Trường Chinh, Phường Phương Mai, Hà Nội','support@antamfoods.vn','Công ty TNHH Nông Sản An Tâm','0988765432',1,_binary ''),(4,'12 Võ Văn Kiệt, Phường Nguyễn Thái Bình, TP.HCM','sales@biendongseafood.vn','Công ty TNHH Thủy Hải Sản Biển Đông','0933555777',1,_binary ''),(5,'Ấp 3, Xã Tân Phú Trung, TP.HCM','dongxanhorganic@gmail.com','HTX Nông nghiệp Hữu cơ Đồng Xanh','0944666888',1,_binary ''),(6,'Số 10, Đường Tỉnh Lộ 10, Phường Tân Tạo, TP.HCM','gaosach@ankhang.vn','Công ty TNHH Gạo Sạch An Khang','0977111222',1,_binary ''),(7,'Số 5, QL1A, Phường 10, TP. Mỹ Tho, Tiền Giang','fruit.south@traicaynb.vn','Công ty TNHH Trái Cây Nam Bộ','0909888777',1,_binary ''),(8,'Thôn Trạm Hành, Xã Trạm Hành, TP. Đà Lạt, Lâm Đồng','daxanh.rau@gmail.com','HTX Rau Sạch Đà Lạt Xanh','0966333444',1,_binary ''),(9,'Tổ 1, Phường Dương Đông, TP. Phú Quốc, Kiên Giang','phuquocfishsauce@gmail.com','Công ty TNHH Nước Mắm Phú Quốc','0933222111',1,_binary ''),(10,'Bản Hua Tát, Xã Chiềng Hắc, Mộc Châu, Sơn La','matongtaybac@gmail.com','Công ty TNHH Mật Ong Rừng Tây Bắc','0988999000',1,_binary ''),(11,'Km10, Quốc lộ 32, Phường Phúc Diễn, Hà Nội','coldfood@hanoi.vn','Công ty TNHH Thực Phẩm Đông Lạnh Hà Nội','0922333444',1,_binary '\0'),(12,'Số 9, Nguyễn Hữu Thọ, Phường Khuê Trung, Đà Nẵng','pending@supplier.com','Công ty Cổ phần Thực phẩm đóng hộp','0955111222',1,_binary '\0'),(13,'KCN Tân Tạo, Phường Tân Tạo A, TP.HCM','botmi@binhan.vn','Công ty TNHH Bột Mì Bình An','0909777666',1,_binary ''),(14,'Xã Dân Chủ, TP. Hòa Bình','trungga@hoabinh.vn','HTX Trứng Gà Sạch Hòa Bình','0912666111',1,_binary ''),(15,'Đường số 7, Phường Dĩ An, Bình Dương','dau.an@thucvatviet.vn','Công ty TNHH Dầu Ăn Thực Vật Việt','0922111000',1,_binary ''),(16,'QL91, Phường Mỹ Thới, TP. Long Xuyên, An Giang','mekongorganic@gmail.com','Công ty TNHH Thực Phẩm Hữu Cơ Mekong','0933444555',1,_binary ''),(17,'Xã Cồn Vạn, Nam Định','muoi@bienviet.vn','Công ty TNHH Muối Biển Việt','0944222333',1,_binary ''),(18,'Thôn Yên Mỹ, Xã Tam Hiệp, Hà Nội','dauphu@hanoisoy.vn','HTX Đậu Phụ Sạch Hà Nội','0977333444',1,_binary ''),(19,'Phường Tân Lợi, TP. Buôn Ma Thuột, Đắk Lắk','nongsan@taynguyen.vn','Công ty Cổ phần Nông Sản Tây Nguyên','0988111777',1,_binary ''),(20,'Xã Vĩnh Hải, TP. Vĩnh Châu, Sóc Trăng','hanhtim@vinhchau.vn','HTX Hành Tím Vĩnh Châu','0966444777',1,_binary '');
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
  `description` mediumtext COLLATE utf8mb4_general_ci,
  `floor_id` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `restaurant_id` int NOT NULL,
  `seats` int NOT NULL,
  `status` bit(1) NOT NULL,
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
INSERT INTO `tables` VALUES (1,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-01',1,4,_binary ''),(2,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-02',1,4,_binary ''),(3,2,'Bàn gần cửa sổ tầng 1',2,'Bàn T2-03',1,4,_binary ''),(4,2,'Bàn gần cửa sổ tầng 1',2,'Bàn T2-04',1,6,_binary ''),(5,1,'Bàn nhỏ tầng 1',2,'Bàn T2-05',1,2,_binary ''),(6,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-06',1,4,_binary ''),(7,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-07',1,4,_binary ''),(8,2,'Bàn gần cửa sổ tầng 1',2,'Bàn T2-08',1,4,_binary ''),(9,1,'Bàn lớn tầng 1',2,'Bàn T2-09',1,6,_binary ''),(10,1,'Bàn tiêu chuẩn tầng 1',2,'Bàn T2-10',1,4,_binary ''),(11,3,'Bàn VIP tầng 2',3,'Bàn T3-01',1,4,_binary ''),(12,3,'Bàn VIP tầng 2',3,'Bàn T3-02',1,6,_binary ''),(13,3,'Bàn VIP tầng 2',3,'Bàn T3-03',1,4,_binary ''),(14,3,'Bàn VIP tầng 2',3,'Bàn T3-04',1,6,_binary ''),(15,3,'Bàn VIP tầng 2',3,'Bàn T3-05',1,4,_binary ''),(16,3,'Bàn VIP tầng 2',3,'Bàn T3-06',1,6,_binary ''),(17,3,'Bàn VIP tầng 2',3,'Bàn T3-07',1,4,_binary ''),(18,3,'Bàn VIP tầng 2',3,'Bàn T3-08',1,6,_binary ''),(19,3,'Bàn VIP tầng 2',3,'Bàn T3-09',1,4,_binary ''),(20,3,'Bàn VIP tầng 2',3,'Bàn T3-10',1,6,_binary ''),(21,4,'Phòng riêng tầng 3',4,'Bàn T4-01',1,6,_binary ''),(22,4,'Phòng riêng tầng 3',4,'Bàn T4-02',1,8,_binary ''),(23,5,'Phòng riêng VIP tầng 3',4,'Bàn T4-03',1,10,_binary ''),(24,4,'Phòng riêng tầng 3',4,'Bàn T4-04',1,6,_binary ''),(25,4,'Phòng riêng tầng 3',4,'Bàn T4-05',1,8,_binary ''),(26,5,'Phòng riêng VIP tầng 3',4,'Bàn T4-06',1,6,_binary ''),(27,4,'Phòng riêng tầng 3',4,'Bàn T4-07',1,8,_binary ''),(28,4,'Phòng riêng lớn tầng 3',4,'Bàn T4-08',1,10,_binary ''),(29,4,'Phòng riêng tầng 3',4,'Bàn T4-09',1,6,_binary ''),(30,4,'Phòng riêng tầng 3',4,'Bàn T4-10',1,8,_binary '');
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
  `food_id` int DEFAULT NULL,
  `restaurant_id` int NOT NULL,
  `status` int NOT NULL,
  `time_end` datetime DEFAULT NULL,
  `time_start` datetime NOT NULL,
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
INSERT INTO `use_foods` VALUES (1,NULL,1,1,1,NULL,'2025-07-24 00:00:00'),(2,NULL,2,1,1,NULL,'2025-07-24 00:00:00'),(3,NULL,3,1,1,NULL,'2025-07-24 00:00:00'),(4,NULL,4,1,1,NULL,'2025-07-24 00:00:00'),(5,NULL,5,1,1,NULL,'2025-07-24 00:00:00'),(6,NULL,6,1,1,NULL,'2025-07-24 00:00:00'),(7,NULL,7,1,1,NULL,'2025-07-24 00:00:00'),(8,NULL,8,1,1,NULL,'2025-07-24 00:00:00'),(9,NULL,9,1,1,NULL,'2025-07-24 00:00:00'),(10,NULL,10,1,1,NULL,'2025-07-24 00:00:00'),(11,NULL,11,1,1,NULL,'2025-07-24 00:00:00'),(12,NULL,12,1,1,NULL,'2025-07-24 00:00:00'),(13,NULL,13,1,1,NULL,'2025-07-24 00:00:00'),(14,NULL,14,1,1,NULL,'2025-07-24 00:00:00'),(15,NULL,15,1,1,NULL,'2025-07-24 00:00:00'),(16,NULL,16,1,1,NULL,'2025-07-24 00:00:00'),(17,NULL,17,1,1,NULL,'2025-07-24 00:00:00');
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
  `customer_email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customer_fullname` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `customer_phone` varchar(11) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `order_table_id` int DEFAULT NULL,
  `restaurant_id` int NOT NULL,
  `status` int NOT NULL,
  `table_id` int NOT NULL,
  `time_end` datetime DEFAULT NULL,
  `time_start` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_useTables_restaurants` (`restaurant_id`),
  KEY `FK_useTables_tables` (`table_id`),
  KEY `FK_useTables_employees` (`employee_id`),
  KEY `FK_useTables_customers` (`customer_id`),
  KEY `FK_useTables_orders` (`order_id`),
  KEY `FK_useTables_orderTables` (`order_table_id`),
  CONSTRAINT `FK_useTables_customers` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  CONSTRAINT `FK_useTables_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`),
  CONSTRAINT `FK_useTables_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FK_useTables_orderTables` FOREIGN KEY (`order_table_id`) REFERENCES `order_tables` (`id`),
  CONSTRAINT `FK_useTables_restaurants` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`),
  CONSTRAINT `FK_useTables_tables` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `use_tables`
--

LOCK TABLES `use_tables` WRITE;
/*!40000 ALTER TABLE `use_tables` DISABLE KEYS */;
INSERT INTO `use_tables` VALUES (1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,1,NULL,'2025-07-24 00:00:00'),(2,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,2,NULL,'2025-07-24 00:00:00'),(3,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,3,NULL,'2025-07-24 00:00:00'),(4,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,4,NULL,'2025-07-24 00:00:00'),(5,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,5,NULL,'2025-07-24 00:00:00'),(6,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,6,NULL,'2025-07-24 00:00:00'),(7,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,7,NULL,'2025-07-24 00:00:00'),(8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,8,NULL,'2025-07-24 00:00:00'),(9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,9,NULL,'2025-07-24 00:00:00'),(10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,10,NULL,'2025-07-24 00:00:00'),(11,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,11,NULL,'2025-07-24 00:00:00'),(12,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,12,NULL,'2025-07-24 00:00:00'),(13,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,13,NULL,'2025-07-24 00:00:00'),(14,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,14,NULL,'2025-07-24 00:00:00'),(15,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,15,NULL,'2025-07-24 00:00:00'),(16,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,16,NULL,'2025-07-24 00:00:00'),(17,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,17,NULL,'2025-07-24 00:00:00'),(18,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,18,NULL,'2025-07-24 00:00:00'),(19,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,19,NULL,'2025-07-24 00:00:00'),(20,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,20,NULL,'2025-07-24 00:00:00'),(21,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,21,NULL,'2025-07-24 00:00:00'),(22,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,22,NULL,'2025-07-24 00:00:00'),(23,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,23,NULL,'2025-07-24 00:00:00'),(24,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,24,NULL,'2025-07-24 00:00:00'),(25,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,25,NULL,'2025-07-24 00:00:00'),(26,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,26,NULL,'2025-07-24 00:00:00'),(27,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,27,NULL,'2025-07-24 00:00:00'),(28,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,28,NULL,'2025-07-24 00:00:00'),(29,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,29,NULL,'2025-07-24 00:00:00'),(30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,1,30,NULL,'2025-07-24 00:00:00');
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
  `create_at` datetime NOT NULL,
  `is_using` bit(1) NOT NULL,
  `method` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `refresh_token` mediumtext COLLATE utf8mb4_general_ci,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `status` bit(1) NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$bhH/.jM0ks/qDcAhzFtKCO0b1LYyhTxF3lZrtxLVQ4KRWSbdhTRha',NULL,'ADMIN',_binary '','admin'),(2,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$JCdSVcRsSdWrIXlIA3nWFe5dnGydRYjoE33l7xr3YpxqrNxHnGQlG',NULL,'MANAGER',_binary '','manager0'),(3,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$Y8zeMZCmycfAlk0ecbJnhepUDk1aTazZyAIbSS.3QdmdPSQNGTHDq',NULL,'MANAGER',_binary '','manager1'),(4,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$7rcbF5789gXaTvRqXmpFMe9srjpVvh5u64OvDK78WIJAAdlUqKq8m','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJlbXBsb3llZTAiLCJleHAiOjE3NzgyNzM1OTUsImlhdCI6MTc3ODE4NzE5NSwidXNlciI6eyJyb2xlIjoiTmjDom4gdmnDqm4gbmjDoCBow6BuZyIsIm1ldGhvZCI6IkhBTkRNQURFIiwiaWQiOjQsImNyZWF0ZUF0IjoiMjAyNS0xMi0wMiAwMDowMDowMCIsInVzZXJuYW1lIjoiZW1wbG95ZWUwIiwic3RhdHVzIjoiQUNUSVZFIn19.HolUhNYP8znqDtdM03AqLB5DUlrr98TOStfLj21y3ESWD_O5NWjOPP0PxdsUGoNGmmJuEzm_SMRPcINIU6u4ug','EMPLOYEE',_binary '','employee0'),(5,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$NtuTmHa926tz6DyAv1/3b.L4pjE4tiWrAgPfXl/ohPIjK3dpz/dE2',NULL,'EMPLOYEE',_binary '','employee1'),(6,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$JSQaUZ2U50IrDgYQisO3heahc1xISrhtQ423EViMXJus.I5cavY9S',NULL,'EMPLOYEE',_binary '','employee2'),(7,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$jODPwwMUJ/73.kPmHhdXguyFbdt1dHV.ypHZzqfsKLY0w2e985y0u',NULL,'EMPLOYEE',_binary '','employee3'),(8,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$GZ43yo1RYp7Yybl7AcvP8O9aV0fLffTJvNfuJyEX.o00gGYlZ/iuC',NULL,'EMPLOYEE',_binary '','employee4'),(9,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$1gNzH9YaB01Cd..ucbPlI.Bdx6UdtIyu3.3jrbcQY3J4W5Qy5w1qa',NULL,'CUSTOMER',_binary '','customer-guest'),(10,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$aHFolHaNYoVtzX2PFL6/T.EA5Ak4ciPwkaFlFJft2HYbIrwxXtDC.',NULL,'CUSTOMER',_binary '','customer0'),(11,'2025-12-02 00:00:00',_binary '','HANDMADE','$2a$10$IhIBM99z/aZD.6pQ5Oya.O6uMNAiUmS1/6AQuyX.wDmRTBbkFb7x.',NULL,'CUSTOMER',_binary '','customer1');
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

-- Dump completed on 2026-05-08  4:01:51
