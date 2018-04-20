const CONST = require('../../const.js');
var moment = require('moment');

module.exports = {
	catch: function (req, res, e, action) {
		var userId = 0;
		if(req && req.session && req.session.user && req.session.user.id){
			userId = req.session.user.id;
			
		} else if(req && req.session && req.session.public_user) {
			userId = req.session.public_user.id;
		}

		console.log(moment().add(7, "hour").format("HH:mm DD/MM/YYYY") + " - User: " + userId + " :: " + action + " :: ", e);
		return res.json({
			error: CONST.ERROR.YES,
			message: e.message
		});
	},

	sync: function(tableName, action, data, role) {
		if(!role) role = "MOD";
		sails.sockets.broadcast(role, tableName, { data: data, action: action });
	}
};