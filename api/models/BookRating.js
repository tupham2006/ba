const CONST = require('../../const.js');
module.exports = {
	tableName: "book_rating",
	schema: true,
	globalId: 'BookRating',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		book_id: { type: "integer", required: true },
		fb_id: { type: "string", required: true, maxLength: 50 },
		type: { type: "integer", required: true, defaultsTo: 1 }, // 1: love, 0: hate
		createdAt: {type: "datetime", columnName: "created_at" },
    	updatedAt: {type: "datetime", columnName: "updated_at" },
	}
};