DROP TRIGGER IF EXISTS `after_borrow_create`;
DROP TRIGGER IF EXISTS `after_borrow_book_create`;
DROP TRIGGER IF EXISTS `after_borrow_book_delete`;

/*
		Borrow trigger
 */
DELIMITER $$
CREATE TRIGGER `after_borrow_create`
	AFTER INSERT ON borrow
	FOR EACH ROW
BEGIN
    UPDATE reader SET borrow_time = borrow_time + 1 WHERE id = NEW.reader_id;
END
$$

/*
		Borrow book trigger
 */
-- this trigger to update borrow_time in book table when create book_borrow
DELIMITER $$
CREATE TRIGGER `after_borrow_book_create`
	AFTER INSERT ON borrow_book
	FOR EACH ROW
BEGIN
	IF (NEW.status = 1) THEN
		UPDATE book SET borrow_time = borrow_time + 1, current_quantity = current_quantity - 1 WHERE id = NEW.book_id;

	ELSEIF (NEW.status = 0) THEN
		UPDATE book SET borrow_time = borrow_time + 1 WHERE id = NEW.book_id; 
	END IF;
END $$

-- trigger when delete borrow book
DELIMITER $$
CREATE TRIGGER `after_borrow_book_delete`
	AFTER DELETE ON borrow_book
	FOR EACH ROW
BEGIN
	IF(OLD.status = 1) THEN
		UPDATE book SET borrow_time = borrow_time - 1, current_quantity = current_quantity + 1 WHERE id = OLD.book_id;
	ELSEIF(OLD.status = 0) THEN
		UPDATE book SET borrow_time = borrow_time - 1 WHERE id = OLD.book_id;
	END IF;
END
$$