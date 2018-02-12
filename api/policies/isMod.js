module.exports = function(req, res, next){
	if(!req.session || !req.session.user || !parseInt(req.session.user.role)){
		return res.forbidden("Vui lòng đăng nhập");
	}

	if(req.session.user.role < 2){
		return res.forbidden("Chức năng này chỉ dành cho Admin và Mod");
	}

	next();
};