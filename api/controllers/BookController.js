/*
		Created at 11/11/2017
 */
const CONST = require('../../const.js');
module.exports = {

	// getBookList: function (req, res) {
	// 	var typing = req.param('typing') ? req.param('typing') : "";
	// 	var typeId = parseInt(req.param('type_id')) ? parseInt(req.param('type_id')) : 0;
	// 	var skip = parseInt(req.param('skip')) ? parseInt(req.param('skip')) : 0;
	// 	var limit = parseInt(req.param('limit')) ? parseInt(req.param('limit')) : 10;
	// 	var status = parseInt(req.param('status')); // status 0: Deleted book, status 1: exist book, status 2: using book

	// 	// handle data
	// 	typing = typing.trim();

	// 	var search = {
	// 		where: {},
	// 		skip: skip,
	// 		limit: limit,
	// 		sort: "id desc"
	// 	};

	// 	if(typeId) search.where.type_id = typeId;

	// 	if(typing) search.where.name = { "like": "%" + typing + "%" };

	// 	switch(status){
	// 		case 0: 
	// 			search.where.use_quantity = 0;
	// 			search.where.inventory_quantity = 0;
	// 			break;
	// 		case 1: 
	// 			search.where.or = [
	// 				{ use_quantity : {">": 0} },
	// 				{ inventory_quantity : {">": 0} }
	// 			];
	// 			break;
	// 		case 2:
	// 			search.where.use_quantity = {">": 0};
	// 	}


	// 	Book.getBookList(search)
	// 		.then(function(qBook){
	// 			return qBook;
	// 		})

	// 		.then(function(qBook){
	// 			return Book.countBook(search)
	// 				.then(function(qCount){
	// 					return res.json({
	// 						book: qBook,
	// 						count: qCount
	// 					});
	// 				});
	// 		})

	// 		.catch(function(err){
	// 			console.log("BookController :: getBookList :: ", err);
	// 			return res.json(CONST.CATCH);
	// 		});
	// },

	getAllBookList: function(req, res){
		console.log(req.isSocket);
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
					return res.json({
						book: result
					});
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
					return res.json({
						book: result
					});
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