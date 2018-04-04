var FB = require('fb');
module.exports = {
	tableName: "public_user",
	schema: true,
	globalId: 'PublicUser',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		fb_id: { type: "string", required: true, maxLength: 50 },
		name: { type: "string", required: true, maxLength: 50 },
		actived: { type: "integer", defaultsTo: 1 },
		deleted: { type: "integer", defaultsTo: 0 },
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" },
	},

	verifyFB: function (accessToken) {
		return new Promise(function(resolve, reject){
			FB.api('/me', 'GET', {access_token: accessToken}, function (fb_res) {
				if(!fb_res || fb_res.error) {
					var error = "Xác thực tài khoản Facebook thất bại";
					if(fb_res) error = fb_res.error;
			  	return reject({
			  		message: error
			  	});

			  } else {
			  	return resolve(fb_res);
			  }
			});
		});
	},

	register: function(data){
		return new Promise(function (resolve, reject) {
			PublicUser.findOne({
				fb_id: data.id
			}).exec(function(err, findResult){
				if(err) return reject(err);

				if(findResult) {
					return reject({
						message: "Tài khoản Facebook này đã đăng ký"
					});
				}

				PublicUser.create({
					fb_id: data.id,
					name: data.name
				}).exec(function(err, result){
					if(err) return reject(err);
					return resolve(result);
				});
			});
		});
	},

	login: function(data){
		return new Promise(function (resolve, reject) {
			PublicUser.findOne({
				fb_id: data.id
			}).exec(function(err, findResult){
				if(err) return reject(err);

				if(!findResult) {
					return reject({
						message: "Tài khoản không tồn tại"
					});
				}

				return resolve(findResult);
			});
		});
	},

	getUserById: function(userId) {
		return new Promise(function(resolve, reject){
			PublicUser.findOne({
				id: userId,
				actived: 1,
				deleted: 0
			}).exec(function(err, result){
				if(err) return reject(err);
				return resolve(result);
			});
		});
	}
};