var FB = require('fb');
module.exports = {
	tableName: "fb_user",
	schema: true,
	globalId: 'FbUser',
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		fb_id: { type: "string", required: true, maxLength: 50 },
		name: { type: "string", required: true, maxLength: 100 },
		actived: { type: "integer", defaultsTo: 1 },
		createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" },
	},

	getFbUser: function(accessToken) {
		return new Promise(function(resolve, reject){
			// check user has login
			FbUser.checkLoginFacebook(accessToken)
				.then(function(loginData){

					if(loginData && loginData.id && loginData.name) {

						// find or create in database
						FbUser.findOrCreate({
							fb_id: loginData.id
						}, {
							fb_id: loginData.id,
							name: loginData.name
						}).exec(function(err, result){
							if(err) return reject(err);

							// check actived fb user login, if not active return undefined
							if(!result || !result.actived) {
								return resolve();
							}
							return resolve(result);

						});
					} else {
						return resolve();
					}
				});
			
		});
	},

	checkLoginFacebook: function (accessToken) {
		return new Promise(function (resolve, reject) {
			var timeout = setTimeout(function() {
				return resolve();
			}, 7000);

			// check login facebook
			FB.api('/me', 'GET', {access_token: accessToken}, function (fb_res) {
				clearTimeout(timeout);

			  if(!fb_res || fb_res.error) {
			  	return resolve();
			  } else {
			  	return resolve(fb_res);
			  }
			});


		});
	}
};