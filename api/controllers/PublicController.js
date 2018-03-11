var FB = require('fb');

// created at 25/10/2017
module.exports = {
	getHomepage: function (req, res) {
		var returnData = {};

		// get lastest book
		Book.find({
			where: {
				intro: {
					"!": ""
				}
			},
			sort: "createdAt DESC",
			limit: 1,
			skip: 0
		})
		.then(function(bookResult){
			if(!bookResult || !bookResult.length) bookResult = null;
			returnData.book = bookResult[0];
		})
		.then(function(result){
			return res.json({
				data: returnData
			});
		})
		.catch(function(e){
			return Service.catch(req, res, e, "getBorrowBookList");
		});
		// get lastest event
		// get lastest blog
		// get club info
	},

	getBookPage: function(req, res) {

		BookType.getBookTypeList({
			actived: 1
		})
			.then(function(bookTypes){
				Book.getBookList({
					where: {
						use_quantity: {
							">": 0
						}
					},
					limit: 12,
					skip: 0,
					sort: "name ASC"
				}).then(function(books){

					Book.countBook({
						where: {
							use_quantity: {
								">": 0
							}
						}
					}).then(function(count){
						
						var bookList = [];
						if(books && books.length > 0) {
							// filter data
							for(var i in books) {
								bookList.push({
									id: books[i].id,
									name: books[i].name,
									image: books[i].image,
									hot: books[i].hot,
									author: books[i].author,
									intro: books[i].intro,
									current_quantity: books[i].current_quantity,
									comment_time: books[i].comment_time,
									love_time: books[i].love_time,
									hate_time: books[i].hate_time,
									type_name: books[i].type_name,
									borrow_time: books[i].borrow_time
								});
							}
						}

						return res.json({
							book_types: bookTypes,
							book_count: count,
							books: bookList
						});
						
					})
					.catch(function(e){
						return Service.catch(req, res, e, "getBookList");
					});
				})
				.catch(function(e){
					return Service.catch(req, res, e, "getBookList");
				});
				
			})

		.catch(function(e){
			return Service.catch(req, res, e, "getBookTypeList");
		});
	},

	getBookList: function(req, res) {
		var limit = req.param('limit') > 0 ? parseInt(req.param('limit')) : 12;
		var offset = req.param('offset') >= 0 ? parseInt(req.param('offset')) : 0;
		var sort_type = ['desc', 'asc'].includes(req.param('sort_type')) ? req.param('sort_type') : 'desc';
		var sort_name = ['id', 'name', 'hot'].includes(req.param('sort_name')) ? req.param('sort_name') : 'id';
		var search = (req.param('search') ? req.param('search') : "").trim();
		var status = parseInt(req.param('status')) ? parseInt(req.param('status')) : 0;
		var typeId = parseInt(req.param('type')) ? parseInt(req.param('type')) : 0;

		var condition = {
				use_quantity: {
					">": 0
				}
		};

		if(search) condition.name = { "like": "%" + search + "%" };
		if(typeId) condition.type_id = typeId;

		if(status) {
		 if(status == 1) {
		 	condition.current_quantity  = {
		 		'>': 0 
		 	};
		 } else if(status == 2) {
		 	condition.current_quantity  = 0;
		 }
		}

		Book.getBookList({
			where: condition,
			limit: limit,
			skip: offset,
			sort: sort_name + ' ' + sort_type
		}).then(function(books){

			Book.countBook({where: condition}).then(function(count){
				
				var bookList = [];
				if(books && books.length > 0) {
					// filter data
					for(var i in books) {
						bookList.push({
							id: books[i].id,
							name: books[i].name,
							image: books[i].image,
							hot: books[i].hot,
							author: books[i].author,
							intro: books[i].intro,
							current_quantity: books[i].current_quantity,
							comment_time: books[i].comment_time,
							love_time: books[i].love_time,
							hate_time: books[i].hate_time,
							type_name: books[i].type_name,
							borrow_time: books[i].borrow_time
						});
					}
				}

				return res.json({
					book_count: count,
					books: bookList
				});
				
			})
			.catch(function(err){
				return Service.catch(req, res, err, "getBookList");
			});
		})
		.catch(function(err){
			return Service.catch(req, res, err, "getBookList");
		});
	},

	ratingBook: function(req, res) {
		var accessToken = req.param("access_token");
		var rateType = parseInt(req.param("rate_type"));
		var bookId = parseInt(req.param("book_id"));

		var userId = 0;
		accessToken = "EAAEZBPy5iBlwBAEgzQoIBJe4DnD59mqSZCA7UZAcuY10md8ZBDIaLRYbAS8e5coeeO3jUYTUWfg8y2B8KEopZAoHYVQHHVgZCEb5p08lNRYKBfnDOzUrOeMuvW7GYAe27KUgXyGH606uR0c3o9WWLQPcnqKMrXpXIHYHjMlIlwfSCtrGfHr7RDJA2Yrg5kReDV9V6GYCTWewZDZD";
		
		if(!(rateType <= 1)) {
			return Service.catch(req, res, { message: "Vui lòng nhập loại rating" }, "ratingBook");
		}
		
		if(!bookId){
			return Service.catch(req, res, { message: "Vui lòng nhập ID sách" }, "ratingBook");
		}

		if(!accessToken) {
			return Service.catch(req, res, { message: "Vui lòng đăng nhập để tiếp tục" }, "ratingBook");
		}

		// check login facebook
		FB.api('/me', 'GET', {access_token: accessToken}, function (fb_res) {
			console.log("fb_res", fb_res);
		  if(!fb_res || fb_res.error) {
				return Service.catch(req, res, { message: "Vui lòng đăng nhập để tiếp tục" }, "ratingBook");
		 
		  } else {
		  	userId = fb_res.id;

		  	if(!userId) {
					return Service.catch(req, res, { message: "Vui lòng đăng nhập để tiếp tục" }, "ratingBook");
				}

				// Query
		  	BookRating.findOne({
					fb_id: userId,
					book_id: bookId
				}).then(function(bookResult){
					// No record, create new 
					if(!bookResult) {
						BookRating.create({
							fb_id: userId,
							book_id: bookId,
							type: rateType
						}).then(function(result){
							sails.sockets.broadcast('BAManager', { message: "Facebook " + userId + " just like" });
							return res.json({});

						}).catch(function(e){
							return Service.catch(req, res, e, "ratingBook");
						});

					// has record
					} else {
						if(bookResult.type == rateType)	{ // unrate
							BookRating.destroy({
								fb_id: userId,
								book_id: bookId,
							}).then(function(result){
								sails.sockets.broadcast('BAManager', { message: "Facebook " + userId + " just like" });
								return res.json({});

							}).catch(function(e){
								return Service.catch(req, res, e, "ratingBook");
							});

						} else { // change rate
							BookRating.update({
								fb_id: userId,
								book_id: bookId,
							}, { type: rateType }).then(function(result){
								console.log(sails.sockets)
								sails.sockets.broadcast('BAManager', { message: "Facebook " + userId + " just like" });
								return res.json({});

							}).catch(function(e){
								return Service.catch(req, res, e, "ratingBook");
							});
						}
					}			

				})
				.catch(function(e){
					return Service.catch(req, res, e, "ratingBook");
				});
		  }
		});
		
		
	}
};