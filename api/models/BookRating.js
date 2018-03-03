const CONST = require('../../const.js');
module.exports = {
	tableName: "book_rating",
	schema: true,
	globalId: 'BookRating',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		book_id: { type: "integer", required: true, defaultTo: 0 },
		fb_id: { type: "varchar", required: true, maxLength: 50, defaultTo: '' },
		type: { type: "integer", required: true, defaultTo: 1 }, // 1: love, 0: hate
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" },
	}
};