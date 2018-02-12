angular.module('ba').factory('BookType', BookType);
BookType.$inject = ['Request', '$q', "Store"];

function BookType(Request, $q, Store){

	var service = {
		getBookTypeList: getBookTypeList,
		saveBookType: saveBookType
	};

	var bookTypeList;

	function getBookTypeList(param){
		bookTypeList = Store.bookTypeTable.list;

		var df = $q.defer();
		if(bookTypeList.length){
			df.resolve(getBookTypeListStore(param));
		} else {
			Request.post("/bookType/getList", param)
				.then(function(res){
					if(!res.error){
						bookTypeList = res.book_type;
						Store.bookTypeTable.list = res.book_type;
						df.resolve(getBookTypeListStore(param));
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

	function getBookTypeListStore(param){

		if(!param) param = {};
		var actived = !isNaN(param.actived) ? param.actived : 1;
		var data = angular.copy(bookTypeList);

		var filterList = [];

		// start filter
		for(var i in data){

			// filter typing
			if(actived){
				if(data[i].actived != actived) data[i].remove = true;
			}
			
			// push to list
			if(!data[i].remove){
				filterList.push(data[i]);
			}			
		}

		return filterList;
	}

	function saveBookType(data){
		var df = $q.defer();
		if(data.id){
			Request.post("/bookType/update", data)
				.then(function(res){
					if(!res.error){
						Store.bookTypeTable.update = res.book_type;
						df.resolve();
					} else {
						df.reject(res.message);
					}
				})

				.catch(function(err){
					df.reject(err.message);
				});

		} else {
			Request.post("/bookType/create", data)
				.then(function(res){
					if(!res.error){
						Store.bookTypeTable.create = res.book_type;
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