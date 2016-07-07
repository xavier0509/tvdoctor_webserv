-- MySQL dump 10.13  Distrib 5.1.73, for redhat-linux-gnu (x86_64)
--
-- Host: localhost    Database: tvdoctor
-- ------------------------------------------------------
-- Server version	5.1.73

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `connect_records`
--

DROP TABLE IF EXISTS `connect_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `connect_records` (
  `connectId` int(10) NOT NULL AUTO_INCREMENT,
  `loginId` int(10) NOT NULL,
  `connectRequestTime` bigint(20) NOT NULL,
  `connectedTime` bigint(20) DEFAULT NULL,
  `disconnectedTime` bigint(20) DEFAULT NULL,
  `connectFlag` int(4) NOT NULL,
  `activeId` char(10) NOT NULL,
  `machineCore` char(15) DEFAULT NULL,
  `machineType` char(15) DEFAULT NULL,
  `version` char(15) DEFAULT NULL,
  `issue` char(100) DEFAULT NULL,
  PRIMARY KEY (`connectId`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connect_records`
--

LOCK TABLES `connect_records` WRITE;
/*!40000 ALTER TABLE `connect_records` DISABLE KEYS */;
INSERT INTO `connect_records` VALUES (1,2,1464938901,1464938938,NULL,0,'72jfs2o7','8H81','14A55','5.10.186411',NULL),(2,4,1464939148,NULL,1464939232,1,'72jfs2o7',NULL,NULL,NULL,'sdsad'),(3,5,1464939506,1464939514,1464939547,0,'72jfs2o7','8H81','14A55','5.10.186411','test break'),(4,6,1464939713,1464939715,1464939842,0,'72jfs2o7','8H81','14A55','5.10.186411','123456'),(5,7,1464939889,NULL,NULL,1,'1111',NULL,NULL,NULL,NULL),(6,7,1464939899,1464939905,1464939920,0,'72jfs2o7','8H81','14A55','5.10.186411','7890'),(7,8,1464939956,NULL,NULL,1,'dsa',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `connect_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_records`
--

DROP TABLE IF EXISTS `login_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login_records` (
  `loginId` int(10) NOT NULL AUTO_INCREMENT,
  `userName` char(64) NOT NULL,
  `loginTime` bigint(20) NOT NULL,
  `logoutTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`loginId`)
) ENGINE=MyISAM AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_records`
--

LOCK TABLES `login_records` WRITE;
/*!40000 ALTER TABLE `login_records` DISABLE KEYS */;
INSERT INTO `login_records` VALUES (32,'admin',1464942882,1464942895),(33,'admin',1465176926,1465177474),(34,'admin',1465177479,NULL),(35,'admin',1465177519,1465177536),(36,'admin',1465177545,1465177556),(37,'111',1465177566,1465177639),(38,'111',1465177667,1465177675),(39,'admin',1465177679,NULL),(40,'admin',1465177890,1465177941),(41,'222',1465177945,NULL),(42,'admin',1465178045,1465178126),(43,'111',1465178131,1465178138),(44,'111',1465178179,1465178244),(45,'111',1465178254,1465178271),(46,'111',1465178284,1465178458),(47,'admin',1465178550,NULL),(48,'admin',1465178762,1465178772),(49,'111',1465178783,1465178797);
/*!40000 ALTER TABLE `login_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permission` (
  `permissionId` int(11) NOT NULL,
  `permissionName` char(255) NOT NULL,
  PRIMARY KEY (`permissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
INSERT INTO `permission` VALUES (1,'level1Bossæƒé™'),(2,'level2ç®¡ç†å‘˜æƒé™'),(3,'level3å·¥ç¨‹å¸ˆæƒé™'),(4,'level4å”®åŽæƒé™');
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `roleId` int(11) NOT NULL,
  `roleName` char(255) NOT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Boss'),(2,'Admin'),(3,'Engineer'),(4,'After-sale');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permission`
--

DROP TABLE IF EXISTS `role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_permission` (
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permission`
--

LOCK TABLES `role_permission` WRITE;
/*!40000 ALTER TABLE `role_permission` DISABLE KEYS */;
INSERT INTO `role_permission` VALUES (1,1),(2,2),(3,3),(4,4);
/*!40000 ALTER TABLE `role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` char(64) NOT NULL,
  `password` char(64) NOT NULL,
  `realName` varchar(20) NOT NULL,
  `department` varchar(20) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','21232f297a57a5a743894a0e4a801fc3','',''),(2,'111','96e79218965eb72c92a549dd5a330112','111','software'),(3,'222','e3ceb5881a0a1fdaad01296d7554868d','222','software');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
INSERT INTO `user_role` VALUES (1,1),(2,3),(3,4);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-06 10:16:59
