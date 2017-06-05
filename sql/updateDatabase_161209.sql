-- ----------------------------
-- Table structure for `ipTable`
-- ----------------------------
DROP TABLE IF EXISTS `ipTable`;
CREATE TABLE `ipTable` (
  `ipId` int(5) NOT NULL,
  `ipAddr` char(20) NOT NULL,
  `port` int(5) NOT NULL,
  PRIMARY KEY (`ipId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------

ALTER  TABLE `login_records` ADD `desc` char(10) ;