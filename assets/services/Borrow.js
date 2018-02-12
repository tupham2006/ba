angular.module('ba').factory('Borrow', Borrow);

Borrow.$inject = ['$rootScope', 'Request', '$q', "BorrowBook", "Store"];

function Borrow($rootScope, Request, $q, BorrowBook, Store){
	var service = {
		getBorrowList: getBorrowList,
		saveBorrow: saveBorrow,
		deleteBorrow: deleteBorrow
	};
	
	var borrowList, borrowBookList;

	function getBorrowList(param){
		
		var df = $q.defer();
		borrowList = Store.borrowTable.list;
		borrowBookList = Store.borrowBookTable.list;
		
		if(borrowList.length){
			df.resolve(getBorrowListStore(param));
		} else {
			Request.post("/borrow/getBorrowList")
				.then(function(res){
					if(!res.error){
						borrowList = res.borrows;
						Store.borrowTable.list = res.borrows;

					} else {
						df.reject(res.message);
					}
				})

				.then(function(){
					
					if(borrowBookList && borrowBookList.length){
						df.resolve(getBorrowListStore(param));

					} else {
						BorrowBook.getBorrowBookList()
							.then(function(book_borrows){
								borrowBookList = book_borrows;
								df.resolve(getBorrowListStore(param));
							});
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
		var startDate = param.date.startDate;
		var endDate = param.date.endDate;
		var skip = param.skip ? param.skip : 0;
		var limit = param.limit ? param.limit : 10;

		var data = angular.copy(borrowList);
		var filterList = [];
		var returnList = [];

		// start filter
		for(var i in data){

			// filter by date
			if(new Date(data[i].borrow_date) < new Date(startDate) || new Date(data[i].borrow_date) > new Date(endDate)){
				data[i].remove = true;
			}

			// filter typing
			if(!data[i].remove){
				if(typing && !isNaN(typing)){
					if(typing != data[i].reader_mobile) data[i].remove = true;
					
				} else if(CONST.removeVN(data[i].reader_name).indexOf(CONST.removeVN(typing)) == -1){
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

		// get borrow book
		for(var k in returnList){
			returnList[k].book = [];

			for(var o in borrowBookList){
				if(returnList[k].id == borrowBookList[o].borrow_id){
					returnList[k].book.push({
						id: borrowBookList[o].id,
						book_id: borrowBookList[o].book_id,
						book_name: borrowBookList[o].book_name,
						status: borrowBookList[o].status
					});
				}
			}
		}

		return returnList;
	} 

	function saveBorrow(data){
		var df = $q.defer();
		var bookList = Store.bookTable.list;

		if(data.id){ // update
			Request.post("/borrow/update", data)
				.then(function(res){

					if(res && !res.error){
						Store.borrowTable.update = res.borrows;

						//// Update borrow book, delete then create new
						// delete borrow book, data before update
						var borrowBookByBorrowId = [];
						for(var z in borrowBookList){
							if(borrowBookList[z].borrow_id == res.borrows.id){
								borrowBookByBorrowId.push(borrowBookList[z]);
							}
						}

						for(var i in borrowBookByBorrowId){
							for(var j in bookList){
								if(borrowBookByBorrowId[i].book_id == bookList[j].id){
									if(borrowBookByBorrowId[i].status){
										bookList[j].current_quantity += 1;
										bookList[j].borrow_time -= 1;
									} else {
										bookList[j].borrow_time -= 1;
									}
									Store.bookTable.update = bookList[j];
								}
							}
						}

						// delete store data
						Store.borrowBookTable.delete_by_borrow = res.borrows.id;

						// recreate after delete
						for(var b in res.borrow_books){
							Store.borrowBookTable.create = res.borrow_books[b];
							for(var x in bookList){
								if(res.borrow_books[b].book_id == bookList[x].id){
									if(res.borrow_books[b].status){
										bookList[x].current_quantity -= 1;
										bookList[x].borrow_time += 1;
									} else {
										bookList[x].borrow_time += 1;
									}
									Store.bookTable.update = bookList[x];
								}
							}
						}

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
					if(res && !res.error && res.borrows && res.readers && res.borrow_books){
							
						Store.borrowTable.create = res.borrows;
						Store.borrowBookTable.create = res.borrow_books;

						// handle reader
						res.readers.borrow_time += 1;
						if(!res.readers.exist_reader){
							Store.readerTable.create = res.readers;
						} else {
							Store.readerTable.update = res.readers;
						}
						
						// update book list
						for(var i in res.borrow_books){
							for(var j in bookList){
								if(res.borrow_books[i].book_id == bookList[j].id){
									bookList[j].current_quantity -= 1;
									bookList[j].borrow_time += 1;
									Store.bookTable.update = bookList[j];
								}
							}
						}

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
		var bookList = Store.bookTable.list;
		Request.post("/borrow/delete", params)
			.then(function(res){
				console.log("res", res);

				if(res && !res.error && res.borrows){
					Store.borrowTable.delete = res.borrows.id;

					//// Update borrow book, delete then create new
					// delete borrow book, data before update
					var borrowBookByBorrowId = [];
					for(var z in borrowBookList){
						if(borrowBookList[z].borrow_id == res.borrows.id){
							borrowBookByBorrowId.push(borrowBookList[z]);
						}
					}

					for(var i in borrowBookByBorrowId){
						for(var j in bookList){
							if(borrowBookByBorrowId[i].book_id == bookList[j].id){
								if(borrowBookByBorrowId[i].status){
									bookList[j].current_quantity += 1;
									bookList[j].borrow_time -= 1;
								} else {
									bookList[j].borrow_time -= 1;
								}
								Store.bookTable.update = bookList[j];
							}
						}
					}

					// delete store data
					Store.borrowBookTable.delete_by_borrow = res.borrows.id;

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