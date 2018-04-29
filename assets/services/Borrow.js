angular.module('ba').factory('Borrow', Borrow);

Borrow.$inject = ['$rootScope', 'Request', '$q', "BorrowBook", "Store"];

function Borrow($rootScope, Request, $q, BorrowBook, Store){
	var service = {
		getBorrowList: getBorrowList,
		saveBorrow: saveBorrow,
		deleteBorrow: deleteBorrow
	};
	
	var borrowList;

	function getBorrowList(param, syncData){
		
		var df = $q.defer();
		
		borrowList = Store.borrowTable.list;

		if(borrowList.length){
			df.resolve(getBorrowListStore(param));

		} else {
			Request.post("/borrow/getBorrowList")
				.then(function(res){
					if(!res.error){
						borrowList = res.borrows;
						Store.borrowTable.list = res.borrows;
						df.resolve(getBorrowListStore(param));
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
	function getBorrowListStore	(param) {

		var typing = (param.typing ? param.typing : "").toString().trim();
		if(!param.date) param.date = {};
		var startDate = param.date.startDate;
		var endDate = param.date.endDate;
		var skip = param.skip ? param.skip : 0;
		var limit = param.limit ? param.limit : 10;
		var reader_id = param.reader_id;

		var data = angular.copy(borrowList);
		var filterList = [];
		var returnList = [];

		// start filter
		for(var i in data){

			// filter by date
			if(startDate || endDate) {
				if(new Date(data[i].borrow_date) < new Date(startDate) || new Date(data[i].borrow_date) > new Date(endDate)){
					data[i].remove = true;
				}
			}

			// filter typing
			if(!data[i].remove){
				if(typing && !isNaN(typing)){
					if(typing != data[i].reader_mobile) data[i].remove = true;
					
				} else if(CONST.removeVN(data[i].reader_name).indexOf(CONST.removeVN(typing)) == -1){
				 data[i].remove = true;
				}
			}

			if(!data[i].remove && reader_id) {
				if(data[i].reader_id != reader_id) {
					data[i].remove = true;
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

		return returnList;
	} 

	function saveBorrow(data){
		var df = $q.defer();
		

		if(data.id){ // update
			Request.post("/borrow/update", data)
				.then(function(res){
					console.log("res", res);
					
					if(res && !res.error){
						Store.borrowTable.syncData("update", res.borrows, res.syncId);
						Store.borrowBookTable.syncData("delete_by_borrow", res.borrows.id, res.syncId);
						Store.borrowBookTable.syncData("create", res.borrow_books, res.syncId + 1);

						df.resolve(res.borrows.id);
						
					} else {
						df.reject(res.message);
					}
				})

				.catch(function(e){
					df.reject(e.message);
				});

		} else { // create new
			Request.post("/borrow/create", data)
				.then(function(res){

					if(res && !res.error && res.borrows && res.borrow_books && res.syncId){
						Store.borrowTable.syncData("create", res.borrows, res.syncId);
						Store.borrowBookTable.syncData("create", res.borrow_books, res.syncId);
						df.resolve(res.borrows.id);

					} else{
						df.reject(res.message);
					}
				})

				.catch(function(e){
					df.reject(e.message);
				});
		}
		return df.promise;
	}

	function deleteBorrow(params){
		var df = $q.defer();

		Request.post("/borrow/delete", params)
			.then(function(res){

				if(res && !res.error && res.borrows){
					Store.borrowTable.syncData("delete", res.borrows, res.syncId);
					Store.borrowBookTable.syncData("delete_by_borrow", res.borrows.id, res.syncId);
					df.resolve();
					
				} else {
					df.reject(res.message);
				}

			})

			.catch(function(e){
				df.reject(e.message);
			});
			return df.promise;
	}

	return service;
}