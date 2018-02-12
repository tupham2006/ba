const CONST = require('../../const.js');
module.exports = {
	tableName: "book_rating",
	schema: true,
	globalId: 'BookRating',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		book_id: { type: "integer", required: true, defaultTo: 0},
		reader_id: { type: "integer", required: true, defaultTo: 0},
		rate: { type: "integer", required: true, min:1, max: 5, defaultTo: 0},
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" },
	}
};