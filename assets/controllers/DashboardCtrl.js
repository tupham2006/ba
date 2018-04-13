angular.module('ba').controller("DashboardCtrl", [
	"$scope",
	"Dashboard",
	"Facutly",
	"$state",
	"$rootScope",
	function($scope, Dashboard, Facutly, $state, $rootScope){
		$rootScope.BAM.active_page = "dashboard";

		$scope.filter = {
			start_date: moment().startOf("month").toISOString(),
		 	end_date: moment().endOf("month").toISOString()
		};

		// init dateranger
	  	$scope.dateRange = {
	  		value: {
	  			startDate: moment().startOf("month"),
		 			endDate: moment().endOf("month")
	  		},
	  		options: {
		  		ranges: {
		        "Tháng này": [
		            moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		            moment().endOf('month').set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
		        ],
		        "Tháng trước": [
		            moment().subtract(1, 'months').startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		            moment().subtract(1, 'months').endOf('month').set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
		        ],
		        "Tuần này": [
		            moment().startOf('week').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		            moment().endOf('week').set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
		        ],
		        "Tuần trước": [
		            moment().subtract(1, 'weeks').startOf('week').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		            moment().subtract(1, 'weeks').endOf('week').set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
		        ],
		        "2 tuần trước": [
		          moment().subtract(2, 'weeks').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		        	moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
		        ],
		        "Tùy chọn": [
		            moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}),
		            moment().set({'hour': 23, 'minute': 59, 'second': 59, 'millisecond': 999})
		        ]
			    },
		     	linkedCalendars: false,
	    		autoUpdateInput: false,
	    		showCustomRangeLabel: false,
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

			      }
			  	}
	  		}
	    };

		$scope.headerData = {};
		$scope.initParam = function() {
			$scope.borrow = {
				data: [],
				title: [],
				total: 0,
				series: ["Lượt mượn"]
			};
		};

		$scope.initParam();

		$scope.options = {
			legend: {
      	display: false,
      },
			scales: {
      	yAxes: [{
      		ticks: {
            beginAtZero:true,
            stepSize: 5
          },
      	}],

      	xAxes: [{
          gridLines: {
          	display:false
          }
      	}]
      },				
		};

		init = function(){
			Dashboard.getDashboard($scope.filter)
				.then(function(result){
					$scope.headerData.borrow_count = result.borrow_count || 0;
					$scope.headerData.book_count = result.book_count || 0;
					$scope.headerData.reader_count = result.reader_count || 0;

					if(result && result.borrow && result.borrow.data) {
						$scope.initParam();

						for(var i in result.borrow.data) {
							$scope.borrow.data.push(result.borrow.data[i].times);
							$scope.borrow.total += result.borrow.data[i].times;
							$scope.borrow.title.push(moment(result.borrow.data[i].borrow_date).format("DD/MM"));
						}

						$scope.borrow.top_reader = result.borrow.top_reader;
						$scope.borrow.top_book = result.borrow.top_book;
						$scope.borrow.top_user = result.borrow.top_user;
						$scope.borrow.borrow_book_count = result.borrow.borrow_book_count || 0;
					}
				})
				.catch(function(err){
					toastr.error(err);
				});
		};

		$scope.gotoPage = function (type) {
			if($rootScope && $rootScope.user && $rootScope.user.role >= 2) {
				$state.go(type);
			}
		};

		init();
	}
]);
