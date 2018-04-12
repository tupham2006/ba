module.exports = {
	getNotificationList: function (req, res) {
		if(!req.session.user) {
			return Service.catch(req, res, {message: "Vui lòng đăng nhập để tiếp tục"}, "getNotificationList");
		}

		Notification.getNotificationList(req.session.user.role)
			.then(function(result){
				return res.json({
					notifications: result
				});
			})
			.catch(function(e){
				return Service.catch(req, res, e, "getNotificationList");
			});
	}
};