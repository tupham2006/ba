angular.module('ba')
	.controller("ReportBorrowTimeCtrl",[
		"$scope",
	  "$rootScope", 
	  "toastr",
	  "Dialog",
	  "Report",
	  "$uibModal",
	  function($scope, $rootScope, toastr, Dialog, Report, $uibModal){
			
			$rootScope.activePage = "report";
			$scope.borrowTimeList = [];
			$scope.borrowTime = [[],[]];
			$scope.borrowDate = [];
			$scope.series = ["Lượt mượn ", "Sách mượn" ];
			$scope.options = {
				elements: { 
					line: {
						fill: false
					}
				}				
			};

			$scope.filter = {
				date: {
					startDate: moment().subtract(2, 'weeks').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		  		endDate: moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
				},
				limit: 10,
  			skip: 0,
			};

			$scope.reportBorrowTime = function(){
				Report.reportBorrowTime()
					.then(function(result){
							if(result && result.borrow && result.borrow.length && result.borrow_book && result.borrow_book.length) {
								$scope.borrowTimeList = result.borrow;
								
								for(var i in result.borrow) {
									$scope.borrowTime[0].push(result.borrow[i].times);
									$scope.borrowDate.push(moment(result.borrow[i].borrow_date).format("DD/MM"));
								}

								
								for(var i in result.borrow_book) {
									$scope.borrowTime[1].push(result.borrow_book[i].times);
								}


								// handle table
								for(var j in $scope.borrowTimeList) {
									for(var k in result.borrow_book) {
										if(moment($scope.borrowTimeList[j].borrow_date).isSame(moment(result.borrow_book[k].borrow_date), "days")) {
											$scope.borrowTimeList[j].borrow_book_times = result.borrow_book[k].times;
										}
									}
								}
							}
							
					})

					.catch(function(err){
						toastr.error(err);
					});

			};

			$scope.handleReport = function() {

			};

			$scope.reportBorrowTime();
		}
	]);