const CONST = require('../../const.js');
const moment = require("moment");

module.exports = {
	schema: true,
  tableName: "borrow",
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		user_id: { type: "integer", required: true, defaultsTo: 0 },
		reader_id: { type: "integer", required: true, defaultsTo: 0 },
		reader_name: { type: "string", required: true, defaultsTo: null },
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

													return resolve({
														borrows: borrow,
														borrow_books: result,
														readers: readerResult
													});
												});
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
				mobile: data.reader_mobile,
				deleted: 0
			};

			var readerData = {
				mobile: data.reader_mobile,
				name: data.reader_name,
				facutly_id: data.facutly_id,
				course: data.course,
				gender: data.reader_gender
			};

			// find reader by id
			if(data.reader_id){
				Reader.findOne({id: data.reader_id, deleted: 0})
					.exec(function(err, readerById){
						if(err) return reject(err);
						if(readerById){ // update
							
							data.reader_mobile = readerById.mobile;
							data.reader_name = readerById.name;
							data.facutly_id = readerById.facutly_id;
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

													// return to controller
													return resolve({
														borrow_books: result,
														borrows: borrowUpdateResult[0]
													});
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
														// return to controller
														return resolve({
															borrow_books: destroyResult,
															borrows: borrowUpdateResult[0]
														});
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
	// trigger ?? huhu
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
			sql.push("GROUP BY " + condition.view + "(borrow_date)");

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
						return [];
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

	afterCreate:function (value, cb) {
		Service.sync('borrow', "create", value);
		cb();
  },

  afterUpdate: function (value, cb) {
  	if(value && value.deleted ){
			Service.sync('borrow', "delete", value);
  	} else {
			Service.sync('borrow', "update", value);
  	}
		cb();
  },

  // chi update reader borrow time
  whenBorrowCreate: function(data) {
  	return new Promise(function(resolve, reject){
  		var updateData = {};
  		Reader.findOne({id: data.reader_id})
  			.exec(function(err, result){
  				if(err) reject(err);
  				if(result) {
  					updateData.borrow_time = result.borrow_time + 1;

  					Reader.update({id: result.id}, updateData)
  						.exec(function(err, result){
  							if(err) return reject(err);
  							resolve(result);
  						});

  				} else {
  					return resolve();
  				}
  			});
  	});
  },

 	// update reader borrow time when borrow destroy
  whenBorrowDestroy: function(data) {
  	return new Promise(function(resolve, reject){
  		var updateData = {};
  		Reader.findOne({id: data.reader_id})
  			.exec(function(err, result){
  				if(err) reject(err);
  				if(result) {
  					updateData.borrow_time = result.borrow_time - 1;

  					Reader.update({id: result.id}, updateData)
  						.exec(function(err, result){
  							if(err) return reject(err);
  							resolve(result);
  						});
  						
  				} else {
  					return resolve();
  				}
  			});
  	});
  },

	whenBorrowBookCreate: function(data) {
  	return new Promise(function(resolve, reject){
  		var i, promiseArray = [];

  		// create promise array
  		for(i in data) {
				promiseArray.push(new Promise(function (resolveAll, rejectAll){
  				var updateData = {};
					var dataObj = data[i];
					Book.findOne({
						id: dataObj.book_id
					}).exec(function(err, findRs){
						if(err) return rejectAll(err);

						if(findRs) {
							if(dataObj.status) {
								updateData.borrow_time = findRs.borrow_time + 1;
								updateData.current_quantity = findRs.current_quantity - 1;
							} else {
								updateData.borrow_time = findRs.borrow_time + 1;
							}

							Book.update({ id: findRs.id }, updateData)
								.exec(function(err, result){
									if(err) return rejectAll(err);
									return resolveAll(result);
								});
						} else {
							return rejectAll();
						}
					});
				}));
  		}

  		Promise.all(promiseArray)
  			.then(function(result){
  				return resolve(result);
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
  				var dataObj = data[i];
					Book.findOne({ id: dataObj.book_id })
					.then(function(findRs){
						var updateData = {};
						
						if(findRs) {

							if(dataObj.status) { // in db
								updateData.borrow_time = findRs.borrow_time - 1;
								updateData.current_quantity = findRs.current_quantity + 1;
							} else {
								updateData.borrow_time = findRs.borrow_time - 1;
							}
						}

						return {
							updateData: updateData,
							id: findRs.id
						};
					})
					.then(function(updateObj){
						if(!updateObj.updateData) return resolveAll();

						return Book.update({id: updateObj.id}, updateObj.updateData)
							.then(function(result){
								return resolveAll(result);
							});
					})
					.catch(function(err){
						return rejectAll(err);
					});
				}));
  		}

  		Promise.all(promiseArray)
  			.then(function(result){
  				return resolve(result);
  			})
  			.catch(function(err){
  				return reject(err);
  			});
  	});
  },
};