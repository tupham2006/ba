const CONST = require('../../const.js');
module.exports = {
	getDepositList: function (req, res) {
		Deposit.find()
			.then(function(deposits){
				return res.json({
					deposits: deposits
				});
			})

			.catch(function(err){
				console.log("DepositController :: getDepositList :: ", err);
				return res.json(CONST.CATCH);
			});
	}
};