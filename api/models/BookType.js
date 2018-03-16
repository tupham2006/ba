/*
		Created at 11/11/2017
 */
const CONST = require('../../const.js');
module.exports = {
	tableName: "book_type",
	schema: true,
	autoCreatedAt: false,
	autoUpdatedAt: false,
	attributes: {
		id: { type: "integer", primaryKey: true, autoIncrement: true },
		name: { type: "string", size: 100, maxLength: 100, required: true },
		actived: { type: "integer", defaultsTo: 1},
	},

	getBookTypeList: function () {
		return new Promise(function(resolve, reject){
			BookType.find()
				.exec(function(err, result){
					if(err) return reject(err);
					return resolve(result);
				});
		});
	},

	getBookTypeInfo: function(condition){
		return new Promise(function(resolve, reject){
			BookType.findOne(condition)
				.exec(function(err, result){
					if(err) return reject(err);
					if(!result) result = {};
					return resolve(result);
				});
		});
	}
};