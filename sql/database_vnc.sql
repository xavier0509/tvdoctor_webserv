/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 60004
Source Host           : localhost:3306
Source Database       : tvdoctor

Target Server Type    : MYSQL
Target Server Version : 60004
File Encoding         : 65001

Date: 2016-02-24 20:26:27
*/
CREATE DATABASE IF NOT EXISTS `tvdoctor` DEFAULT CHARACTER SET utf8;

use tvdoctor;

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `function`
-- ----------------------------
DROP TABLE IF EXISTS `function`;
CREATE TABLE `function` (
  `functionid` int(11) NOT NULL,
  `functiondescribtion` char(255) DEFAULT NULL,
  PRIMARY KEY (`functionid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of function
-- ----------------------------

-- ----------------------------
-- Table structure for `permission`
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `permissionid` char(255) NOT NULL,
  `permissiondescription` char(255) DEFAULT NULL,
  PRIMARY KEY (`permissionid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `permission` VALUES ('level1', '最高权限');
INSERT INTO `permission` VALUES ('level2', '次级权限');
INSERT INTO `permission` VALUES ('level3', '最低权限');

-- ----------------------------
-- Table structure for `permission_function`
-- ----------------------------
DROP TABLE IF EXISTS `permission_function`;
CREATE TABLE `permission_function` (
  `connectionid` int(11) NOT NULL,
  `permissionid` char(255) NOT NULL,
  `functionid` int(11) NOT NULL,
  PRIMARY KEY (`connectionid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of permission_function
-- ----------------------------

-- ----------------------------
-- Table structure for `role`
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `roleid` char(50) NOT NULL,
  `rolename` char(100) NOT NULL,
  `roledescription` char(255) DEFAULT NULL,
  PRIMARY KEY (`roleid`),
  KEY `roleid` (`roleid`,`rolename`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('1', 'admin', '管理员');
INSERT INTO `role` VALUES ('2', 'engineer', '工程师');
INSERT INTO `role` VALUES ('3', 'aftersale', '售后');

-- ----------------------------
-- Table structure for `role_permission`
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `connectionid` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` char(255) NOT NULL,
  `userid` char(255) NOT NULL,
  `permissionid` char(255) NOT NULL,
  `permission` int(11) NOT NULL COMMENT '权限 （1为可用，2为不可用）',
  PRIMARY KEY (`connectionid`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of role_permission
-- ----------------------------
INSERT INTO `role_permission` VALUES ('13', '', '111', 'level1', '0');
INSERT INTO `role_permission` VALUES ('6', '2', '222', 'level2', '0');
INSERT INTO `role_permission` VALUES ('7', '3', '333', 'level3', '0');
INSERT INTO `role_permission` VALUES ('19', '1', '444', 'level2', '0');

-- ----------------------------
-- Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `userid` char(50) NOT NULL,
  `username` char(255) NOT NULL,
  `password` char(255) NOT NULL,
  PRIMARY KEY (`userid`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('111', '111', '111');
INSERT INTO `user` VALUES ('222', '222', '222');
INSERT INTO `user` VALUES ('333', '333', '333');
INSERT INTO `user` VALUES ('444', '444', '444');

-- ----------------------------
-- Table structure for `user_role`
-- ----------------------------
DROP TABLE IF EXISTS `user_role`;
CREATE TABLE `user_role` (
  `connectionid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` char(50) NOT NULL,
  `username` char(255) NOT NULL,
  `roleid` char(50) NOT NULL,
  PRIMARY KEY (`connectionid`),
  KEY `userid` (`userid`),
  KEY `roleid` (`roleid`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user_role
-- ----------------------------
INSERT INTO `user_role` VALUES ('21', '111', '', '1');
INSERT INTO `user_role` VALUES ('14', '222', '222', '2');
INSERT INTO `user_role` VALUES ('15', '333', '333', '3');
INSERT INTO `user_role` VALUES ('27', '444', '444', '2');
