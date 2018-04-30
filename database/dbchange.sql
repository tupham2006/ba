-- add user name to borrow
ALTER table `borrow` 
ADD COLUMN `user_name` varchar(50) NOT NULL;

update `borrow`, `user` 
set borrow.user_name = `user`.name 
where `user`.id = `borrow`.user_id;

ALTER table `borrow`
ADD COLUMN `update_user_name` varchar(50) NOT NULL;

ALTER table `borrow`
ADD COLUMN `update_user_id` int NOT NULL;

CREATE TABLE `borrow_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(50) DEFAULT NULL,
  `change_list` varchar(1000) DEFAULT '[]',
  `borrow_id` int(11) DEFAULT NULL,
  `borrow_book` varchar(10000) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `borrow_date` timestamp NULL DEFAULT NULL,
  `pay_date` timestamp NULL DEFAULT NULL,
  `note` varchar(10000) DEFAULT NULL,
  `deposit_name` varchar(50) NOT NULL,
  `deposit_id` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
