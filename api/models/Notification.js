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
				limit: 100
			}).exec(function(err, result){
				if(err) reject(err);
				return resolve(result);
			});
		});
	}
};