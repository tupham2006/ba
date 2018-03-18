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

		Borrow.countBorrow({
			deleted: 0	
		})
		.then(function(borrowCount){
			returnData.borrow_count = borrowCount;
		})
		.then(function(){
			return Book.countBook()
				.then(function(bookCount){
					returnData.book_count = bookCount;
				});
		})
		.then(function(){
			return Reader.countReader({
				actived: 1
			})
			.then(function(readerCount){
				returnData.reader_count = readerCount;
			});
		})
		.then(function(){
			return Borrow.reportBorrowTime(condition)
				.then(function(borrowResult){
					returnData.borrow = {
						data: borrowResult
					};
				});
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
				limit: 1
			})
				.then(function(maxBorrowReader){
					if(maxBorrowReader.length > 0) {
						returnData.borrow.max_borrow_reader = maxBorrowReader[0];
					} else {
						returnData.borrow.max_borrow_reader = {
							reader_name: "Chưa có",
							times: 0
						};
					}
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