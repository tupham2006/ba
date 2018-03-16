const CONST = require('../../const.js');
module.exports = {
	tableName: "book_comment",
	schema: true,
	globalId: 'BookComment',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		book_id: { type: "integer", required: true, defaultTo: 0},
		fb_id: { type: "string", required: true, maxLength: 50, defaultsTo: '' },
		content: { type: "string",size: 10000, maxLength: 10000, required: true, defaultTo: ''},
		deleted: { type: "integer", defaultTo: 0},
		actived: { type: "integer", defaultTo: 0},
		createdAt: {type: "datetime", columnName: "created_at" },
    	updatedAt: {type: "datetime", columnName: "updated_at" }
	}
};