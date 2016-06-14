/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 60004
Source Host           : localhost:3306
Source Database       : tvdoctor

Target Server Type    : MYSQL
Target Server Version : 60004
File Encoding         : 65001

Date: 2016-03-22 15:10:07
*/

DROP DATABASE  IF EXISTS `tvdoctor`;

CREATE DATABASE IF NOT EXISTS `tvdoctor` DEFAULT CHARACTER SET utf8;
SET FOREIGN_KEY_CHECKS=0;

use `tvdoctor`;

-- ----------------------------
-- Table structure for `permission`
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `permissionId` int(11) NOT NULL,
  `permissionName` char(255) NOT NULL,
  PRIMARY KEY (`permissionId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('1', 'level1Boss权限');
INSERT INTO `permission` VALUES ('2', 'level2管理员权限');
INSERT INTO `permission` VALUES ('3', 'level3工程师权限');
INSERT INTO `permission` VALUES ('4', 'level4售后权限');

-- ----------------------------
-- Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `roleId` int(11) NOT NULL,
  `roleName` char(255) NOT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', 'Boss');
INSERT INTO `role` VALUES ('2', 'Admin');
INSERT INTO `role` VALUES ('3', 'Engineer');
INSERT INTO `role` VALUES ('4', 'After-sale');

-- ----------------------------
-- Table structure for `role_permission`
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `roleId` int(11) NOT NULL,
  `permissionId` int(11) NOT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role_permission
-- ----------------------------
INSERT INTO `role_permission` VALUES ('1', '1');
INSERT INTO `role_permission` VALUES ('2', '2');
INSERT INTO `role_permission` VALUES ('3', '3');
INSERT INTO `role_permission` VALUES ('4', '4');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` char(64) NOT NULL,
  `password` char(64) NOT NULL,
  `realName` varchar(20) NOT NULL,
  `department` varchar(20) NOT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admin', '21232f297a57a5a743894a0e4a801fc3', '', '');

-- ----------------------------
-- Table structure for `user_role`
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` int(11) NOT NULL,
  PRIMARY KEY (`userId`),
  INDEX (`userId`),
  FOREIGN KEY (`userId`) REFERENCES user(`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES ('1', '1');


-- ----------------------------
-- Table structure for `connection_records`
-- ----------------------------
DROP TABLE IF EXISTS `connect_records`;
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
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for `login_records`
-- ----------------------------
DROP TABLE IF EXISTS `login_records`;

CREATE TABLE `login_records` (
  `loginId` int(10) NOT NULL AUTO_INCREMENT,
  `userName` char(64) NOT NULL,
  `loginTime` bigint(20) NOT NULL,
  `logoutTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`loginId`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
