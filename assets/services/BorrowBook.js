angular.module('ba').factory('BorrowBook', BorrowBook);

BorrowBook.$inject = ['$rootScope', 'Request', '$q', "Store"];

function BorrowBook($rootScope, Request, $q, Store){
	var service = {
		getBorrowBookList: getBorrowBookList
	};

	var borrowBookList;
	
	function getBorrowBookList(){
		borrowBookList = Store.borrowBookTable.list;

		var df = $q.defer();
		if(borrowBookList.length){
			df.resolve(borrowBookList);

		} else {
			Request.post("/borrowBook/getList")
				.then(function(res){
					if(!res.error){
						Store.borrowBookTable.list = res.borrow_books;
						borrowBookList = Store.borrowBookTable.list;
						df.resolve(borrowBookList);
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

	function getBorrowBookStore(params) {
		var returnList = [];
		var list = angular.copy(Store.borrowBook.list);

		for(var i in list) {
			if(params && params.date && params.date.endDate && params.date.startDate) {
				if(new Date(list[i].borrow_date) > new Date(params.date.endDate) || new Date(list[i].borrow_date) < new Date(params.date.startDate)){
					list[i].remove = true;
				}
			}

			if(!list[i].remove) {
				returnList.push(list[i]);
			}
		}

		return returnList;
	}

	return service;
}