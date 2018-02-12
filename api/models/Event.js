// created at 26/10/2017

module.exports = {
	tableName: "event",
	schema: true,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		user_id: { type: "integer", required : true},
		name: { type: "string", required : true, size: 100,  maxLength: 100, defaultsTo: ''},
		content: { type: "string", required : true, size: 10000, maxLength: 10000, defaultsTo: ''},
		start_date: { type: "datetime", required: true, defaultsTo: null },
		end_date: { type: "datetime", required: true, defaultsTo: null },
		deleted: { type: "integer", defaultsTo: 0 },
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" },
	}
};