const CONST = require('../../const.js');
const moment = require("moment");

module.exports = {
	schema: true,
  tableName: "borrow",
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		user_id: { type: "integer", required: true, defaultsTo: 0 },
		user_name: { type: "string", required: true, defaultsTo: "" },
		update_user_name: { type: "string", defaultsTo: "" },
		update_user_id: { type: "integer", defaultsTo: 0 },
		reader_id: { type: "integer", required: true, defaultsTo: 0 },
		reader_name: { type: "string", required: true, defaultsTo: null },
		reader_mobile: { type: "string", maxLength: 11, required: true, defaultsTo: '0' },
		status: { type: "integer", required: true, defaultsTo: 1 }, // 0: lended, 1: borrowing
		expiry: { type: "integer", defaultsTo: 7 },
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
				skip: 0
			}).sort({
				borrow_date: "DESC",
				status: "DESC"
			})
			.exec(function (err, result) {
				if(err) return reject(err);
				return resolve(result);
			});
		});
	}, 

	countBorrow: function(condition){
		return new Promise(function(resolve, reject){
			Borrow.count(condition)
				.exec(function(err, result){
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
									
									// update reader
									Borrow.whenBorrowCreate(borrow)
										.then(function(readerResult){
											return readerResult;
										})

										.then(function(readerResult){
											
											// handle borrow book
											return Borrow.handleBookBorrow(borrow.id, data)
												.then(function(result){

													var syncData = {
														borrows: borrow,
														borrow_books: result,
														syncId: new Date().getTime()
													};
													return syncData;
												});
										})
										.then(function(syncData){
											return BorrowHistory.createBorrowHistory({id: borrow.id }, syncData.borrows, {}, syncData.borrow_books, 'create')
												.then(function(){
													return syncData;
												});
										})
										.then(function(syncData){
											// create borrow book
											Service.sync("borrow", "create", syncData);

											// socket broadcast
											return resolve(syncData);
										})
										.catch(function(err){
											return reject(err);
										});
								});	

						});
				});
		});

	},

	handleReaderBorrow: function(data){
		return new Promise(function(resolve, reject){
			var condition = {
				where: {
					deleted: 0,
					or: []
				}
			};

			if(data.reader_mobile) condition.where.or.push({ mobile: data.reader_mobile });
			if(data.reader_id) condition.where.or.push({ id: data.reader_id });

			var readerData = {
				mobile: data.reader_mobile,
				name: data.reader_name,
				facutly_id: data.facutly_id,
				course: data.course,
				gender: data.reader_gender
			};

			Reader.findOrCreateReader(condition, readerData)
				.then(function(findData){
					return resolve(findData.reader);
				})
				.catch(function(err){
					return reject(err);
				});
		});
	},

	handleBookBorrow: function(borrowId, data){
		return new Promise(function(resolve, reject){
			var promiseArray = [];

			for(var i in data.book){
				delete data.book[i].id;
				data.book[i].borrow_id = borrowId;
				data.book[i].borrow_date = data.borrow_date;
			}

			BorrowBook.create(data.book)
				.exec(function(err, result){
					if(err) reject(err);
					
					// update book
					Borrow.whenBorrowBookCreate(result)
						.then(function(){
							return resolve(result);
						})
						.catch(function(err){
							reject(err);
						});
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
											
											Borrow.whenBorrowBookDestroy(destroyResult)
												.then(function(){
													return;
												})
												.then(function(){
													// create new
													return Borrow.handleBookBorrow(borrowUpdateResult[0].id, data)
														.then(function(result){

															var syncData = {
																borrow_books: result,
																borrows: borrowUpdateResult[0],
																syncId: new Date().getTime()
															};
															return syncData;													
														});
												})
												.then(function(syncData){
													return BorrowHistory.createBorrowHistory(findResult, data, destroyResult, syncData.borrow_books, 'update')
														.then(function(){
															return syncData;
														});
												})
												.then(function(syncData){
													Service.sync("borrow", "update", syncData);

													// return to controller
													return resolve(syncData);
												})
												.catch(function(e){
													return reject(e);
												});
										});
								});
						});
				});
		});
	},

	deleteBorrow: function(condition, updateData){
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
					Borrow.update(condition, updateData)
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
									if(!destroyResult || !destroyResult.length) return reject({
										message: "Không có dữ liệu được xóa"
									});

									Borrow.whenBorrowBookDestroy(destroyResult)
										.then(function(){
											return;
										})
										.then(function(){
											// update reader when borrow destroy
											return Borrow.whenBorrowDestroy(borrowUpdateResult[0])	
												.then(function(){

													var syncData = {
														borrows: borrowUpdateResult[0],
														syncId: new Date().getTime()
													};

													return syncData;
												})
												.then(function(syncData){
													return BorrowHistory.createBorrowHistory({id: condition.id }, updateData, {}, {}, 'delete')
														.then(function(){
															return syncData;
														});
												})
												.then(function(syncData){
													Service.sync("borrow", "delete", syncData);

													// return to controller
													return resolve(syncData);
												})
												.catch(function(err){
													reject(err);
												});
										});
								});
						});
				});
		});
	},
	
	reportBorrowTime: function(condition) {

		return new Promise(function(resolve, reject){
			if(!condition.start_date) {
				condition.start_date = "1970-01-01T00:00:00.000Z";
			}

			if(!condition.end_date) {
				condition.end_date = new Date().toISOString();
			}

			if(!condition.limit) condition.limit = 10;
			if(isNaN(condition.offset)) condition.offset = 0;

			var sql = ["SELECT "];
			var value = [condition.start_date, condition.end_date, condition.limit, condition.offset];

			// value select
			sql.push("COUNT(*) AS times, borrow_date ");

			// table select
			sql.push("FROM borrow ");

			// where
			sql.push("WHERE deleted = 0 AND borrow_date >= ? ");

			sql.push("AND borrow_date <= ? ");

			// group
			sql.push("GROUP BY " + condition.view + "(borrow_date) ");

			// order
			sql.push("ORDER BY borrow_date ASC ");

			// limit
			sql.push("LIMIT ? OFFSET ? ");

			var queryStatement = sql.join("");

			Borrow.query(queryStatement, value, function(err, result){
				if(err) return reject(err);
				return resolve(result);				
			});
		});
	},

	// trigger ?? huhu
	reportBorrowBookTime: function(condition) {

		return new Promise(function(resolve, reject){
			if(!condition.start_date) {
				condition.start_date = "1970-01-01T00:00:00.000Z";
			}

			if(!condition.end_date) {
				condition.end_date = new Date().toISOString();
			}

			if(!condition.limit) condition.limit = 10;
			if(isNaN(condition.offset)) condition.offset = 0;

			var sql = ["SELECT "];
			var value = [condition.start_date, condition.end_date, condition.limit, condition.offset];

			// value select
			sql.push("COUNT(*) AS times, borrow_date, book_id, book_name");

			// table select
			sql.push("FROM borrow_book");

			// where
			sql.push("WHERE borrow_date >= ?");

			sql.push("AND borrow_date <= ?");

			// group
			sql.push("GROUP BY book_id");

			// order
			sql.push("ORDER BY COUNT(*) DESC");

			// limit
			sql.push("LIMIT ? OFFSET ?");

			var queryStatement = sql.join(" ");

			Borrow.query(queryStatement, value, function(err, result){
				if(err) return reject(err);
				return resolve(result);				
			});
		});
	},

	reportBorrowFacutly: function(condition) {

		return new Promise(function(resolve, reject){
			if(!condition.start_date) {
				condition.start_date = "1970-01-01T00:00:00.000Z";
			}

			if(!condition.end_date) {
				condition.end_date = new Date().toISOString();
			}

			var sql = ["SELECT "];
			var value = [condition.start_date, condition.end_date];

			// value select
			sql.push("COUNT(*) AS times, facutly_id ");

			// table select
			sql.push("FROM borrow ");

			// join
			sql.push("INNER JOIN reader ON borrow.reader_id = reader.id ");

			// where
			sql.push("WHERE borrow.deleted = 0 AND borrow_date >= ? ");

			sql.push("AND borrow_date <= ? ");

			// group
			sql.push("GROUP BY reader.facutly_id ");

			var queryStatement = sql.join("");

			Borrow.query(queryStatement, value, function(err, result){
				if(err) return reject(err);
				return resolve(result);				
			});
		});
	},

	reportBorrowCourse: function(condition){
		return new Promise(function(resolve, reject){

			if(!condition.start_date) {
				condition.start_date = "1970-01-01T00:00:00.000Z";
			}

			if(!condition.end_date) {
				condition.end_date = new Date().toISOString();
			}

			var sql = ["SELECT "];
			var value = [condition.start_date, condition.end_date];

			// value select
			sql.push("COUNT(*) AS times, course ");

			// table select
			sql.push("FROM borrow ");

			// join
			sql.push("INNER JOIN reader ON borrow.reader_id = reader.id ");

			// where
			sql.push("WHERE borrow.deleted = 0 AND borrow_date >= ? ");

			sql.push("AND borrow_date <= ? ");

			// group
			sql.push("GROUP BY reader.course ");

			var queryStatement = sql.join("");
			Borrow.query(queryStatement, value, function(err, result){
				if(err) return reject(err);
				return resolve(result);				
			});			
		});
	},

	reportBorrowReader: function(condition) {
		return new Promise(function(resolve, reject){
			if(!condition.start_date) {
				condition.start_date = "1970-01-01T00:00:00.000Z";
			}

			if(!condition.end_date) {
				condition.end_date = new Date().toISOString();
			}

			if(!condition.limit) condition.limit = 10;
			if(isNaN(condition.offset)) condition.offset = 0;

			var sql = ["SELECT "];
			var value = [condition.start_date, condition.end_date, condition.limit, condition.offset];

			// value select
			sql.push("COUNT(*) AS times, reader_name, reader_id, reader_mobile ");

			// table select
			sql.push("FROM borrow ");

			// where
			sql.push("WHERE borrow.deleted = 0 AND borrow_date >= ? ");

			sql.push("AND borrow_date <= ? ");

			// group
			sql.push("GROUP BY reader_id ");

			// order
			sql.push("ORDER BY COUNT(*) DESC ");

			// limit
			sql.push("LIMIT ? OFFSET ? ");

			var queryStatement = sql.join("");

			Borrow.query(queryStatement, value, function(err, result){
				if(err) return reject(err);
				return resolve(result);				
			});		
		});
	},

	reportBorrowUser: function(condition) {
		return new Promise(function(resolve, reject){

			// query user
			Reader.getReaderListIsUser()
				.then(function(readerResult){
					var readerIds = [], i;
					for(i in readerResult) {
						readerIds.push(readerResult[i].id);
					}

					return readerIds.toString();
				})
				.then(function(readerIds){
					if(!readerIds) {
						return resolve([]);
					}

					// query reader by user id
					if(!condition.start_date) {
						condition.start_date = "1970-01-01T00:00:00.000Z";
					}

					if(!condition.end_date) {
						condition.end_date = new Date().toISOString();
					}

					if(!condition.limit) condition.limit = 10;
					if(isNaN(condition.offset)) condition.offset = 0;

					var sql = ["SELECT "];
					var value = [condition.start_date, condition.end_date, condition.limit, condition.offset];

					// value select
					sql.push("COUNT(*) AS times, reader_name, reader_id, reader_mobile");

					// table select
					sql.push("FROM borrow ");

					// where
					sql.push("WHERE borrow.deleted = 0 AND borrow_date >= ?");

					sql.push("AND borrow_date <= ? AND reader_id IN (" + readerIds + ")");

					// group
					sql.push("GROUP BY reader_id");

					// order
					sql.push("ORDER BY COUNT(*) DESC");

					// limit
					sql.push("LIMIT ? OFFSET ?");

					var queryStatement = sql.join(" ");

					Borrow.query(queryStatement, value, function(err, result){
						if(err) return reject(err);
						return resolve(result);				
					});	
				});
		});
	},

  // chi update reader borrow time
  whenBorrowCreate: function(data) {
  	return new Promise(function(resolve, reject){
  		var updateData = {};
			Reader.updateReader(data.reader_id, updateData, ["increase_borrow_time"])
				.then(function(result){
					return resolve(result);
				})
				.catch(function(e){
					console.log(e)
				});
  	});
  },

 	// update reader borrow time when borrow destroy
  whenBorrowDestroy: function(data) {
  	return new Promise(function(resolve, reject){
  		var updateData = {};
			Reader.updateReader(data.reader_id, updateData, ["reduce_borrow_time"])
				.then(function(result){
					return resolve(result);
				})
				.catch(function(e){
					console.log(e)
				});
  	});
  },

	whenBorrowBookCreate: function(data) {
  	return new Promise(function(resolve, reject){
  		var i, promiseArray = [];

  		// create promise array
  		for(i in data) {
				promiseArray.push(new Promise(function (resolveAll, rejectAll){
  				var updateData = {}, dataObj = data[i], updateByFind;
					
					if(dataObj.status) {
						updateByFind = ["increase_borrow_time", "reduce_current_quantity"];
					} else {
						updateByFind = ["increase_borrow_time"];
					}

					Book.updateBook(dataObj.book_id, updateData, updateByFind)
						.then(function(result){
							return resolveAll();
						})
						.catch(function(e){
							console.log(e);
						});
				}));
  		}

  		Promise.all(promiseArray)
  			.then(function(result){
  				return resolve();
  			})
  			.catch(function(err){
  				return reject(err);
  			});
  	});
  },

  whenBorrowBookDestroy: function(data) {
  	return new Promise(function(resolve, reject){
  		var i, promiseArray = [];
  		for(i in data){
				promiseArray.push(new Promise(function (resolveAll, rejectAll){
  				var dataObj = data[i], updateByFind;

					if(dataObj.status) { // in db
						updateByFind = ['reduce_borrow_time', 'increase_current_quantity'];
					} else {
						updateByFind = ['reduce_borrow_time'];
					}

					Book.updateBook(dataObj.book_id, {}, updateByFind)
						.then(function(result){
							return resolveAll();
						}).catch(function(e){
							console.log(e);
						});
				}));
  		}

  		Promise.all(promiseArray)
  			.then(function(result){
  				return resolve();
  			})
  			.catch(function(err){
  				return reject(err);
  			});
  	});
  }
};