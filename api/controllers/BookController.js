/*
		Created at 11/11/2017
 */
const CONST = require('../../const.js');
module.exports = {

	getAllBookList: function(req, res){
		var condition = {
			where: {}, 
			sort: "name ASC" 
		};

		Book.getBookList(condition)
			.then(function(qBook){
				return res.json({
					books: qBook
				});
			})

			.catch(function(err){
				console.log("BookController :: getAllBookList :: ", err);
				return res.json(CONST.CATCH);
			});

	},

	createBook: function(req, res){

		var useQuantity = parseInt(req.param('use_quantity')) ? parseInt(req.param('use_quantity')) : 0;
		var inventoryQuantity = parseInt(req.param('inventory_quantity')) ? parseInt(req.param('inventory_quantity')) : 0;
		var name = req.param('name') ? req.param('name') : "";
			name = name.toString().trim();
		var intro = req.param('intro') ? req.param('intro') : "";
			intro = intro.toString().trim();
		var author = req.param('author') ? req.param('author') : "";
			author = author.toString().trim();
		var typeId = parseInt(req.param('type_id')) ? parseInt(req.param('type_id')) : 0;
		var note = (req.param("note") ? req.param("note") : "").toString().trim();
		
		if(!name || !typeId){
			return res.json({
				error: CONST.ERROR.OTHER_REQ,
				message: "Thiếu tên hoặc loại sách"
			});
		}
		
		var data = {
			name: name,
			type_id: typeId,
			use_quantity: useQuantity,
			inventory_quantity: inventoryQuantity,
			note: (req.param("note") ? req.param("note") : "").toString().trim(),
			intro: intro,
			author: author,
			image: req.param("image"),
			current_quantity: useQuantity
		};

		if(req.param("image")) data.image = req.param("image");
		if(!isNaN(req.param("hot"))) data.hot = parseInt(req.param("hot"));

		BookType.getBookTypeInfo({
			id: typeId
		}).then(function(type){
			if(type && type.name){
				data.type_name = type.name;
			} else {
				delete data.type_id;
			}

			Book.createBook(data)
				.then(function(result){
					return res.json(result);
				})
				.catch(function(e){
					return Service.catch(req, res, e, "createBook");
				});	
		})		
		.catch(function(e){
			return Service.catch(req, res, e, "createBook");
		});	
	},

	updateBook: function(req, res){

		var id = parseInt(req.param('id'));
		var useQuantity = parseInt(req.param('use_quantity')) ? parseInt(req.param('use_quantity')) : 0;
		var inventoryQuantity = parseInt(req.param('inventory_quantity')) ? parseInt(req.param('inventory_quantity')) : 0;
		var name = req.param('name') ? req.param('name') : "";
			name = name.toString().trim();
		var intro = req.param('intro') ? req.param('intro') : "";
			intro = intro.toString().trim();
		var author = req.param('author') ? req.param('author') : "";
			author = author.toString().trim();
		var typeId = parseInt(req.param('type_id')) ? parseInt(req.param('type_id')) : 0;

		if(!name || !typeId || !id){
			return res.json({
				error: CONST.ERROR.OTHER_REQ,
				message: "Thiếu tên hoặc loại sách"
			});
		}

		var data = {
			name: name,
			type_id: typeId,
			use_quantity: useQuantity,
			inventory_quantity: inventoryQuantity,
			note: (req.param("note") ? req.param("note") : "").toString().trim(),
			intro: intro,
			author: author
		};

		if(req.param("image")) data.image = req.param("image");
		if(!isNaN(req.param("current_quantity"))) data.current_quantity = parseInt(req.param("current_quantity"));
		if(!isNaN(req.param("hot"))) data.hot = parseInt(req.param("hot"));

		BookType.getBookTypeInfo({
			id: typeId
		}).then(function(type){
			if(type && type.name){
				data.type_name = type.name;
			} else {
				delete data.type_id;
			}
			// find type name
			Book.updateBook(id, data)
				.then(function(result){
					return res.json(result);
				})
				.catch(function(e){
					return Service.catch(req, res, e, "updateBook");
				});		
		})

		.catch(function(e){
			return Service.catch(req, res, e, "updateBook");
		});		
	}
};