/*
		Created at 13/11/2017
 */
const moment = require('moment');
const CONST = require('../../const.js');
module.exports = {
	getBorrowList: function (req, res) {
		// Query
		Borrow.getAllBorrowList()
			.then(function(borrows){
				return res.json({
					borrows: borrows
				});
			})

			.catch(function(e){
				return Service.catch(req, res, e, "getBorrowList");
			});
	},

	createBorrow: function(req, res){

		if(new Date(req.param("borrow_date")) == "Invalid Date"){
			return Service.catch(req, res, { message: "Bạn cần nhập ngày mượn" }, "createBorrow");
		}

		// data
		data = {
			user_id : parseInt(req.param("user_id")),
			reader_id : parseInt(req.param("reader_id")),
			reader_mobile: (parseInt(req.param("reader_mobile")) ? req.param("reader_mobile") : "").toString().replace(/^0-9/g, ""),
			reader_name: req.param("reader_name") ? req.param("reader_name") : "",
			note: req.param("note"),
			deposit_id: parseInt(req.param("deposit_id")),
			book: req.param("book"),
			borrow_date: new Date(req.param("borrow_date")).toISOString(),
			status: 0,
			facutly: req.param("facutly") ? req.param("facutly") : "CHUA_PHAN_KHOA",
			course: parseInt(req.param("course")) ? parseInt(req.param("course")) : moment().get('years') - 1956
		};
		
		if(!data.book || !Array.isArray(data.book) || !data.book.length){
			return Service.catch(req, res, { message: "Bạn phải chọn sách mượn" }, "createBorrow");
		}

		if(!data.deposit_id){
			return Service.catch(req, res, { message: "Vui lòng nhập loại đặt cọc" }, "createBorrow");
		}

		// check status by book
		for(var i in data.book){
			if(data.book[i].status){
				data.status = 1;
			}
		}
		
		// console.log("data", data);
		Borrow.createBorrow(data)
			.then(function(result){
				return res.json({
					borrows: result.borrows,
					borrow_books: result.borrow_books,
					readers: result.readers
				});
			})
			.catch(function(e){
				return Service.catch(req, res, e, "createBorrow");
			});
 	},

	updateBorrow: function(req, res){
		if(new Date(req.param("borrow_date")) == "Invalid Date"){
			return Service.catch(req, res, { message: "Bạn cần nhập ngày mượn" }, "updateBorrow");
		}

		if(!parseInt(req.param("id"))) {
			return Service.catch(req, res, { message: "Bạn cần nhập ID lượt mượn" }, "updateBorrow");
		}

		// data
		data = {
			user_id : parseInt(req.param("user_id")),
			note: req.param("note"),
			deposit_id: parseInt(req.param("deposit_id")),
			book: req.param("book"),
			borrow_date: new Date(req.param("borrow_date")).toISOString(),
			status: 0
		};
		
		if(!data.book || !Array.isArray(data.book) || !data.book.length){
			return Service.catch(req, res, { message: "Bạn phải chọn sách mượn" }, "updateBorrow");
		}

		if(!data.deposit_id){
			return Service.catch(req, res, { message: "Vui lòng nhập loại đặt cọc" }, "updateBorrow");
		}

		// check status by book
		for(var i in data.book){
			if(data.book[i].status){
				data.status = 1;
			}
		}

		if(!data.status){
			if(new Date(req.param("pay_date")) != "Invalid Date"){
				data.pay_date = new Date(req.param("pay_date")).toISOString();
			} else {
				data.pay_date = new Date().toISOString();
			}
		}
		
		// console.log("data", data);
		Borrow.updateBorrow({id: parseInt(req.param("id"))}, data)
			.then(function(result){
				return res.json({
					borrows: result.borrows,
					borrow_books: result.borrow_books
				});
			})
			.catch(function(e){
				return Service.catch(req, res, e, "updateBorrow");
			});
	},

	deleteBorrow: function(req, res){

		if(!parseInt(req.param("id"))) {
			return Service.catch(req, res, { message: "Bạn cần nhập ID lượt mượn" }, "updateBorrow");
		}
		
		// console.log("data", data);
		Borrow.deleteBorrow({id: parseInt(req.param("id"))})
			.then(function(result){
				return res.json({
					borrows: result.borrows,
				});
			})
			.catch(function(e){
				return Service.catch(req, res, e, "deleteBorrow");
			});
	}
};