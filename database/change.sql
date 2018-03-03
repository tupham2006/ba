-- 21/2/2018
ALTER TABLE `reader`
ADD COLUMN `last_borrow` TIMESTAMP(6) DEFAULT NULL;

ALTER TABLE `book`
ADD COLUMN `created_at` datetime DEFAULT NULL,
ADD COLUMN  `updated_at` datetime DEFAULT NULL;
-- 2/3/2018
ALTER TABLE `book`
ADD comment_time INT(2) DEFAULT 0,
ADD love_time INT(2) DEFAULT 0,
ADD hate_time INT(2) DEFAULT 0;