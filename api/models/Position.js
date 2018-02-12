const CONST = require('../../const.js');
module.exports = {
	tableName: "position",
	schema: true,
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		name: { type: "string", size: 50, maxLength: 50, required: true },
		actived: { type: "integer", defaultsTo: 1},
	}
};