const CONST = require('../../const.js');
module.exports = {
	getPositionList: function (req, res) {
		Position.find()
			.then(function(positions){
				return res.json({
					positions: positions
				});
			})

			.catch(function(err){
				console.log("PositionController :: getPositionList :: ", err);
				return res.json(CONST.CATCH);
			});
	},
};