const CONST = require('../../const.js');
module.exports = {
	tableName: "book_rating",
	schema: true,
	globalId: 'BookRating',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		book_id: { type: "integer", required: true },
		user_id: { type: "integer", required: true },
		type: { type: "integer", required: true, defaultsTo: 1 }, // 1: love, 0: hate
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" },
	},

	getBookRatingByUserId: function (id) {
		return new Promise(function(resolve, reject){
			BookRating.find({
				user_id: id
			}).exec(function(err, result){
				if(err) return reject(err);
				return resolve(result);
			});
		});
	}
};