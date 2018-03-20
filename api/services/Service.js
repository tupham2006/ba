const CONST = require('../../const.js');

module.exports = {
	catch: function (req, res, e, action) {
		var userId = 0;
		if(req && req.session && req.session.user && req.session.user.id){
			userId = req.session.user.id;
		}

		console.log("User: " + userId + " :: " + action + " :: ", e);
		console.log(JSON.stringify(e.message));
		return res.json({
			error: CONST.ERROR.YES,
			message: e.message
		});
	},
};