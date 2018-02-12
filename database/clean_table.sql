DELETE from borrow;
DELETE from borrow_book;

-- balance book quantity
UPDATE book SET current_quantity = use_quantity;