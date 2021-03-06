/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : ba

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2018-04-15 15:06:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for book
-- ----------------------------
DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image` varchar(200) DEFAULT '',
  `type_id` int(11) NOT NULL DEFAULT '1',
  `type_name` varchar(50) NOT NULL,
  `hot` tinyint(1) DEFAULT '0',
  `borrow_time` int(11) DEFAULT '0',
  `comment_time` int(11) DEFAULT '0',
  `love_time` int(11) DEFAULT '0',
  `hate_time` int(11) DEFAULT '0',
  `author` varchar(100) DEFAULT NULL,
  `intro` varchar(10000) DEFAULT NULL,
  `use_quantity` int(11) DEFAULT '1',
  `inventory_quantity` int(11) DEFAULT '0',
  `current_quantity` int(11) DEFAULT '0',
  `note` varchar(10000) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_ibfk_1` (`type_id`),
  CONSTRAINT `book_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `book_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book
-- ----------------------------

-- ----------------------------
-- Table structure for book_comment
-- ----------------------------
DROP TABLE IF EXISTS `book_comment`;
CREATE TABLE `book_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `content` varchar(10000) DEFAULT NULL,
  `actived` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `book_comment_ibfk_1` (`user_id`),
  CONSTRAINT `book_comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `public_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book_comment
-- ----------------------------

-- ----------------------------
-- Table structure for book_rating
-- ----------------------------
DROP TABLE IF EXISTS `book_rating`;
CREATE TABLE `book_rating` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `book_rating_ibfk_1` (`user_id`),
  CONSTRAINT `book_rating_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `public_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book_rating
-- ----------------------------

-- ----------------------------
-- Table structure for book_type
-- ----------------------------
DROP TABLE IF EXISTS `book_type`;
CREATE TABLE `book_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `actived` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of book_type
-- ----------------------------

-- ----------------------------
-- Table structure for borrow
-- ----------------------------
DROP TABLE IF EXISTS `borrow`;
CREATE TABLE `borrow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '1',
  `reader_id` int(11) NOT NULL DEFAULT '1',
  `reader_mobile` varchar(11) NOT NULL,
  `reader_name` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `borrow_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pay_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `note` varchar(10000) DEFAULT NULL,
  `deposit_name` varchar(50) NOT NULL,
  `deposit_id` int(11) NOT NULL DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `borrow_ibfk_2` (`user_id`),
  KEY `borrow_ibfk_3` (`deposit_name`),
  KEY `borrow_ibfk_1` (`deposit_id`),
  CONSTRAINT `borrow_ibfk_1` FOREIGN KEY (`deposit_id`) REFERENCES `deposit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of borrow
-- ----------------------------

-- ----------------------------
-- Table structure for borrow_book
-- ----------------------------
DROP TABLE IF EXISTS `borrow_book`;
CREATE TABLE `borrow_book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `borrow_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `book_name` varchar(100) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `borrow_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `borrow_book_ibfk_1` (`borrow_id`),
  CONSTRAINT `borrow_book_ibfk_1` FOREIGN KEY (`borrow_id`) REFERENCES `borrow` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of borrow_book
-- ----------------------------

-- ----------------------------
-- Table structure for department
-- ----------------------------
DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `actived` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of department
-- ----------------------------
INSERT INTO `department` VALUES ('1', 'Chưa phân ban', '1');
INSERT INTO `department` VALUES ('2', 'Văn hóa đọc', '1');
INSERT INTO `department` VALUES ('3', 'Tài chính nhân sự', '1');
INSERT INTO `department` VALUES ('4', 'Truyền thông - đối ngoại', '1');
INSERT INTO `department` VALUES ('5', 'Sự kiện', '1');

-- ----------------------------
-- Table structure for deposit
-- ----------------------------
DROP TABLE IF EXISTS `deposit`;
CREATE TABLE `deposit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `actived` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of deposit
-- ----------------------------
INSERT INTO `deposit` VALUES ('1', 'Thẻ sinh viên', '1');
INSERT INTO `deposit` VALUES ('2', 'Chứng minh thư', '1');
INSERT INTO `deposit` VALUES ('3', 'Bằng lái xe', '1');
INSERT INTO `deposit` VALUES ('4', 'Tiền mặt', '1');

-- ----------------------------
-- Table structure for facutly
-- ----------------------------
DROP TABLE IF EXISTS `facutly`;
CREATE TABLE `facutly` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `actived` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of facutly
-- ----------------------------
INSERT INTO `facutly` VALUES ('1', 'Chưa phân khoa', '1');
INSERT INTO `facutly` VALUES ('2', 'Cơ điện', '1');
INSERT INTO `facutly` VALUES ('3', 'Công nghệ thông tin ', '1');
INSERT INTO `facutly` VALUES ('4', 'Dầu khí', '1');
INSERT INTO `facutly` VALUES ('5', 'Trắc địa', '1');
INSERT INTO `facutly` VALUES ('6', 'Kinh tế', '1');
INSERT INTO `facutly` VALUES ('7', 'Xây dựng ', '1');
INSERT INTO `facutly` VALUES ('8', 'Môi trường', '1');
INSERT INTO `facutly` VALUES ('9', 'Mỏ', '1');
INSERT INTO `facutly` VALUES ('10', 'Địa chất', '1');

-- ----------------------------
-- Table structure for notification
-- ----------------------------
DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` varchar(200) NOT NULL,
  `priority` enum('INFO','PRIMARY','WARNING','ERROR') NOT NULL,
  `role` tinyint(1) NOT NULL DEFAULT '1',
  `action` varchar(50) DEFAULT NULL,
  `click` varchar(50) DEFAULT NULL,
  `data_id` int(11) NOT NULL,
  `creator_id` int(11) DEFAULT NULL,
  `creator_name` varchar(50) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of notification
-- ----------------------------

-- ----------------------------
-- Table structure for position
-- ----------------------------
DROP TABLE IF EXISTS `position`;
CREATE TABLE `position` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `actived` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of position
-- ----------------------------
INSERT INTO `position` VALUES ('1', 'Chủ nhiệm', '1');
INSERT INTO `position` VALUES ('2', 'Phó chủ nhiệm', '1');
INSERT INTO `position` VALUES ('3', 'Trưởng ban', '1');
INSERT INTO `position` VALUES ('4', 'Thành viên', '1');
INSERT INTO `position` VALUES ('5', 'Cộng tác viên', '1');

-- ----------------------------
-- Table structure for public_user
-- ----------------------------
DROP TABLE IF EXISTS `public_user`;
CREATE TABLE `public_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `actived` tinyint(4) NOT NULL DEFAULT '1',
  `deleted` tinyint(4) DEFAULT '0',
  `name` varchar(50) NOT NULL,
  `fb_id` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of public_user
-- ----------------------------

-- ----------------------------
-- Table structure for reader
-- ----------------------------
DROP TABLE IF EXISTS `reader`;
CREATE TABLE `reader` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mobile` varchar(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `facutly_id` int(11) DEFAULT '1',
  `is_user` int(11) DEFAULT NULL,
  `borrow_time` int(11) DEFAULT '0',
  `course` int(11) DEFAULT '0',
  `gender` int(1) DEFAULT '0',
  `actived` int(1) DEFAULT '1',
  `note` varchar(10000) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `reader_ibfk_1` (`facutly_id`),
  KEY `reader_ibfk_2` (`is_user`),
  CONSTRAINT `reader_ibfk_1` FOREIGN KEY (`facutly_id`) REFERENCES `facutly` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of reader
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(50) NOT NULL,
  `mobile` varchar(11) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(50) NOT NULL,
  `role` tinyint(1) NOT NULL DEFAULT '0',
  `position_id` int(11) DEFAULT '1',
  `department_id` int(11) DEFAULT '1',
  `nick_name` varchar(50) DEFAULT NULL,
  `facutly_id` int(11) DEFAULT '1',
  `course` int(11) DEFAULT '0',
  `image` varchar(200) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `gender` tinyint(1) DEFAULT '0',
  `dob_date` int(2) DEFAULT '1',
  `dob_month` int(2) DEFAULT '1',
  `dob_year` int(4) DEFAULT '2000',
  `actived` tinyint(1) DEFAULT '1',
  `deleted` tinyint(1) DEFAULT '0',
  `last_seen_noti_id` int(11) DEFAULT '0',
  `note` varchar(10000) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_ibfk_1` (`facutly_id`),
  KEY `user_ibfk_2` (`department_id`),
  KEY `user_ibfk_3` (`position_id`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`facutly_id`) REFERENCES `facutly` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_ibfk_3` FOREIGN KEY (`position_id`) REFERENCES `position` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'admins', '99999999999', '$2a$15$qB37wP12HcBj.MZmb1mowuzqgZsBifP1XHWqUHxVpUIas2FTXQ0YS', 'Admin', '3', '1', '1', '', '1', '0', '', '', '0', '1', '1', '2000', '1', '0', '3', '', '2018-03-20 12:50:22', '2018-04-07 22:11:05');
DROP TRIGGER IF EXISTS `after_book_comment_update`;
DELIMITER ;;
CREATE TRIGGER `after_book_comment_update` AFTER UPDATE ON `book_comment` FOR EACH ROW BEGIN
	IF(NEW.deleted = 1) THEN
		UPDATE book SET comment_time = comment_time - 1 WHERE id = NEW.book_id;
	ELSEIF(OLD.actived = 1 AND NEW.actived = 0) THEN
		UPDATE book SET comment_time = comment_time - 1 WHERE id = NEW.book_id;
	ELSEIF(OLD.actived = 0 AND NEW.actived = 1 ) THEN
		UPDATE book SET comment_time = comment_time + 1 WHERE id = NEW.book_id;
	END IF;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `after_book_comment_delete`;
DELIMITER ;;
CREATE TRIGGER `after_book_comment_delete` AFTER DELETE ON `book_comment` FOR EACH ROW BEGIN
		UPDATE book SET comment_time = comment_time - 1 WHERE id = OLD.book_id;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `after_book_rating_create`;
DELIMITER ;;
CREATE TRIGGER `after_book_rating_create` AFTER INSERT ON `book_rating` FOR EACH ROW BEGIN
	IF(NEW.type = 1) THEN
		UPDATE book SET love_time = love_time + 1 WHERE id = NEW.book_id;
	ELSEIF(NEW.type = 0) THEN
		UPDATE book SET hate_time = hate_time + 1 WHERE id = NEW.book_id;
	END IF;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `after_book_rating_update`;
DELIMITER ;;
CREATE TRIGGER `after_book_rating_update` AFTER UPDATE ON `book_rating` FOR EACH ROW BEGIN
	IF(OLD.type = 0 AND NEW.type = 1) THEN
		UPDATE book SET love_time = love_time + 1, hate_time = hate_time - 1  WHERE id = NEW.book_id;
	ELSEIF(OLD.type = 1 AND NEW.type = 0) THEN
		UPDATE book SET hate_time = hate_time + 1, love_time = love_time - 1 WHERE id = NEW.book_id;
	END IF;
END
;;
DELIMITER ;
DROP TRIGGER IF EXISTS `after_book_rating_delete`;
DELIMITER ;;
CREATE TRIGGER `after_book_rating_delete` AFTER DELETE ON `book_rating` FOR EACH ROW BEGIN
	IF(OLD.type = 1) THEN
		UPDATE book SET love_time = love_time - 1 WHERE id = OLD.book_id;
	ELSEIF(OLD.type = 0) THEN
		UPDATE book SET hate_time = hate_time - 1 WHERE id = OLD.book_id;
	END IF;
END
;;
DELIMITER ;
