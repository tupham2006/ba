DELETE from borrow_book;
DELETE from borrow;

-- balance book quantity
UPDATE book SET current_quantity = use_quantity;