const CONST = require('../../const.js');
module.exports = {
	tableName: "book_comment",
	schema: true,
	globalId: 'BookComment',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		book_id: { type: "integer", required: true},
		user_id: { type: "integer", required: true },
		user_name: { type: "string", required: true },
		content: { type: "string",size: 10000, maxLength: 10000, required: true, defaultsTo: ''},
		deleted: { type: "integer", defaultsTo: 0},
		actived: { type: "integer", defaultsTo: 1},
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" }
	},

	commentBook: function (content, bookId, userId) {
		return new Promise(function(resolve, reject){
			var data = {
				content: content,
				book_id: bookId,
				user_id: userId
			};

			// Kiem tra user co ton tai hay khong
			PublicUser.getUserById(userId)
				.then(function(userResult){
					if(!userResult) throw new Error("Tài khoản của bạn không tồn tại hoặc đã bị khóa");
					data.user_name = userResult.name;
					return;
				})

				// kiem tra sach co ton tai hay khong
				.then(function(){
					return Book.getBookById(bookId)
						.then(function(bookResult){
							if(!bookResult) throw new Error("Sách không tồn tại!");
							return;
						});
				})
				// comment book
				.then(function(){
					return BookComment.create(data)
						.exec(function(err, result){
							if(err) reject(err);
							return resolve(result);
						});
				})
				.catch(function(err){
					return reject(err);
				});
		});	
	}
};