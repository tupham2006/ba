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
			user_id : req.session.user ? req.session.user.id : 0,
			user_name: req.session.user ? req.session.user.name : "",
			reader_id : parseInt(req.param("reader_id")),
			reader_mobile: (parseInt(req.param("reader_mobile")) ? req.param("reader_mobile") : "").toString().replace(/^0-9/g, ""),
			reader_name: req.param("reader_name") ? req.param("reader_name") : "",
			reader_gender: parseInt(req.param("reader_gender")) ? parseInt(req.param("reader_gender")) : 0,
			note: req.param("note"),
			deposit_id: parseInt(req.param("deposit_id")),
			book: req.param("book"),
			borrow_date: new Date(req.param("borrow_date")).toISOString(),
			status: parseInt(req.param("status")) ? parseInt(req.param("status")) : 0,
			facutly_id: req.param("facutly_id") ? req.param("facutly_id") : 1,
			expiry: 7
		};
		
		if(parseInt(req.param("course"))) {
			data.course = parseInt(req.param("course"));
		}

		if(!data.book || !Array.isArray(data.book) || !data.book.length){
			return Service.catch(req, res, { message: "Bạn phải chọn sách mượn" }, "createBorrow");
		}

		if(!data.deposit_id){
			return Service.catch(req, res, { message: "Vui lòng nhập loại đặt cọc" }, "createBorrow");
		}

		if(!data.status){
			if(new Date(req.param("pay_date")) != "Invalid Date"){
				data.pay_date = new Date(req.param("pay_date")).toISOString();
			} else {
				data.pay_date = new Date().toISOString();
			}
		}

		// console.log("data", data);
		Borrow.createBorrow(data)
			.then(function(result){
				return res.json(result);
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
			update_user_id : req.session.user ? req.session.user.id : 0,
			update_user_name: req.session.user ? req.session.user.name : "",
			note: req.param("note"),
			deposit_id: parseInt(req.param("deposit_id")),
			book: req.param("book"),
			borrow_date: new Date(req.param("borrow_date")).toISOString(),
			status: parseInt(req.param("status")) ? parseInt(req.param("status")) : 0,
		};

		if(parseInt(req.param("expiry"))) data.expiry = parseInt(req.param("expiry"));
		
		if(!data.book || !Array.isArray(data.book) || !data.book.length){
			return Service.catch(req, res, { message: "Bạn phải chọn sách mượn" }, "updateBorrow");
		}

		if(!data.deposit_id){
			return Service.catch(req, res, { message: "Vui lòng nhập loại đặt cọc" }, "updateBorrow");
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
				return res.json(result);
			})
			.catch(function(e){
				return Service.catch(req, res, e, "updateBorrow");
			});
	},

	deleteBorrow: function(req, res){

		if(!parseInt(req.param("id"))) {
			return Service.catch(req, res, { message: "Bạn cần nhập ID lượt mượn" }, "updateBorrow");
		}

		var updateData = {
			update_user_id : req.session.user ? req.session.user.id : 0,
			update_user_name: req.session.user ? req.session.user.name : "",
			deleted: 1
		};
		
		// console.log("data", data);
		Borrow.deleteBorrow({id: parseInt(req.param("id"))}, updateData)
			.then(function(result){
				return res.json(result);
			})
			.catch(function(e){
				return Service.catch(req, res, e, "deleteBorrow");
			});
	}
};