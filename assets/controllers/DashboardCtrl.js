angular.module('ba').controller("DashboardCtrl", [
	"$scope",
	"Report",
	function($scope, Report){
		$scope.date = {
			start_date: moment().startOf("month").toISOString(),
		 	end_date: moment().endOf("month").toISOString()
		};

		$rootScope.activePage = "dashboard";
		
		// report borrow time
			$scope.borrowTimeList = [];
			$scope.borrowTime = [[]];
			$scope.borrowDate = [];
			$scope.series = ["Lượt mượn"];
			$scope.options = {
				legend: {
	      	display: false,
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

			$scope.reportBorrowTime = function(){
				var param = {
					start_date: $scope.date.start_date,
		  		end_date: $scope.date.end_date
				};

				Report.reportBorrowTime(param)
					.then(function(result){

						if(result && result.borrow && result.borrow.length && result.borrow_book && result.borrow_book.length) {
							$scope.borrowDate = [];
							$scope.borrowTime = [[]];

							$scope.borrowTimeList = result.borrow;
							
							for(var i in result.borrow) {
								$scope.borrowTime[0].push(result.borrow[i].times);
								$scope.borrowDate.push(moment(result.borrow[i].borrow_date).format("DD/MM"));
							}
						}

					})

					.catch(function(err){
						toastr.error(err);
					});
			};

			$scope.reportBorrowTime();
	}
]);
