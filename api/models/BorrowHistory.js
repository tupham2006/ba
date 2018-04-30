 const CONST = require('../../const.js');
const moment = require("moment");

module.exports = {
	schema: true,
  tableName: "borrow_history",
  autoUpdatedAt: false,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		action: { type: "string", defaultsTo: "" },
		change_list: { type: "string", defaultsTo: "[]" },
		borrow_id: { type: "integer", required: true },
		user_id: { type: "integer", required: true, defaultsTo: 0 },
		user_name: { type: "string", required: true, defaultsTo: "" },
		status: { type: "integer", required: true, defaultsTo: 1 }, // 0: lended, 1: borrowing
		borrow_date: { type: "datetime", defaultsTo: null },
		pay_date: { type: "datetime", defaultsTo: null },
		borrow_book: {type: "string", defaultsTo: '[]'},
		note: { type: "string", size:10000, maxLength:10000, defaultsTo: "" },
		deposit_id: {type: "integer", required: true, defaultsTo: 1 },
		deposit_name: { type: "string", maxLength: 50, defaultsTo: '' },
		createdAt: {type: "datetime", columnName: "created_at" },
	},

	getBorrowHistoryByBorrowId: function (borrowId) {
		return new Promise(function(resolve, reject){
			BorrowHistory.find({ borrow_id: borrowId})
				.exec(function(err, result){
					if(err) return reject(err);
					return resolve(result);
				});
		});
	},

	createBorrowHistory: function(oldBorrow, newBorrow, oldBorrowBook, newBorrowBook, action) {
		return new Promise(function(resolve, reject){
			var change_list = BorrowHistory.getChangeList(oldBorrow, newBorrow, oldBorrowBook, newBorrowBook);
			var borrowBookArr = [];
			for(var i in newBorrowBook) {
				borrowBookArr.push({
					id: newBorrowBook[i].id,
					book_id: newBorrowBook[i].book_id,
					book_name: newBorrowBook[i].book_name,
					status: newBorrowBook[i].status
				});
			}

			var data = {
				borrow_id: oldBorrow.id, 
				change_list: JSON.stringify(change_list),
				action: action,
				user_id: (action == "create" ? newBorrow.user_id : newBorrow.update_user_id),
				user_name: (action == "create" ? newBorrow.user_name : newBorrow.update_user_name),
				status: newBorrow.status,
				borrow_date: newBorrow.borrow_date,
				pay_date: (newBorrow.pay_date ? newBorrow.pay_date : null),
				note: newBorrow.note,
				deposit_id: newBorrow.deposit_id,
				deposit_name: newBorrow.deposit_name,
				borrow_book: JSON.stringify(borrowBookArr)
			};

			BorrowHistory.create(data)
				.exec(function(err, res){
					if(err) reject(err);
					return resolve();
				});
		});
	},

	getChangeList: function(oldBorrow, newBorrow, oldBorrowBook, newBorrowBook) {
		var i, j, k, dataChange = [], oldBookIdArray = [];
		if(oldBorrow.status != newBorrow.status) dataChange.push('status');
		if(!oldBorrow.borrow_date || !(moment(oldBorrow.borrow_date).isSame(moment(newBorrow.borrow_date), "days"))) dataChange.push('borrow_date');
		
		if(oldBorrow.pay_date && newBorrow.pay_date) {
			if(!(moment(oldBorrow.pay_date).isSame(moment(newBorrow.pay_date), "days"))) dataChange.push('pay_date');
		} else if(oldBorrow.pay_date || newBorrow.pay_date) {
			dataChange.push('pay_date');
		}

		if(oldBorrow.note != newBorrow.note) dataChange.push('note');
		if(oldBorrow.deposit_name != newBorrow.deposit_name) dataChange.push('deposit_name');

		for(i in oldBorrowBook) {
			oldBookIdArray.push(oldBorrowBook[i].book_id);
		}

		for(j in newBorrowBook) {
			if(oldBookIdArray.indexOf(newBorrowBook[j].book_id) == -1) {
				dataChange.push('borrow_book');
				break;
			}
		}

		return dataChange;
	}
};