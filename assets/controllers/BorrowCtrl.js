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
	    		})
	    		.catch(function(e){
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
    		date : moment().startOf('days')
    	};
    	$scope.payDate = {
    		date: moment().startOf('days')
    	};

    	$scope.borrowDateOption = {
	    	singleDatePicker: true,
	    	drops: "up",
	    	eventHandlers: {
		      'apply.daterangepicker': function(ev, picker) { // when user apply new date range
	    			$scope.borrowInfo.warning_borrow_time = Math.max(0, moment($scope.payDate.date).diff(moment($scope.borrowDate.date), "milliseconds"));
		      }
		  	}
	    };

	    $scope.payDateOption = {
	    	singleDatePicker: true,
	    	drops: "up",
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
		    		borrow_date: moment().startOf('days'),
		    		status: 1,
		    		deposit_id: 1,
		    		book: [],
		    		note: "",
		    		reader_name: "",
		    		reader_mobile: "",
		    		facutly_id: 1,
		    		reader_gender: 0,
		    		course: ""
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

	    $scope.addBookToBorrow = function(book){
	    	
	    	if(book.current_quantity == 0) return;

	    	$scope.bookName = "";

	    	// not allow add 2 time 1 book
	    	for(var i in $scope.borrowInfo.book){
	    		if($scope.borrowInfo.book[i].book_id == book.id){
	    			return;
	    		}
	    	}

	    	$scope.borrowInfo.book.push({
	    		book_id: book.id,
	    		book_name: book.name,
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
	    		borrow_date: moment($scope.borrowDate.date).startOf('days').toISOString(),
	    		deposit_id: $scope.borrowInfo.deposit_id,
	    		note: $scope.borrowInfo.note,
	    		reader_id: $scope.borrowInfo.reader_id,
	    		reader_name: $scope.borrowInfo.reader_name,
	    		reader_mobile: $scope.borrowInfo.reader_mobile.replace(/ /g, ""),
	    		book: $scope.borrowInfo.book,
	    		status: $scope.borrowInfo.status,
	    		facutly_id: $scope.borrowInfo.facutly_id,
	    		course: $scope.borrowInfo.course,
	    		reader_gender: $scope.borrowInfo.reader_gender
	    	};

	    	if(type == "BORROW_NOW") params.status = 0;

	    	// Kiểm tra xem có phải trạng thái trả sách hay không
	    	// Với status chính = 1
	    	if(params.status == 1) {

	    	// với status chính = 0
	    	// Set toàn bộ trạng thái của sách về đã trả
	    	} else {
	    		for(var i in params.book){
	    			params.book[i].status = 0;
	    		}

	    		// đặt ngày trả
	    		if(!$scope.payDate.date){
	    			params.pay_date = moment().startOf('days').toISOString();
	    		} else {
	    			params.pay_date = moment($scope.payDate.date).startOf('days').toISOString();
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
	    			$scope.payDate.date = $scope.borrowInfo.pay_date = moment().startOf('days');
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
				Store.bookTable.syncData(res.action, res.data.book, res.data.syncId);
				$scope.getBookList();
			});
  	}

  	if (!io.socket.borrowEventReady) {
    	io.socket.borrowEventReady = true;
			io.socket.on("borrow", function(res){
				if(res.action == "create") {
					Store.borrowTable.syncData(res.action, res.data.borrows, res.data.syncId);
					Store.borrowBookTable.syncData("create", res.data.borrow_books, res.data.syncId);

				} else if(res.action == "update") {
					Store.borrowTable.syncData(res.action, res.data.borrows, res.data.syncId);
					Store.borrowBookTable.syncData("delete_by_borrow", res.data.borrows.id, res.data.syncId);
					Store.borrowBookTable.syncData("create", res.data.borrow_books, res.data.syncId+1);

				} else if(res.action == "delete") {
					Store.borrowTable.syncData(res.action, res.data.borrows, res.data.syncId);
					Store.borrowBookTable.syncData("delete_by_borrow", res.data.borrows.id, res.data.syncId);
				}

				$scope.getBorrowList('sync');
			});
  	}

		if (!io.socket.readerEventReady) {
			io.socket.on("reader", function(res){
		  io.socket.readerEventReady = true;
				Store.readerTable.syncData(res.action, res.data.reader, res.data.syncId);
			});
		}		

		$scope.changeMode = function(){
			if(!$rootScope.BAM.isMobile) return;
			$scope.borrowMobile.createMode = !$scope.borrowMobile.createMode;
		};

    $scope.init();
  }]);