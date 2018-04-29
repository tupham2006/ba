const CONST = require('../../const.js');
module.exports = {
	tableName: "borrow_book",
	schema: true,
	globalId: 'BorrowBook',
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		borrow_id: { type: "integer", required: true, defaultsTo: 0},
		book_id: { type: "integer", required: true, defaultsTo: 0},
		book_name: { type: "string", size: 100, maxLength: 100, required: true },
		status: { type: "integer", defaultsTo: 1 },
		borrow_date: { type: "datetime", required: true, defaultsTo: null }
	},

	getAllBorrowBookList: function () {
		return new Promise(function(resolve, reject){
			BorrowBook.find({
				limit: 10000,
				skip: 0,
				sort: "id desc"
			}).exec(function(err, result){
				if(err) return reject(err);
				return resolve(result);
			});
		});
	},

	countBorrowBook: function(condition) {
		return new Promise(function(resolve, reject){
			BorrowBook.count(condition)
				.exec(function(err, result){
					if(err) return reject(err);
					return resolve(result);
				});
		});
	},

	reportBorrowBook: function(condition){

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
			sql.push("COUNT(*) AS times, borrow_date ");

			// table select
			sql.push("FROM borrow_book ");

			// where
			sql.push("WHERE borrow_date >= ? ");

			sql.push("AND borrow_date <= ? ");

			// group
			sql.push("GROUP BY DATE(borrow_date)");
			
			// order
			sql.push(" ORDER BY borrow_date DESC");
			
			var queryStatement = sql.join("");

			BorrowBook.query(queryStatement, value, function(err, result){
				if(err) return reject(err);
				return resolve(result);				
			});
		});
	},
};