angular.module('ba')
	.controller("ReportBorrowTimeCtrl",[
		"$scope",
	  "$rootScope", 
	  "Dialog",
	  "Report",
	  "Facutly",
	  "$uibModal",
	  "$q",
	  function($scope, $rootScope, Dialog, Report, Facutly, $uibModal, $q){
			
			$scope.page = {
				mode: "BORROW_TIME"
			};

			$scope.facutly = [];

			$scope.filter = {
				date: {
					startDate: moment().subtract(2, 'weeks').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		  		endDate: moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
				},
				limit: 10,
  			skip: 0,
			};

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
		          $scope.reportBorrowTime();
		      }
		  	}
	    };

			$rootScope.activePage = "report";

			// report borrow time
			$scope.borrowTimeList = [];
			$scope.borrowTime = [[],[]];
			$scope.borrowDate = [];
			$scope.series = ["Lượt mượn ", "Sách mượn" ];
			$scope.options = {
				elements: { 
					line: {
						fill: false
					},
				},
				scales: {
	      	yAxes: [{
	      		ticks: {
	            beginAtZero:true,
	            stepSize: 1
	          },
	      	}],

	      	xAxes: [{
	          gridLines: {
	          	display:false
	          }
	      	}]
	      },				
			};

			// report borrow facutly
			$scope.borrowFacutlyList = [];
			$scope.borrowFacutly = [];
			$scope.borrowFacutlyLabels = [];

			$scope.borrowCourseList = [];
			$scope.borrowCourse = [];
			$scope.borrowCourseLabels = [];

			$scope.getFacutlyList = function() {
				var defer = $q.defer();

				Facutly.getFacutlyList()
					.then(function(res){
						console.log("res", res);
						$scope.facutly = res;
						defer.resolve();
					})
					.catch(function(err){
						defer.reject(err);
					});

				return defer.promise;
			};

			$scope.reportBorrowTime = function(){
				var param = {
					start_date: new Date($scope.filter.date.startDate).toISOString(),
					end_date: new Date($scope.filter.date.endDate).toISOString(),
					skip: $scope.filter.skip,
					limit: $scope.filter.limit
				};

				Report.reportBorrowTime(param)
					.then(function(result){

						if(result && result.borrow && result.borrow.length && result.borrow_book && result.borrow_book.length) {
							$scope.borrowDate = [];
							$scope.borrowTime = [[],[]];

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

						// facutly report
						if(result && result.facutly && result.facutly.length){
							$scope.borrowFacutlyLabels = [];
							$scope.borrowFacutly = [];

							$scope.borrowFacutlyList = result.facutly;
							var total = 0;

							for(var i in result.facutly){
								$scope.borrowFacutly.push(result.facutly[i].times);
								total += result.facutly[i].times;
							}

							for(var i in $scope.borrowFacutlyList){
								$scope.borrowFacutlyList[i].percent = Math.round(result.facutly[i].times * 100 * 10 / total) / 10;
								$scope.borrowFacutlyLabels.push($scope.facutly[$scope.borrowFacutlyList[i].facutly] + "(" + $scope.borrowFacutlyList[i].percent + "%)");
							}

						}

						// facutly course
						if(result && result.course && result.course.length){
							$scope.borrowCourseLabels = [];
							$scope.borrowCourse = [];

							$scope.borrowCourseList = result.course;
							var courseTotal = 0;

							for(var i in result.course){
								$scope.borrowCourse.push(result.course[i].times);
								courseTotal += result.course[i].times;
							}

							for(var i in $scope.borrowCourseList){
								$scope.borrowCourseList[i].percent = Math.round(result.course[i].times * 100 * 10 / courseTotal) / 10;
								$scope.borrowCourseLabels.push("K." + $scope.borrowCourseList[i].course + "(" + $scope.borrowCourseList[i].percent + "%)");
							}
						}
					})

					.catch(function(err){
						toastr.error(err);
					});

			};

			$scope.changePageMode = function(mode) {
				switch(mode) {
					case "BORROW_TIME": 
							$scope.page.mode = "BORROW_TIME";
					break;

					case "BORROW_FACUTLY": 
							$scope.page.mode = "BORROW_FACUTLY";
					break;

					case "BORROW_COURSE": 
							$scope.page.mode = "BORROW_COURSE";
					break;
					
					default: 
							$scope.page.mode = "BORROW_TIME";
				}
			};

			$scope.init = function(){
				$scope.getFacutlyList()
					.then(function(){
						$scope.reportBorrowTime();
					})
					.catch(function(err){
						toastr.error(err);
					});
			};

			$scope.init();
		}
	]);