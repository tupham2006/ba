angular.module('ba')
	.controller("BorrowCtrl",[
		"$scope",
	  "Borrow", 
	  "$rootScope", 
	  "toastr",
	  "Dialog",
	  "$uibModal",
	  "Book",
	  "Reader",
	  "$timeout",
	  function($scope, Borrow, $rootScope, toastr, Dialog, $uibModal, Book, Reader, $timeout){
	  	$rootScope.activePage = 'borrow';

	  	$scope.borrowList = [];
	  	$scope.viewMode = 'BORROW';

	  	$scope.filter = {
	  		date: {
		  		startDate: moment().subtract(2, 'weeks').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		  		endDate: moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
	  		},
	  		typing: "",
	  		type: 1
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
	    	limit: 5000

	    	
	    };

	    $scope.borrowList = [];

	    $scope.init = function(){
	    	$scope.getBookList();
	    	$scope.getBorrowList();
	    	$scope.getReaderList();
	    };

	    $scope.getBorrowList = function(id){

	    	Borrow.getBorrowList($scope.filter)
	    		.then(function(res){

	    			var borrowList = angular.copy(res);
			    	$scope.borrowList = borrowList;
			    	$scope.showBorrowDetail(id);
	    		})

	    		.catch(function(err){
	    			toastr.error(err);
	    		});
	    };

	    $scope.getBookList = function(){

	    	Book.getBookList($scope.bookFilter)
	    		.then(function(resBook){

	    			$scope.bookList = resBook.books;
	    		})

	    		.catch(function(err){
	    			toastr.error(err);
	    		});
	    };

	    // get list to store
	    $scope.getReaderList = function(){
	    	Reader.getReaderList()
	    		.then(function(res){
	    		});
	    };

	    $scope.showBookDefail =  function(id){
	    	$scope.viewMode = "BOOK";

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
	    			$scope.borrowInfo.warning_borrow_time = moment($scope.payDate.date).diff(moment($scope.borrowDate.date), "milliseconds");
		      }
		  	}
	    };

	    $scope.payDateOption = {
	    	singleDatePicker: true,
	    	eventHandlers: {
		      'apply.daterangepicker': function(ev, picker) { // when user apply new date range							  	
	    			$scope.borrowInfo.warning_borrow_time = moment($scope.payDate.date).diff(moment($scope.borrowDate.date), "milliseconds");
		      }
		  	}
	    };

	    $scope.showBorrowDetail = function(id){
	    	$scope.existReader = false;
	    	$rootScope._error = {};
		    $scope.viewMode = "BORROW";
    		for(var i in $scope.borrowList){
    			if($scope.borrowList[i].id == id){
    				$scope.borrowInfo = angular.copy($scope.borrowList[i]);
    				$scope.existReader = true;
    				$scope.borrowList[i].is_selected = true;
	    			
    			} else {
    				if($scope.borrowList[i].is_selected){
    					delete $scope.borrowList[i].is_selected;
    				}
    			}
    		}

    		if(!id){
	    		$scope.borrowInfo = {
		    		borrow_date: moment(),
		    		status: 1,
		    		deposit_id: 1,
		    		book: [],
		    		note: "",
		    		reader_name: "",
		    		reader_mobile: "",
		    		facutly:"CHUA_PHAN_KHOA",
		    		course: moment().get('years') - 1956
		    	};
    		}


	    	$scope.borrowDate.date = angular.copy(moment($scope.borrowInfo.borrow_date));

	    	if($scope.borrowInfo.pay_date){
	    		$scope.payDate.date = moment(angular.copy($scope.borrowInfo.pay_date));
	    		$scope.calBorrowTime();
	    	}
	    	
	    };

	    /*
	    		option min max date by borrow and pay date
	     */
	    $scope.rerenderDateOption = function(){
	    	$scope.payDateOption.minDate = moment($scope.borrowDate.date);
	    	if($scope.borrowInfo.status){ // when borrow
	    		$scope.borrowDateOption.maxDate = undefined;
	    	} else {
	    		$scope.borrowDateOption.maxDate = moment($scope.payDate.date);
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

	    	if(Object.getOwnPropertyNames($rootScope._error).length) return;


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
	    		facutly: $scope.borrowInfo.facutly,
	    		course: $scope.borrowInfo.course
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
	    			$scope.getBorrowList(res);
	    			$scope.getBookList();
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


	    $scope.findReaderByMobile	 = function(){
	    	if($rootScope._error.mobile) return;
	    		var params = {
	    			mobile: $scope.borrowInfo.reader_mobile
	    		};
	    			console.log("$scope.borrowInfo.reader_mobile", $scope.borrowInfo.reader_mobile);

	    		Reader.getReaderByMobile(params)
	    			.then(function(res){
	    				if(res){
	    					$scope.borrowInfo.reader_id = res.id;
	    					$scope.borrowInfo.reader_name = res.name;
	    					$scope.existReader = true;
	    				} else {
	    					delete $scope.borrowInfo.reader_id;
	    					delete $scope.borrowInfo.reader_name;
	    					$scope.existReader = false;
	    				}
	    				$rootScope._validate('name', $scope.borrowInfo.reader_name);
	    				
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
		    $scope.borrowInfo.warning_borrow_time = moment($scope.payDate.date).diff(moment($scope.borrowDate.date), "milliseconds");
	    };

	    $scope.init();
	  }]);