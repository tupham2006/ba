-- add user name to borrow
ALTER table `borrow` 
ADD COLUMN `user_name` varchar(50) NOT NULL;

update `borrow`, `user` 
set borrow.user_name = `user`.name 
where `user`.id = `borrow`.user_id;
