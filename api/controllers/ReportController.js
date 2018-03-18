const CONST = require('../../const.js');
module.exports = {
	reportBorrowTime: function (req, res) {
		var startDate = new Date(req.param("start_date")) != "Invalid Date" ? new Date(req.param("start_date")).toISOString() : undefined;
		var endDate = new Date(req.param("end_date")) != "Invalid Date" ? new Date(req.param("end_date")).toISOString() : undefined;
		var limit = parseInt(req.param("limit")) ? parseInt(req.param("limit")) : 10;
		var offset = parseInt(req.param("offset")) > 0 ? parseInt(req.param("limit")) : 0;
		var view = ["DATE", "WEEK", "MONTH"].indexOf(req.param('view')) > -1 ? req.param('view') : "DATE";
		var condition = {
			start_date: startDate,
			end_date: endDate,
			limit: limit,
			offset: offset,
			view: view
		};

		Borrow.reportBorrowTime(condition)
			.then(function(borrowResult){

				// report facutly
				Borrow.reportBorrowFacutly(condition)
							.then(function(facutlyResult){

								// report course
								Borrow.reportBorrowCourse(condition)
									.then(function(courseResult){

										Borrow.reportBorrowReader(condition)
											.then(function(readerResult){

												return res.json({
													data: {
														borrow: borrowResult,
														facutly: facutlyResult,
														course: courseResult,
														reader: readerResult
													}
												});

											})
											.catch(function(e){
												return Service.catch(req, res, e, "reportBorrowReader");
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
				return Service.catch(req, res, e, "reportBorrowTime");
			});
	}
};