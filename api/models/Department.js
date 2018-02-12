const CONST = require('../../const.js');
module.exports = {
	tableName: "department",
	schema: true,
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		name: { type: "string", size: 50, maxLength: 50, required: true },
		actived: { type: "integer", defaultsTo: 1},
	},

	getDepartmentById: function (id) {
		return new Promise(function(resolve, reject){
			Department.findOne({
				id: id,
				actived: CONST.ACTIVED.YES
			})
				.exec(function(err, result){
					if(err) return reject(err);
					return resolve(result);
				});
		});
	}
};