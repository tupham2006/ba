var moment = require("moment");
module.exports = {
	user: function (action, value) {
		// Chuẩn bị tin nhắn
		var createNotificationData = {
			message: "",
			priority: "WARNING",
			role: 3,
			action: "click",
			click: "admin",
			data_id: value.id,
		};

		switch(action) {
			case "create" : 
				createNotificationData.message = "Thành viên " + value.name + " vừa đăng ký tài khoản";
				break;
		}

		// Tạo dữ liệu notification
		NotificationService.createNotification(action, createNotificationData);
	},

	createNotification: function(action, createNotificationData) {
		Notification.createNotification(createNotificationData)
			.then(function(result){
				var message = result ? result.message : "Tạo dữ liệu thất bại";

				// send socket
				Service.sync("notification", action, result, "ADMIN");

				// log
				console.log(moment().add(7, "hour").format("HH:mm DD/MM/YYYY") + " - Notification: ", message);
			})
			.catch(function(e){
				console.log(moment().add(7, "hour").format("HH:mm DD/MM/YYYY") + " - Notification: ", e);
			});
	}
};