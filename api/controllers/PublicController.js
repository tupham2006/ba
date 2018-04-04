// created at 25/10/2017
module.exports = {
	getHomepage: function (req, res) {
		var returnData = {};

		// get lastest book
		return Book.find({
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
			returnData.book = bookResult;
		})
		.then(function(){
			return res.json({
				data: returnData
			});
		})
		.catch(function(e){
			return Service.catch(req, res, e, "getBorrowBookList");
		});
	},

	getBookPage: function(req, res) {
		var limit = 12;
		var offset = 0;
		var sort_name = "name";
		var sort_type = "ASC";
		var public_user = JWT.checkPublicLogin(req);
		var userId = public_user ? public_user.id : 0;

		BookType.getBookTypeList({
			actived: 1
		})
			.then(function(bookTypes){

				Book.getBookPublic({use_quantity: {">": 0}}, limit, offset, sort_name, sort_type, userId)
					.then(function(bookResult){
						bookResult.book_types = bookTypes;

						return res.json(bookResult);
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
		var public_user = JWT.checkPublicLogin(req);
		var userId = public_user ? public_user.id : 0;

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

		Book.getBookPublic(condition, limit, offset, sort_name, sort_type, userId)
			.then(function(bookResult){
				return res.json(bookResult);
			})
			.catch(function(e){
				return Service.catch(req, res, e, "getBookList");
			});
	},

	ratingBook: function(req, res) {
		var rateType = parseInt(req.param("rate_type"));
		var bookId = parseInt(req.param("book_id"));
		var returnData = {};
		var userId = req.session.public_user.id;
		
		if(!(rateType <= 1)) {
			return Service.catch(req, res, { message: "Vui lòng nhập loại rating" }, "ratingBook");
		}
		
		if(!bookId){
			return Service.catch(req, res, { message: "Vui lòng nhập ID sách" }, "ratingBook");
		}

  	Book.findOne({
  		id: bookId
  	}).then(function(bookData){
  		if(!bookData || !Object.getOwnPropertyNames(bookData)) {
  			return Service.catch(req, res, {message: "Sách không tồn tại"}, "ratingBook");
  		}
			// Query
	  	BookRating.findOne({
				user_id: userId,
				book_id: bookId
			})
			.then(function(bookResult){
				// No record, create new 
				if(!bookResult) {
					BookRating.create({
						user_id: userId,
						book_id: bookId,
						type: rateType
					}).then(function(result){
						
						if(rateType == 1) {
							bookData.love_time += 1;

						} else if (!rateType) {
							bookData.hate_time += 1;
						}

						// sails.sockets.broadcast('BAManager', { message: "Facebook " + userId + " just like" });
						bookData.is_rating = rateType;
						
						return res.json({
							book: bookData
						});

					}).catch(function(e){
						return Service.catch(req, res, e, "ratingBook");
					});

				// has record
				} else {
					if(bookResult.type == rateType)	{ // unrate
						BookRating.destroy({
							user_id: userId,
							book_id: bookId,
						})
						.then(function(result){
							if(result && result.length) {
								if(rateType == 1) {
									bookData.love_time -= 1;

								} else if (!rateType) {
									bookData.hate_time -= 1;
								}
							}

							// sails.sockets.broadcast('BAManager', { message: "Facebook " + userId + " just like" });
							return res.json({
								book: bookData,
								action: "unrate"
							});

						}).catch(function(e){
							return Service.catch(req, res, e, "ratingBook");
						});

					} else { // change rate
						BookRating.update({
							user_id: userId,
							book_id: bookId,
						}, { type: rateType })
						.then(function(result){

							if(rateType == 1) {
								bookData.love_time += 1;
								bookData.hate_time -= 1;

							} else if (!result[0].type) {
								bookData.love_time -= 1;
								bookData.hate_time += 1;
							}
							// sails.sockets.broadcast('BAManager', { message: "Facebook " + userId + " just like" });
							
							bookData.is_rating = rateType;
							return res.json({
								book: bookData,
							});

						}).catch(function(e){
							return Service.catch(req, res, e, "ratingBook");
						});
					}
				}			

			})
			.catch(function(e){
				return Service.catch(req, res, e, "ratingBook");
			});
  	});
	},

	commentBook: function(req, res) {
		var content = (req.param("content") || "").trim();
		var bookId = parseInt(req.param("book_id"));
		var returnData = {};
		var userId = req.session.public_user.id;

		if(!bookId){
			return Service.catch(req, res, { message: "Vui lòng nhập ID sách" }, "ratingBook");
		}

		if(!content){
			return Service.catch(req, res, { message: "Vui lòng nhập nội dung sách" }, "ratingBook");
		}

		BookComment.commentBook(content, bookId, userId)
			.then(function(data){
				return res.json({
					data: data
				});
			})
			.catch(function(e){
				return Service.catch(req, res, e, "commentBook");
			});

	}
};