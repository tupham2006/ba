const JWT = require('jsonwebtoken');
const KEY = "bdbvbmkdpe";

module.exports ={
	issue: function (user) {
		return JWT.sign({user: user}, KEY, {
			expiresIn: "10 days",
		});
	},

	verify: function(token, callBack){
		return JWT.verify(token, KEY, callBack);
	}
};
  
 