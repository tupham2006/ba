const JWT = require('jsonwebtoken');
const KEY = "abcdefgh";
const publicKey = "abcdefgh";

module.exports ={
	issue: function (user) {
		return JWT.sign({user: user}, KEY, {
			expiresIn: "10 days",
		});
	},

	verify: function(token, callBack){
		return JWT.verify(token, KEY, callBack);
	},

	createTokenPublicUser: function(publicUser) {
		return JWT.sign({public_user: publicUser}, publicKey, {
			expiresIn: "10 days",
		});
	},

	verifyPublicUser: function(token, callBack){
		return JWT.verify(token, publicKey, callBack);
	},

	checkPublicLogin: function(req) {
		var token;
		if(!req || !req.headers || !req.headers.authorization) return;

	 	var parts = req.headers.authorization.split(' ');

	 	if(parts.length == 2){
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    }  else {
      return;
    }

   	return this.verifyPublicUser(token, function (err, result) {
    if (err || !result || !result.public_user || !result.public_user.id) {
      return;
    }

    req.session.public_user = result.public_user;
    return req.session.public_user;
	 });
	}
};
  
 