const CONST = require('../../const.js');
module.exports = {
	reportBorrowTime: function (req, res) {
		var startDate = req.param("start_date");
		var endDate = req.param("end_date");
		var limit = parseInt(req.param("limit")) ? parseInt(req.param("limit")) : 10;
		var offset = parseInt(req.param("offset")) > 0 ? parseInt(req.param("limit")) : 0;

		var condition = {
			start_date: startDate,
			end_date: endDate,
			limit: limit,
			offset: offset
		};

		Borrow.reportBorrowTime(condition)
			.then(function(borrowResult){

				// report borrow book
				BorrowBook.reportBorrowBook(condition)
					.then(function(borrowBookResult){
						return res.json({
							data: {
								borrow: borrowResult,
								borrow_book: borrowBookResult
							}
						});
					})

					.catch(function(e){
						return Service.catch(req, res, e, "reportBorrowTime");
					});
					
			})

			.catch(function(e){
				return Service.catch(req, res, e, "reportBorrowTime");
			});
	}
};