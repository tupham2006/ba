/*
		Created at 11/11/2017
 */
const CONST = require('../../const.js');
module.exports = {
	tableName: "book",
	schema: true,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		name: { type: "string", size: 100, maxLength: 100, required: true, defaultsTo: '' },
		image: { type: "string", size: 200, maxLength: 200, defaultsTo: null },
		type_id: { type: "integer", required: true },
		type_name: { type: "string", required: true, maxLength: 50, defaultsTo: "Loại chung" },
		hot: { type: "integer", defaultsTo: 0 }, // 1: hot book
		comment_time: { type: "integer", defaultsTo: 0 }, // 1: hot book
		love_time: { type: "integer", defaultsTo: 0 }, // 1: hot book
		hate_time: { type: "integer", defaultsTo: 0 }, // 1: hot book
		borrow_time: { type: "integer", defaultsTo: 0 },
		author: { type: "string", size:100, maxLength: 100, defaultsTo: "" },
		intro: { type: "string", size:10000, maxLength: 10000, defaultsTo: "" },
		use_quantity: { type: 'integer', defaultsTo: 1 }, // quantity can borrow
		inventory_quantity: { type: 'integer', defaultsTo: 0 }, // book quantity in inventory
		current_quantity: { type: 'integer', defaultsTo: 1}, // current quantity, 0: not ready borrow
		note: { type: "string", size:10000, maxLength: 10000, defaultsTo: "" },
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" }
	},

	getBookList: function (condition) {
		return new Promise(function(resolve, reject){
			Book.find(condition)
				.exec(function(err, result){
					if(err) return reject(err);
					return resolve(result);
				});
		});
	},

	countBook: function(search){
		var condition = {};
		if(search && search.where) {
			if(search.where.name) condition.name =  search.where.name;
			if(search.where.type_id) condition.type_id = search.where.type_id;
			if(search.where.use_quantity) condition.use_quantity = search.where.use_quantity;
		}
		
		return new Promise(function(resolve, reject){
			Book.count(condition)
				.exec(function(err, count){
					if(err) return reject(err);
					return resolve(count);
				});
		});
	},

	getBookById: function(bookId) {
		return new Promise(function(resolve, reject){
			Book.findOne({
				id: bookId
			}).exec(function(err, result){
				if(err) return reject(err);
				return resolve(result);
			});
		});
	},

	updateBook: function(id, data){
		return new Promise(function(resolve, reject){
			Book.findOne({
				id: id
			}).exec(function(err, result){
				if(err) return resolve(err);
				if(!result){
					return reject({
						message: "Sách không tồn tại"
					});
				}
				
				// recalc quantity when increase quantity
				if(!data.current_quantity) {
					if(data.use_quantity > result.use_quantity){
						data.current_quantity = result.current_quantity + (data.use_quantity - result.use_quantity);

					} else if(data.use_quantity < result.use_quantity) { // when reduce quantity
						data.current_quantity = result.current_quantity - (result.use_quantity - data.use_quantity);
					}
				}

				Book.update(id, data)
					.exec(function(err, result){
						if(err) return reject(err);
						if(result && result.length){
							return resolve(result[0]);
						} else {
							return reject({
								message: "Cập nhật không thành công "
							});
						}
					});				
			});
		});
	},

	createBook: function(data){
		return new Promise(function(resolve, reject){
			Book.findOne({
				name: data.name,
				type_id: data.type_id
			}).exec(function(err, result){
				if(err) return resolve(err);
				if(result){
					return reject({
						message: "Sách đã tồn tại"
					});
				}

				Book.create(data)
					.exec(function(err, result){
						if(err) return reject(err);
						return resolve(result);
					});				
			});
		});
	},

	reportBookType: function(condition) {
		return new Promise(function(resolve, reject){

      var sql = ["SELECT "];

      // value select
      sql.push("COUNT(*) AS times, type_name ");

      // table select
      sql.push("FROM book ");

      // where
      sql.push("WHERE use_quantity > 0 OR inventory_quantity > 0 ");

      // group
      sql.push("GROUP BY type_id ");

      var queryStatement = sql.join("");

      Borrow.query(queryStatement, function(err, result){
        if(err) return reject(err);
        return resolve(result);       
      });   
    });
	},

	getBookPublic: function(condition, limit, offset, sort_name, sort_type, userId) {
		return new Promise(function(resolve, reject){
			var result = {};

			Book.getBookList({
				where: condition,
				limit: limit,
				skip: offset,
				sort: sort_name + ' ' + sort_type
			}).then(function(bookResult){

				result.books = bookResult;
				return result;
			})
			.then(function(result){
				return Book.countBook({where: condition})
					.then(function(count){
						result.count = count;
						return result;
					});
			})
			.then(function(result){
				return BookComment.find({where: { deleted: 0, actived: 1 }, sort: "createdAt DESC"})
					.then(function(commentResult){
						result.comments = commentResult;
						return result;
					});
			})
			.then(function(result){
				var bookList = [];

				if(userId){
					BookRating.getBookRatingByUserId(userId)
						.then(function(bookRatingResult){
							result.ratings = bookRatingResult;
							bookList = Book.filterBook(result);

							return resolve ({
								book_count: result.count,
								books: bookList
							});

						})
						.catch(function(err){
							return reject(err);
						});

				} else {
					bookList = Book.filterBook(result);
					return resolve ({
						book_count: result.count,
						books: bookList
					});
				}
			})
			.catch(function(err){
				return reject(err);
			});
		});
	},

	filterBook: function(result) {
		var bookList = [];
		// handle comment
		var commentObj = {}, i, j, k, bookRatingObj = {};

		if(result.comments && result.comments.length) {
      for(i in result.comments) {
        if(!commentObj[result.comments[i].book_id]) {
        	commentObj[result.comments[i].book_id] = [];
        }
        commentObj[result.comments[i].book_id].push(result.comments[i]);
			}
    }

    // handle rating
    if(result.ratings && result.ratings.length) {
			for(j in result.ratings) {
				bookRatingObj[result.ratings[j].book_id] = result.ratings[j].type;
			}
		}

		if(result.books && result.books.length > 0) {
			for(k in result.books) {

				// add comment to book
				result.books[k].comment = [];
				if(Object.getOwnPropertyNames(commentObj).length) {
					if(commentObj[result.books[k].id]) {
						result.books[k].comment = commentObj[result.books[k].id];
					}
				}

				if(Object.getOwnPropertyNames(bookRatingObj).length) {
					if(bookRatingObj[result.books[k].id] >= 0) {
						result.books[k].is_rating = bookRatingObj[result.books[k].id];
					}
				}

				bookList.push({
					id: result.books[k].id,
					name: result.books[k].name,
					image: result.books[k].image,
					hot: result.books[k].hot,
					author: result.books[k].author,
					intro: result.books[k].intro,
					current_quantity: result.books[k].current_quantity,
					comment_time: result.books[k].comment_time,
					love_time: result.books[k].love_time,
					hate_time: result.books[k].hate_time,
					type_name: result.books[k].type_name,
          borrow_time: result.books[k].borrow_time,
					comment: result.books[k].comment,
					is_rating: result.books[k].is_rating
				});
			}
		}

		return bookList;
	},

	afterCreate:function (value, cb) {
  	Service.sync('book', "create", value);
  	cb();
  },

  afterUpdate:function (value, cb) {
    Service.sync('book', "update", value);
  	cb();
  }
};