const CONST = require('../../const.js');
const PATH = require('path');
const FSE = require('fs-extra');

module.exports = {
	uploadImage : function (req, res) {
		var self = this;
		var userId = req.session.user.id;

		// handle file name
		var fileName = userId + "_" + new Date().getTime();
		var fileType = 'general';

		switch(req.body.type){
			case "user": 
				fileName = "user_" + userId + "_" + new Date().getTime() + ".jpg";
				fileType = "user";
				break;

			case "book":
				fileName = "book_" + userId + "_" + new Date().getTime() +".jpg";
				fileType = "book";
				break;
		}

		try{
			
			req.file('file').upload({
				maxBytes: 5000000,
				dirname: PATH.resolve(sails.config.appPath, "assets/uploads/" + fileType),
				saveAs: fileName
			}, function whenDone(err, uploadFile){
				
				if(err || !uploadFile || uploadFile.length == 0 ){
					return res.json({
						error: CONST.ERROR.FAILED_UPLOAD,
						message: "Tải ảnh lên không thành công"
					});
				} 

				// Async with promises:
				FSE.copy('./assets/uploads/' + fileType, './.tmp/public/uploads/' + fileType)
				  .then(function(){
				  	var fileUrl = "uploads/" + fileType + "/" + fileName ;
				  	return self.handleAfterUpload(req, res, fileType, fileUrl);
				  	
				  })
				  .catch(function (err) {
				  	console.error("Tài khoản " + userId + ": MediaController ::  uploadUserImage() :: ", err);
				  	return res.json(CONST.CATCH);
				  });
			});

		} catch(e){}
	},

	handleAfterUpload : function(req, res, fileType, fileUrl){
		switch(fileType){
			case "user":
				User.updateUserInfo({id: req.session.user.id}, {image: fileUrl})
		  		.then(function(qUser){
		  			req.session.user = qUser[0];
		  			return res.json({
		  				fileUrl: fileUrl
		  			});
		  		});
		  	break;

		  case "book":
		  	return res.json({
		  		fileUrl: fileUrl,
		  	});

		  default: 
		  	return res.json({
		  		fileUrl: fileUrl,
		  	});
		}
	}
};