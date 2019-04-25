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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','4b78e581bdaffa037a6b11d58bdc934a','',''),(2,'guest','14e1b600b1fd579f47433b88e8d85291','æ¥å®¾è´¦å·','software'),(3,'test','14e1b600b1fd579f47433b88e8d85291','è½¯ä»¶é™¢æµ‹è¯•','software'),(4,'yanrongyan','62ef34f4e7b271b4ccdb5cbeb1546fd5','é—«è£ç‚Ž','software'),(5,'tangsijing','82d9e9091b853ebf20fbc3271f01053c','tangsijing','software'),(7,'coocaa','e10adc3949ba59abbe56e057f20f883e','coocaaTest','coocaa'),(8,'srisz','e10adc3949ba59abbe56e057f20f883e','sriszTest','software'),(9,'srinj','e10adc3949ba59abbe56e057f20f883e','srinjTest','software'),(10,'sribj','e10adc3949ba59abbe56e057f20f883e','sribjTest','software'),(11,'yhfwb1','4b04ea9ce5155375bd35793ce2c7527d','ç”¨æœ1','service'),(12,'yhfwb2','e10adc3949ba59abbe56e057f20f883e','ç”¨æœ2','service'),(13,'yhfwb3','e10adc3949ba59abbe56e057f20f883e','ç”¨æœ3','service'),(14,'yhfwb4','e10adc3949ba59abbe56e057f20f883e','ç”¨æœ4','service'),(15,'xtrjs','e10adc3949ba59abbe56e057f20f883e','ç³»ç»Ÿè½¯ä»¶æ‰€','software'),(16,'xiezejia','1230847ac3ea4bdcfa4aa880cc612ca7','è°¢æ³½ä½³','software'),(18,'xufu','25d55ad283aa400af464c76d713c07ad','è®¸ç¦','software'),(20,'cczzywb','8808d592cd75d6587d103c8757793612','é…·å¼€å¢žå€¼ä¸šåŠ¡éƒ','coocaa'),(21,'xieguangcai','797106f110251ef3da200e76fe5cae58','xieguangcai','coocaa');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-24 14:52:59
