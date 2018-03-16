/*
		Created at 11/11/2017
 */
const CONST = require('../../const.js');
module.exports = {
	tableName: "book",
	schema: true,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		name: { type: "string", size: 100, maxLength: 100, required: true, defaultsTo: '' },
		image: { type: "string", size: 200, maxLength: 200, defaultsTo: null },
		type_id: { type: "integer", required: true, defaultsTo: 0 },
		type_name: { type: "string", required: true, maxLength: 50, defaultsTo: "Loại chung" },
		hot: { type: "integer", defaultsTo: 0 }, // 1: hot book
		comment_time: { type: "integer", defaultsTo: 0 }, // 1: hot book
		love_time: { type: "integer", defaultsTo: 0 }, // 1: hot book
		hate_time: { type: "integer", defaultsTo: 0 }, // 1: hot book
		borrow_time: { type: "integer", defaultsTo: 0 },
		author: { type: "string", size:100, maxLength: 100, defaultsTo: "" },
		intro: { type: "string", size:10000, maxLength: 10000, defaultsTo: "" },
		use_quantity: { type: 'integer', defaultsTo: 1 }, // quantity can borrow
		inventory_quantity: { type: 'integer', defaultsTo: 0 }, // book quantity in inventory
		current_quantity: { type: 'integer', defaultsTo: 1}, // current quantity, 0: not ready borrow
		note: { type: "string", size:10000, maxLength: 10000, defaultsTo: "" },
		createdAt: {type: "datetime", columnName: "created_at" },
    	updatedAt: {type: "datetime", columnName: "updated_at" }
	},

	getBookList: function (condition) {
		return new Promise(function(resolve, reject){
			Book.find(condition)
				.exec(function(err, result){
					if(err) return reject(err);
					return resolve(result);
				});
		});
	},

	countBook: function(search){
		var condition = {};

		if(search.where.name) condition.name =  search.where.name;
		if(search.where.type_id) condition.type_id = search.where.type_id;
		if(search.where.use_quantity) condition.use_quantity = search.where.use_quantity;
		
		return new Promise(function(resolve, reject){
			Book.count(condition)
				.exec(function(err, count){
					if(err) return reject(err);
					return resolve(count);
				});
		});
	},

	updateBook: function(id, data){
		return new Promise(function(resolve, reject){
			Book.findOne({
				id: id
			}).exec(function(err, result){
				if(err) return resolve(err);
				if(!result){
					return reject({
						message: "Sách không tồn tại"
					});
				}
				
				// recalc quantity when increase quantity
				if(!data.current_quantity) {
					if(data.use_quantity > result.use_quantity){
						data.current_quantity = result.current_quantity + (data.use_quantity - result.use_quantity);

					} else if(data.use_quantity < result.use_quantity) { // when reduce quantity
						data.current_quantity = result.current_quantity - (result.use_quantity - data.use_quantity);
					}
				}

				Book.update(id, data)
					.exec(function(err, result){
						if(err) return reject(err);
						if(result && result.length){
							return resolve(result[0]);
						} else {
							return reject({
								message: "Cập nhật không thành công "});
						}
					});				
			});
		});
	},

	createBook: function(data){
		return new Promise(function(resolve, reject){
			Book.findOne({
				name: data.name,
				type_id: data.type_id
			}).exec(function(err, result){
				if(err) return resolve(err);
				if(result){
					return reject({
						message: "Sách đã tồn tại"
					});
				}

				Book.create(data)
					.exec(function(err, result){
						if(err) return reject(err);
						return resolve(result);
					});				
			});
		});
	}
};