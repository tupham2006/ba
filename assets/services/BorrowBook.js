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

	return service;
}