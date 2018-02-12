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
	}
};