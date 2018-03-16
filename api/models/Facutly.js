module.exports= {
	tableName: "facutly",
	schema: true,
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		name: { type: "string", maxLength: 100, required: true },
		actived: { type: "integer", defaultsTo: 1}
	}
};