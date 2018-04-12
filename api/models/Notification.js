const CONST = require('../../const.js');
module.exports = {
	tableName: "notification",
	schema: true,
	globalId: 'Notification',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		message: { type: "string", required: true },
		priority: { type: "string", enum: ['INFO','PRIMARY','WARNING','ERROR'], required: true, defaultsTo: 'INFO' },
		role: { type: "integer", required: true, defaultsTo: 1 },
		action: { type: "string" },
		click: { type: "string" },
		data_id: { type: "integer"},
		creator_id: { type: "integer"},
		creator_name: { type: "string" },
		deleted: { type: "integer", defaultsTo: 0 },
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" },
	},

	getNotificationList: function (role) {
		return new Promise(function (resolve, reject) {
			Notification.find({
				where: {
					deleted: 0,
					role: {
						"<=": role
					}
				},
				sort: "id DESC",
				limit: 50
			}).exec(function(err, result){
				if(err) reject(err);
				return resolve(result);
			});
		});
	},

	createNotification: function(createNotificationData) {
		return new Promise(function(resolve, reject){

			// Required data
			var createData = {
				message: createNotificationData.message,
				priority: createNotificationData.priority,
				role: createNotificationData.role
			};

			// optional data
			if(createNotificationData.action) createData.action = createNotificationData.action;
			if(createNotificationData.click) createData.click = createNotificationData.click;
			if(createNotificationData.data_id) createData.data_id = createNotificationData.data_id;
			if(createNotificationData.creator_id) createData.creator_id = createNotificationData.creator_id;
			if(createNotificationData.creator_name) createData.creator_name = createNotificationData.creator_name;

			// create
			Notification.create(createData)
				.exec(function(err, result){
					if(err) return reject(err);
					return resolve(result);
				});
		});
	}
};