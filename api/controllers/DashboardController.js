module.exports = {
	getDashboard: function (req, res) {

		var startDate = new Date(req.param("start_date")) != "Invalid Date" ? new Date(req.param("start_date")).toISOString() : undefined;
		var endDate = new Date(req.param("end_date")) != "Invalid Date" ? new Date(req.param("end_date")).toISOString() : undefined;

		var returnData = {};
		var condition = {
			start_date: startDate,
			end_date: endDate,
			limit: 1000,
			view: "DATE"
		};

		Borrow.reportBorrowTime(condition)
			.then(function(borrowResult){
				returnData.borrow = {
					data: borrowResult
				};
		})
		.then(function(){
			return BorrowBook.countBorrowBook({
				borrow_date: {
					">=": new Date(startDate),
					"<=": new Date(endDate)
				}
			})
			.then(function(borrow_book_count){
				returnData.borrow.borrow_book_count = borrow_book_count;
			});
		})
		.then(function(){
			return Borrow.reportBorrowReader({
				start_date: startDate,
				end_date: endDate,
				limit: 3
			})
				.then(function(maxBorrowReader){
					if(maxBorrowReader.length > 0) {
						returnData.borrow.top_reader = maxBorrowReader;
					} else {
						returnData.borrow.top_reader = [];
					}
					return;
				});
		})
		.then(function(){
			return Borrow.reportBorrowUser({
				start_date: startDate,
				end_date: endDate,
				limit: 1,
			})
				.then(function(maxBorrowUser){
					if(maxBorrowUser.length > 0) {
						returnData.borrow.top_user = maxBorrowUser[0];
					} else {
						returnData.borrow.top_user = [{
							reader_name: "Chưa có",
							times: 0
						}];
					}
					return;
				});
		})
		.then(function(){
			return Borrow.reportBorrowBookTime({
				start_date: startDate,
				end_date: endDate,
				limit: 3,
				view: 'DATE'
			})
				.then(function(borrowBookResult){
					returnData.borrow.top_book = borrowBookResult;
					return;
				});
		})
		.then(function(){
			return res.json({
				data: returnData
			});
		})
		.catch(function(e){
			return Service.catch(req, res, e, "getDashboard");
		});
	}
};