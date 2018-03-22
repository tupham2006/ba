angular.module('ba').factory('Book', Book);

Book.$inject = ['$rootScope', 'Request', '$q', "Store"];

function Book($rootScope, Request, $q, Store){

	var service = {
		getBookList: getBookList,
		saveBook: saveBook,
	};

	var bookList;

	function getBookList(params){
		
		// get store list
		bookList = Store.bookTable.list;

		var df = $q.defer();
		if(bookList.length){ // return book store
			var result = getBookListStore(params);
			df.resolve({
				books: result.data,
				count: result.count
			});

		} else { // get from server

		Request.post("/book/getAllList", params)
			.then(function(res){
				if(!res.error){
					bookList = res.books;
					Store.bookTable.list = res.books;
					var result = getBookListStore(params);
					df.resolve({
						books: result.data,
						count: result.count
					});
				} else {
					df.reject(res.message);
				}
			})

			.catch(function(err){
				df.reject(err.message);
			});
		}

		return df.promise;
	}

	/**
	 * Filter data stored
	 * @param  {[type]} param [description]
	 * @return {[type]}       data
	 */
	function getBookListStore	(param) {
		// status
		// 0: all book
		// 1: exist book(inventory + using book)
		// 2: using book
		// 3: only inventory
		// 4 deleted book
		
		var typing = param.typing ? param.typing : "";
		var type_id = param.type_id;
		var status = param.status ? param.status : 2;
		var skip = param.skip ? param.skip : 0;
		var limit = param.limit ? param.limit : 10;

		var data = angular.copy(bookList);
		
		var filterList = [];
		var returnList = [];

		// start filter
		for(var i in data){

			if(typing) {
				if(CONST.removeVN(data[i].name).indexOf(CONST.removeVN(typing)) == -1){
				 data[i].remove = true;
				}
			}

			if(!data[i].remove) {
				if(type_id){
					if(data[i].type_id != type_id) data[i].remove = true;
				}
			}
			if(!data[i].remove){
				if(status == 2){ // get using book
					if(!data[i].use_quantity) data[i].remove = true;

				} else if(status == 1){
					if(!data[i].use_quantity && !data[i].inventory_quantity) data[i].remove = true;

				} else if (status == 3) {
					if(!data[i].inventory_quantity) data[i].remove = true;

				} else if(status == 4) {
					if(data[i].use_quantity || data[i].inventory_quantity) data[i].remove = true;
				}
			}

			// push to list
			if(!data[i].remove){
				filterList.push(data[i]);
			}			
		}

		// limit and skip, cut record
		for(var j = 0; j < filterList.length; j++){
			
			if(j >= skip && returnList.length < limit){
				returnList.push(filterList[j]);
			}
		}

		return {
			data: returnList,
			count: filterList.length
		};
	} 

	function saveBook(data){
		var df = $q.defer();
		if(data.id){
			Request.post("/book/update", data)
				.then(function(res){
					if(!res.error){
						Store.bookTable.update = res.book;
						df.resolve();
					} else {
						df.reject(res.message);
					}
				})

				.catch(function(err){
					df.reject(err.message);
				});

		} else {
			Request.post("/book/create", data)
				.then(function(res){
					if(!res.error){
						Store.bookTable.create = res.book;
						
						df.resolve();
					} else {
						df.reject(res.message);
					}
				})

				.catch(function(err){
					df.reject(err.message);
				});
						
		}

		return df.promise;
	}

	return service;
}