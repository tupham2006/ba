module.exports= {
	tableName: "deposit",
	schema: true,
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		name: { type: "string", maxLength: 100, required: true },
		description: { type: "integer", required: true, defaultsTo: 0 },
		actived: { type: "integer", defaultsTo: 1}
	}
};