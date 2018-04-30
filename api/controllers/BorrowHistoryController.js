const moment = require('moment');
const CONST = require('../../const.js');
module.exports = {
	getBorrowHistoryByBorrowId: function (req, res) {
		var borrowId = parseInt(req.param('borrow_id'));

		if(!borrowId) {
			return Service.catch(req, res, {message: "Thiếu tham số borrow_id"}, "getBorrowHistoryByBorrowId");
		}

		BorrowHistory.getBorrowHistoryByBorrowId(borrowId)
			.then(function(result){
				var i, returnResult = [];
				for(i in result) {
					result[i].change_list_array = JSON.parse(result[i].change_list);
					result[i].borrow_book_array = JSON.parse(result[i].borrow_book);

					returnResult.push({
						createdAt: result[i].createdAt,
						action: result[i].action,
						user_id: result[i].user_id,
						user_name: result[i].user_name,
						change_list_array: result[i].change_list_array,
						borrow_date: result[i].borrow_date,
						pay_date: result[i].pay_date,
						status: result[i].status,
						borrow_book_array: result[i].borrow_book_array,
						note: result[i].note,
						deposit_id: result[i].deposit_id,
						deposit_name: result[i].deposit_name
					});
				}

				return res.json({
					borrow_historys: result
				});
			})
			.catch(function(err){
				return Service.catch(req, res, err, "getBorrowHistoryByBorrowId");
			});
	}
};