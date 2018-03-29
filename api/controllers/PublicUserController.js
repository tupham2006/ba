module.exports = {
	register: function (req, res) {
		// get token from client
		var accessToken = req.param("access_token");

		// verify tto fb
		PublicUser.verifyFB(accessToken)
			.then(function(verifyResult){
				if(!verifyResult || !Object.getOwnPropertyNames(verifyResult).length) {
					throw new Error("Xác thực tài khoản Facebook thất bại");
				}
				return verifyResult;
			})
			.then(function(verifyResult){
				// create new token
				return PublicUser.register(verifyResult)
					.then(function(result){
						var user = {
							id: result.id,
							name: result.name
						};

						return res.json({
		          token: JWT.createTokenPublicUser({ id: result.id, name: result.name }), // create token
		          user: user
		      	});
					});
			})
			.catch(function(e){
				return Service.catch(req, res, e, "register");
			});
	},

	login: function(req, res) {
		var accessToken = req.param("access_token");

		if(!accessToken) {
			return Service.catch(req, res, { message: "Thiếu thông tin đăng nhập" }, "register");
		}

		PublicUser.verifyFB(accessToken)
			.then(function(verifyResult){
				if(!verifyResult || !Object.getOwnPropertyNames(verifyResult).length) {
					throw new Error("Xác thực tài khoản Facebook thất bại");
				}
				return verifyResult;
			})
			.then(function(verifyResult){
				return PublicUser.login(verifyResult)
					.then(function(result){
						var user = {
							id: result.id,
							name: result.name
						};

						return res.json({
		          token: JWT.createTokenPublicUser({ id: result.id, name: result.name }), // create token
		          user: user
		      	});
					});
			})
			.catch(function(e){
				return Service.catch(req, res, e, "register");
			});
	},
};