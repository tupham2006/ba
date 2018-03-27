/*
		Created at 11/11/2017
 */
const CONST = require('../../const.js');
module.exports = {

	getBookTypeList: function (req, res) {
		var actived = parseInt(req.param('actived'));

		BookType.getBookTypeList()
			.then(function(qBookType){
				return res.json({
					book_type: qBookType
				});
			})

		.catch(function(e){
			return Service.catch(req, res, e, "getBookTypeList");
		});
	},

	createBookType: function(req, res){
		var name = (req.param("name") ? req.param("name") : "").toString().trim();
		var actived = parseInt(req.param("actived")) ? parseInt(req.param("actived")) : 0;

		if(!name.length) {
				return Service.catch(req, res, {message: "Vui lòng nhập tên loại sách" }, "createBookType");
		}

		BookType.create({
			name: name,
			actived: actived
		}).then(function(result){
			return res.json({
				book_type: result
			});
		})
		.catch(function(err){
			return Service.catch(req, res, err, "createBookType");
		});
	},

	updateBookType: function(req, res){
		var name = (req.param("name") ? req.param("name") : "").toString().trim();
		var actived = parseInt(req.param("actived")) ? parseInt(req.param("actived")) : 0;
		var id = parseInt(req.param("id")) ? parseInt(req.param("id")) : 0;

		if(!id){
			return Service.catch(req, res, {message: "Id sách không tồn tại" }, "updateBookType");
		}

		if(!name.length) {
			return Service.catch(req, res, {message: "Vui lòng nhập tên loại sách" }, "updateBookType");
		}

		BookType.update({id: id},{
			name: name,
			actived: actived
		}).then(function(result){

			if(!result || !result.length){
				return Service.catch(req, res, {message: "Cập nhật không thành công" }, "updateBookType");
			}

			return res.json({
				book_type: result[0]
			});
		})
		.catch(function(err){
			return Service.catch(req, res, err, "updateBookType");
		});
	}
};