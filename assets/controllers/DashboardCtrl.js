angular.module('ba').controller("DashboardCtrl", [
	"$scope",
	"Dashboard",
	function($scope, Dashboard){
		$rootScope.activePage = "dashboard";

		$scope.date = {
			start_date: moment().startOf("month").toISOString(),
		 	end_date: moment().endOf("month").toISOString()
		};

		$scope.headerData = {};
		$scope.initParam = function() {
			$scope.borrow = {
				data: [[]],
				title: [],
				total: 0,
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

		$scope.init = function(){
			var param = {
				start_date: $scope.date.start_date,
	  		end_date: $scope.date.end_date
			};

			Dashboard.getDashboard(param)
				.then(function(result){
					console.log("result", result);

					$scope.headerData.borrow_count = result.borrow_count || 0;
					$scope.headerData.book_count = result.book_count || 0;
					$scope.headerData.reader_count = result.reader_count || 0;

					if(result && result.borrow && result.borrow.data) {
						$scope.initParam();

						for(var i in result.borrow.data) {
							$scope.borrow.data[0].push(result.borrow.data[i].times);
							$scope.borrow.total += result.borrow.data[i].times;
							$scope.borrow.title.push(moment(result.borrow.data[i].borrow_date).format("DD/MM"));
						}

						$scope.borrow.max_borrow_reader = result.borrow.max_borrow_reader;
						$scope.borrow.borrow_book_count = result.borrow.borrow_book_count || 0;
					}

				})

				.catch(function(err){
					toastr.error(err);
				});
		};

		$scope.init();
	}
]);
