angular.module('ba')
	.controller("BorrowCtrl",[
		"$scope",
	  "Borrow", 
	  "$rootScope", 
	  "Dialog",
	  "$uibModal",
	  "Book",
	  "Reader",
	  "$timeout",
	  "BorrowBook",
	  "Store",
	  function($scope, Borrow, $rootScope, Dialog, $uibModal, Book, Reader, $timeout, BorrowBook, Store){
	  	$rootScope.BAM.active_page = 'borrow';
			$scope.borrowMobile = {};

	  	$scope.borrowList = [];

	  	$scope.filter = {
	  		date: {
		  		startDate: moment().subtract(2, 'weeks').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		  		endDate: moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
	  		},
	  		typing: "",
	  		limit: 50,
	  		skip: 0
	  	};

	  	// init dateranger
	  	$scope.dateOption = {
	  		ranges: {
	        "2 tuần trước": [
	          moment().subtract(2, 'weeks').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
	        	moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
	        ],
	        "Tuần này": [
	            moment().startOf('week').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
	            moment().endOf('week').set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
	        ],
	        "Tuần trước": [
	            moment().subtract(1, 'weeks').startOf('week').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
	            moment().subtract(1, 'weeks').endOf('week').set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
	        ],
	        "Tháng này": [
	            moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
	            moment().endOf('month').set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
	        ],
	        "Tháng trước": [
	            moment().subtract(1, 'months').startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
	            moment().subtract(1, 'months').endOf('month').set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
	        ],
	        "Tùy chọn": [
	            moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
	            moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
	        ]
		    },
	     	linkedCalendars: false,
    		autoUpdateInput: false,
    		showCustomRangeLabel: false,
	      startDate: $scope.filter.date.startDate,
	      endDate: $scope.filter.date.endDate,
	      autoApply: true,
	      locale: {
	        "format": "DD/MM/YYYY",
	        "separator": " - ",
	        "applyLabel": "OK",
	        "cancelLabel": "Hủy",
	        "fromLabel": "Từ",
	        "toLabel": "Đến",
	        "customRangeLabel": "Tùy chọn",
	        "weekLabel": "Tuần",
	        "daysOfWeek": ["CN", "T2", "T3", "T4", "T5", "T6", "T7" ],
	        "monthNames": ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 11", "Tháng 10","Tháng 12"],
	      	"firstDay": 1
	      },
	      eventHandlers: {
		      'apply.daterangepicker': function(ev, picker) { // when user apply new date range
		          $scope.getBorrowList();
		      }
		  	}
	    };

	    $scope.bookList  = [];
	    $scope.bookTypeList = [];
	    $scope.bookFilter = {
	    	type_id: 0,
	    	search: '',
	    	actived: 1,
	    	limit: 50,
	    	skip: 0
	    };

	    $scope.borrowList = [];

	    $scope.init = function(res){
	    	$scope.getBookList();
	    	$scope.getBorrowList(res);
	    	$scope.getReaderList();
	    };

	    $scope.getBorrowList = function(id, action){
	    	
	    	var params = angular.copy($scope.filter);
	    	var i, k;
	    	if(action == "LOAD_MORE") {
	    		params.skip = $scope.borrowList.length;
	    	} else {
	    		$scope.borrowList = [];
	    	}

	    	Borrow.getBorrowList(params)
	    		.then(function(res){

	    			var borrowList = angular.copy(res);
			    	$scope.borrowList = $scope.borrowList.concat(borrowList);
	    		})

	    		.then(function(){
	    			BorrowBook.getBorrowBookList()
							.then(function(book_borrows){

								// get borrow book
								for(k in $scope.borrowList){
									
									// set highlight if sync
									if(id == 'sync') {
										if($scope.borrowInfo && $scope.borrowInfo.id) {
											if($scope.borrowInfo.id == $scope.borrowList[k].id) {
												$scope.borrowList[k].is_selected = true;
											}
										}
									}

									$scope.borrowList[k].book = [];
									for(i in book_borrows) {
										if($scope.borrowList[k].id == book_borrows[i].borrow_id){
											$scope.borrowList[k].book.push(book_borrows[i]);
										}
									}
								}

								if(id != 'sync') {
			    				$scope.showBorrowDetail(id);
								}
							
							});
	    		})

	    		.catch(function(err){
	    			toastr.error(err);
	    		});
	    };

	    $scope.getBookList = function(action){
	    	
	    	var params = angular.copy($scope.bookFilter);
					    	
	    	if(action == "LOAD_MORE") {
	    		params.skip = $scope.bookList.length;
	    	} else {
	    		$scope.bookList = [];
	    	}

	    	Book.getBookList(params)
	    		.then(function(resBook){

	    			$scope.bookList = $scope.bookList.concat(resBook.books);
	    		})

	    		.catch(function(err){
	    			toastr.error(err);
	    		});
	    };

	    // get list to store
	    $scope.getReaderList = function(){
	    	Reader.getReaderList({})
	    		.then(function(res){
	    		});
	    };

	    $scope.showBookDefail =  function(id){

	    	for(var i in $scope.bookList){
	    		if($scope.bookList[i].id == id){
	    			$scope.bookInfo = $scope.bookList[i];
	    		}
	    	}
	    };

    	$scope.borrowDate = {
    		date : moment()
    	};
    	$scope.payDate = {
    		date: moment()
    	};

    	$scope.borrowDateOption = {
	    	singleDatePicker: true,
	    	eventHandlers: {
		      'apply.daterangepicker': function(ev, picker) { // when user apply new date range
	    			$scope.borrowInfo.warning_borrow_time = Math.max(0, moment($scope.payDate.date).diff(moment($scope.borrowDate.date), "milliseconds"));
		      }
		  	}
	    };

	    $scope.payDateOption = {
	    	singleDatePicker: true,
	    	eventHandlers: {
		      'apply.daterangepicker': function(ev, picker) { // when user apply new date range							  	
	    			$scope.borrowInfo.warning_borrow_time = Math.max(0, moment($scope.payDate.date).diff(moment($scope.borrowDate.date), "milliseconds"));
		      }
		  	}
	    };

	    $scope.showBorrowDetail = function(id){
	    	$scope.existReader = false;
	    	$scope.borrowInfo = {};

    		for(var i in $scope.borrowList){
    			if($scope.borrowList[i].id == id){
    				$scope.borrowInfo = angular.copy($scope.borrowList[i]);
    				$scope.borrowList[i].is_selected = true;
    				$scope.findReaderByMobile();
	    			
    			} else {
    				if($scope.borrowList[i].is_selected){
    					delete $scope.borrowList[i].is_selected;
    				}
    			}
    		}

    		if(!id || !Object.getOwnPropertyNames($scope.borrowInfo)){
	    		$scope.borrowInfo = {
		    		borrow_date: moment(),
		    		status: 1,
		    		deposit_id: 1,
		    		book: [],
		    		note: "",
		    		reader_name: "",
		    		reader_mobile: "",
		    		facutly_id: 1,
		    		reader_gender: 0,
		    		course: moment().get('years') - 1956
		    	};
    		}

	    	$scope.borrowDate.date = angular.copy(moment($scope.borrowInfo.borrow_date));
    		$scope.borrowDateOption.startDate = angular.copy(moment($scope.borrowInfo.borrow_date));

	    	if($scope.borrowInfo.pay_date){
	    		$scope.payDate.date = moment(angular.copy($scope.borrowInfo.pay_date));
	    		$scope.payDateOption = moment(angular.copy($scope.borrowInfo.pay_date));
	    		$scope.calBorrowTime();
	    	}
	    	
	    };

	    $scope.addBookToBorrow = function(id, name, currentQuantity){
	    	
	    	if(currentQuantity == 0) return;

	    	// not allow add 2 time 1 book
	    	for(var i in $scope.borrowInfo.book){
	    		if($scope.borrowInfo.book[i].book_id == id){
	    			return;
	    		}
	    	}

	    	$scope.borrowInfo.book.push({
	    		book_id: id,
	    		book_name: name,
	    		status: 1,
	    	});
	    };

	    $scope.removeBookFromBorrow = function(id){
    		var bookArray = angular.copy($scope.borrowInfo.book);
    		var newArray = [];
	    	for(var i in bookArray){
	    		if(bookArray[i].book_id != id){
	    			newArray.push(bookArray[i]);
	    		}
	    	}

    		$scope.borrowInfo.book = newArray;
	    };

	    $scope.borrowABook = function (id) {
	    	for(var i in $scope.borrowInfo.book){
	    		if($scope.borrowInfo.book[i].book_id == id ){
	    			$scope.borrowInfo.book[i].status = 0;
	    		}
	    	}
	    };

	    $scope.saveBorrow = function(type){

	    	if(!$scope.borrowInfo.book || !$scope.borrowInfo.book.length) {
	    		toastr.error("Vui lòng chọn sách");
	    		return;
	    	}

	    	var params = {
	    		borrow_date: moment($scope.borrowDate.date).toISOString(),
	    		deposit_id: $scope.borrowInfo.deposit_id,
	    		note: $scope.borrowInfo.note,
	    		reader_id: $scope.borrowInfo.reader_id,
	    		reader_name: $scope.borrowInfo.reader_name,
	    		reader_mobile: $scope.borrowInfo.reader_mobile.replace(/ /g, ""),
	    		book: $scope.borrowInfo.book,
	    		status: $scope.borrowInfo.status,
	    		user_id: $scope.user.id,
	    		facutly_id: $scope.borrowInfo.facutly_id,
	    		course: $scope.borrowInfo.course,
	    		reader_gender: $scope.borrowInfo.reader_gender
	    	};

	    	// when borrow now
	    	if(type == "BORROW_NOW"){
	    		for(var i in params.book){
	    			params.book[i].status = 0;
	    		}
	    	}

	    	if(!params.status){
	    		if(!$scope.payDate.date){
	    			params.pay_date = new Date().toISOString();
	    		} else {
	    			params.pay_date = $scope.payDate.date.toISOString();
	    		}
	    	}

	    	// if update
	    	if($scope.borrowInfo.id) params.id = $scope.borrowInfo.id;

	    	// request action
	    	Borrow.saveBorrow(params)
	    		.then(function(res){
	    			// res is borrow id
	    			$scope.init(res);
	    		})

	    		.catch(function(e){
	    			toastr.error(e);
	    		});
	    };

	    $scope.deleteBorrow = function(id){
	    	Dialog.confirmModal("Bạn có muốn xóa lượt mượn này không?")
				.then(function(action){
					if(action){
			    	Borrow.deleteBorrow({id: id})
			    		.then(function(res){
			    			$scope.getBorrowList();
			    			$scope.getBookList();
			    		})

			    		.catch(function(e){
			    			toastr.error(e);
			    		});
			    }
		    });
	    };

	    $scope.addReaderToBorrow = function(res){
				$scope.borrowInfo.reader_mobile = res.mobile;
				$scope.borrowInfo.reader_id = res.id;
				$scope.borrowInfo.reader_name = res.name;
				$scope.borrowInfo.facutly_id = res.facutly_id;
				$scope.borrowInfo.course = res.course;
				$scope.borrowInfo.reader_gender = res.gender;
				$scope.existReader = true;		
	    };

	    $scope.findReaderByMobile	= function(){

    		var params = {
    			mobile: $scope.borrowInfo.reader_mobile
    		};

    		Reader.getReaderByMobile(params)
    			.then(function(res){
    				if(res){
    					$scope.borrowInfo.reader_id = res.id;
    					$scope.borrowInfo.reader_name = res.name;
    					$scope.borrowInfo.facutly_id = res.facutly_id;
    					$scope.borrowInfo.course = res.course;
    					$scope.borrowInfo.reader_gender = res.gender;
    					$scope.existReader = true;
    				} else {
    					delete $scope.borrowInfo.reader_id;
    					$scope.existReader = false;
    				}    				
    			});
	    };

	    $scope.whenChangeStatus = function(){
	    	
	    	if(!$scope.borrowInfo.status){

	    		if(!$scope.borrowInfo.pay_date){
	    			$scope.payDate.date = $scope.borrowInfo.pay_date = moment();
	    		}
	    		
	    		for(var i in $scope.borrowInfo.book){
	    			$scope.borrowInfo.book[i].status = 0;
	    		}

	    		$scope.calBorrowTime();

	    	} else {
	    		if($scope.borrowInfo.pay_date){
	    			delete $scope.borrowInfo.pay_date;
	    		}
	    	}
	    };

	    $scope.calBorrowTime = function(){
		    $scope.borrowInfo.warning_borrow_time = Math.max(0, moment($scope.payDate.date).diff(moment($scope.borrowDate.date), "milliseconds"));
	    };

	    $scope.openReaderInfo = function (id) {
			$scope.readerInfoInstance = $uibModal.open({
				size: "lg",
				scope: $scope,
				templateUrl: "/templates/modal/reader-info.html",
				controller: "ReaderInfoCtrl",
				resolve: {
					reader_id: function(){
						return id;
					}
				}
			});

			$scope.readerInfoInstance.result.then(function(){ }, function () {});
		};

		// listen event
		if (!io.socket.bookEventReady) {
    	io.socket.bookEventReady = true;
			io.socket.on("book", function(res){
				Store.bookTable.syncData(res.action, res.data);
				$scope.getBookList();
			});
  	}

  	if (!io.socket.borrowBookEventReady) {
    	io.socket.borrowBookEventReady = true;
			io.socket.on("borrow_book", function(res){
				if(res.action == "delete") {
					var borrow_id = 0;
					res.action = "delete_by_borrow";
					if(res.data && res.data.length) borrow_id = res.data[0].borrow_id;
					res.data = borrow_id;
				}
				
				Store.borrowBookTable.syncData(res.action, res.data);
				$scope.getBorrowList('sync');
			});
  	}

  	if (!io.socket.borrowEventReady) {
    	io.socket.borrowEventReady = true;
			io.socket.on("borrow", function(res){
				Store.borrowTable.syncData(res.action, res.data);
				$scope.getBorrowList('sync');
			});
  	}

		if (!io.socket.readerEventReady) {
    	io.socket.readerEventReady = true;
			io.socket.on("reader", function(res){
				Store.readerTable.syncData(res.action, res.data);
			});
		}		

		$scope.changeMode = function(mode){
			if(!$rootScope.BAM.isMobile) return;
			$scope.borrowMobile.createMode = mode;
		};

    $scope.init();
  }]);