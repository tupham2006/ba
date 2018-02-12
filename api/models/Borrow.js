const CONST = require('../../const.js');
module.exports = {
	schema: true,
  tableName: "borrow",
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		user_id: { type: "integer", required: true, defaultsTo: 0 },
		reader_id: { type: "integer", required: true, defaultsTo: 0 },
		reader_name: { type: "string", required: true, defaultsTo: '' },
		reader_mobile: { type: "string", maxLength: 11, required: true, defaultsTo: '0' },
		status: { type: "integer", required: true, defaultsTo: 1 }, // 0: lended, 1: borrowing
		borrow_date: { type: "datetime", required: true, defaultsTo: null },
		pay_date: { type: "datetime", defaultsTo: null },
		note: { type: "string", size:10000, maxLength:10000, defaultsTo: "" },
		deposit_id: {type: "integer", required: true, defaultsTo: 1 },
		deposit_name: { type: "string", maxLength: 50, defaultsTo: '' },
		deleted: { type: "integer", defaultsTo: 0 },
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" }
	},
	/**
	 * Get all data borrow to cache to service
	 * @return {[type]} data
	 */	
	getAllBorrowList: function () {
		return new Promise(function (resolve, reject) {
			Borrow.find({
				where:{
				 deleted: CONST.DELETED.NO,
				},
				limit: 5000,
				skip: 0,
				sort: "borrow_date desc"
			})
			.exec(function (err, result) {
				if(err) return reject(err);
				return resolve(result);
			});
		});
	}, 

	createBorrow: function(data){
		return new Promise(function(resolve, reject){

			Borrow.handleReaderBorrow(data)
				.then(function(readerData){

					data.reader_id = readerData.id;
					data.reader_name = readerData.name;
					data.reader_mobile = readerData.mobile;
					data.facutly = readerData.facutly;
					data.course = readerData.course;

					// Find deposit
					Deposit.findOne({id: data.deposit_id})
						.exec(function(depositErr, deposit){
							if(depositErr) return reject(depositErr);

							if(!deposit){
								return reject({
									message: "Bạn chưa chọn loại đặt cọc"
								});
							}

							data.deposit_name = deposit.name;
							
							// Create borrow
							Borrow.create(data)
								.exec(function(borrowErr, borrow){
									if(borrowErr) return reject(borrowErr);

									// create book borrow
									Borrow.handleBookBorrow(borrow.id, data)
									.then(function(result){

										// add borrow_time temp to reader
										readerData.borrow_time += 1;

										return resolve({
											borrows: borrow,
											borrow_books: result,
											readers: readerData
										});
									});
								});	

						});
				});
		});

	},

	handleReaderBorrow: function(data){

		return new Promise(function(resolve, reject){
			var condition = {
				mobile: data.reader_mobile
			};

			var readerData = {
				mobile: data.reader_mobile,
				name: data.reader_name,
				facutly: data.facutly,
				course: data.course
			};

			// find reader by id
			if(data.reader_id){
				Reader.findOne({id: data.reader_id})
					.exec(function(err, readerById){
						if(err) return reject(err);
						if(readerById){ // update
							
							data.reader_mobile = readerById.mobile;
							data.reader_name = readerById.name;
							data.facutly = readerById.facutly;
							data.course = readerById.course;
							return resolve(readerById);

						} else { // find by mobile
							Reader.findOne(condition)
								.exec(function(err, findData){
									if(err) return reject(err);
									if(findData){
										findData.exist_reader = true;
										return resolve(findData);

									} else {
										Reader.create(readerData)
											.exec(function(err, readerByMobile){
												if(err) return reject(err);
												return resolve(readerByMobile);
											});
									}
								});
						}
					});

			 // find by mobile					
			} else {
				Reader.findOne(condition)
					.exec(function(err, findData){
						if(err) return reject(err);
						if(findData){
							findData.exist_reader = true;
							return resolve(findData);

						} else {
							Reader.create(readerData)
								.exec(function(err, readerByMobile){
									if(err) return reject(err);
									return resolve(readerByMobile);
								});
						}
					});
			}
		});
	},

	handleBookBorrow: function(borrowId, data){
		return new Promise(function(resolve, reject){
			var promiseArray = [];

			for(var i in data.book){
				data.book[i].borrow_id = borrowId;
			}

			// console.log("data.book", data.book);
			BorrowBook.create(data.book)
				.exec(function(err, result){
					// console.log("result", result);
					if(err) reject(err);
					return resolve(result);
				});
		});
	},

	updateBorrow: function(condition, data){
		return new Promise(function(resolve, reject){
			Borrow.findOne(condition)
				.exec(function(err, findResult){
					if(err) return reject(err);
					if(!findResult){
						return reject({
							message: "Lượt mượn không tồn tại"
						});
					}
					// update borrow
					Borrow.update(condition, data)
						.exec(function(borrowUpdateErr, borrowUpdateResult){
							if(borrowUpdateErr) return reject(borrowUpdateErr);
							if(!borrowUpdateResult || !borrowUpdateResult.length){
								return reject({
									message: "Borrow update return result:: " + borrowUpdateResult
								});
							}

							// delete borrow book
							BorrowBook.destroy({borrow_id: borrowUpdateResult[0].id})
								.exec(function(destroyErr, destroyResult){
									if(destroyErr) return reject(destroyErr);

									// create new
									Borrow.handleBookBorrow(borrowUpdateResult[0].id, data)
										.then(function(result){

											// return to controller
											return resolve({
												borrow_books: result,
												borrows: borrowUpdateResult[0]
											});
										})

										.catch(function(e){
											return reject(e);
										});
									
								});
						});
				});
		});
	},

	deleteBorrow: function(condition){
		return new Promise(function(resolve, reject){
			Borrow.findOne(condition)
				.exec(function(err, findResult){
					if(err) return reject(err);
					if(!findResult){
						return reject({
							message: "Lượt mượn không tồn tại"
						});
					}
					// update borrow
					Borrow.update(condition, { deleted: 1 })
						.exec(function(borrowUpdateErr, borrowUpdateResult){
							if(borrowUpdateErr) return reject(borrowUpdateErr);
							if(!borrowUpdateResult || !borrowUpdateResult.length){
								return reject({
									message: "Borrow update return result:: " + borrowUpdateResult
								});
							}

							// delete borrow book
							BorrowBook.destroy({ borrow_id: condition.id })
								.exec(function(destroyErr, destroyResult){
									if(destroyErr) return reject(destroyErr);
											// return to controller
											return resolve({
												borrow_books: destroyResult,
												borrows: borrowUpdateResult[0]
											});
								});
						});
				});
		});
	}
};