CREATE DATABASE `ba` /*!40100 COLLATE 'utf8_general_ci' */

CREATE TABLE `book` (
	`id` INT(11) NOT NULL,
	`name` VARCHAR(100) NOT NULL,
	`image` VARCHAR(200) NULL DEFAULT NULL,
	`type_id` TINYINT(2) NULL DEFAULT NULL,
	`type_name` VARCHAR(50) NULL DEFAULT 'Loại chung',
	`hot` TINYINT(1) NULL DEFAULT '0',
	`comment_time` INT(11) NULL DEFAULT '0',
	`love_time` INT(11) NULL DEFAULT '0',
	`hate_time` INT(11) NULL DEFAULT '0',
	`borrow_time` INT(11) NULL DEFAULT '0',
	`author` VARCHAR(100) NULL DEFAULT NULL,
	`intro` VARCHAR(10000) NULL DEFAULT NULL,
	`use_quantity` INT(6) NULL DEFAULT '1',
	`inventory_quantity` INT(6) NULL DEFAULT '0',
	`current_quantity` INT(6) NULL DEFAULT '1',
	`note` VARCHAR(10000) NULL DEFAULT NULL,
	`created_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
ENGINE=InnoDB;

-- 21/2/2018
ALTER TABLE `reader`
ADD COLUMN `last_borrow` TIMESTAMP(6) DEFAULT NULL;