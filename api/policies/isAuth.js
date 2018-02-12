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
    return res.forbidden("Mã xác thực không tồn tại");
  }

  JWT.verify(token, function (err, result) {

    if (err || !result || !result.user || !result.user.id || !result.user.role) {
      return res.forbidden("Xác thực không thành công");
    }

    req.session.user = result.user;
    next();

  });
};