const CONST = require('../../const.js');
module.exports = {
	reportBorrowTime: function (req, res) {
		var startDate = new Date(req.param("start_date")) ? new Date(req.param("start_date")).toISOString() : undefined;
		var endDate = new Date(req.param("end_date")) ? new Date(req.param("end_date")).toISOString() : undefined;
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

						// report facutly
						Borrow.reportBorrowFacutly(condition)
							.then(function(facutlyResult){

								// report course
								Borrow.reportBorrowCourse(condition)
									.then(function(courseResult){

										return res.json({
											data: {
												borrow: borrowResult,
												borrow_book: borrowBookResult,
												facutly: facutlyResult,
												course: courseResult
											}
										});
									})

									.catch(function(e){
										return Service.catch(req, res, e, "reportBorrowCourse");
									});
							})

							.catch(function(e){
								return Service.catch(req, res, e, "reportBorrowFacutly");
							});
					})

					.catch(function(e){
						return Service.catch(req, res, e, "reportBorrowBook");
					});
					
			})

			.catch(function(e){
				return Service.catch(req, res, e, "reportBorrowTime");
			});
	}
};