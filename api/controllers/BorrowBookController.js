/*
		Created at 13/11/2017
 */
const moment = require('moment');
const CONST = require('../../const.js');

module.exports = {
	getBorrowBookList: function (req, res) {
		
		BorrowBook.getAllBorrowBookList()
			.then(function(borrow_books){
				return res.json({
					borrow_books: borrow_books
				});
			})

			.catch(function(e){
				return Service.catch(req, res, e, "getBorrowBookList");
			});
	},
};