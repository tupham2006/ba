const CONST = require('../../const.js');
module.exports = function(req, res, next){ // Đăng nhập
	var token;

  if(req.headers && req.headers.authorization){
    var parts = req.headers.authorization.split(' ');
    if(parts.length == 2){
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    }  else {
      return res.forbidden("Mã xác thực không đúng");
    }
  } else {
    return res.json({ message: "Vui lòng đăng nhập để tiếp tục" });
  }

  JWT.verifyPublicUser(token, function (err, result) {

    if (err || !result || !result.public_user || !result.public_user.id) {
      return res.json({ message: "Vui lòng đăng nhập để tiếp tục" });
    }

    req.session.public_user = result.public_user;
    next();
  });
};