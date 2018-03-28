angular.module('ba').controller("DashboardCtrl", [
	"$scope",
	"Dashboard",
	"Facutly",
	"$state",
	"$rootScope",
	function($scope, Dashboard, Facutly, $state, $rootScope){
		$rootScope.BAM.active_page = "dashboard";

		$scope.date = {
			start_date: moment().startOf("month").toISOString(),
		 	end_date: moment().endOf("month").toISOString()
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
		
		$scope.initReaderParam = function() {
			$scope.reader = {
				data: [],
				title: []
			};
		};

		$scope.initReaderParam();

		$scope.initBookParam = function() {
			$scope.book = {
				data: [],
				title: []
			};
		};

		$scope.initBookParam();

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

		$scope.init = function(){
			var param = {
				start_date: $scope.date.start_date,
	  		end_date: $scope.date.end_date
			};
			Facutly.getFacutlyList()
				.then(function(facutly){
					$scope.facutly = facutly;
				})
				.then(function(){
					Dashboard.getDashboard(param)
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

								$scope.borrow.max_borrow_reader = result.borrow.max_borrow_reader;
								$scope.borrow.borrow_book_count = result.borrow.borrow_book_count || 0;

								// handle reader
								if(result && result.reader && result.reader.data) {
									$scope.initReaderParam();

									for(var i in result.reader.data) {
										for (var j in $scope.facutly) {
											if( result.reader.data[i].facutly_id == $scope.facutly[j].id) {
												result.reader.data[i].facutly_name = $scope.facutly[j].name;
												break;
											}
										}

										$scope.reader.data.push(result.reader.data[i].times);
										$scope.reader.title.push(result.reader.data[i].facutly_name);
									}
								}

								// handle book
								if(result && result.book && result.book.data) {
									$scope.initBookParam();

									for(var i in result.book.data) {

										$scope.book.data.push(result.book.data[i].times);
										$scope.book.title.push(result.book.data[i].type_name);
									}
								}
							}
						});
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

		$scope.init();
	}
]);
