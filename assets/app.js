// Define app
angular.module('ba',[
	'ui.router',
	'daterangepicker',
	"ui.bootstrap",
	"angularFileUpload",
	"ngCookies",
	"ui.mask",
	"blockUI",
	"chart.js"
])

// Router
.config([
	'$stateProvider', 
	'$locationProvider', 
	'uiMask.ConfigProvider', 
	"blockUIConfig",
	"ChartJsProvider",
	"$urlRouterProvider", 
	function ($stateProvider, $locationProvider, uiMaskConfigProvider, blockUIConfig, ChartJsProvider, $urlRouterProvider) {
	
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state("dashboard",{
			url: "/",
			templateUrl: "/templates/dashboard/dashboard.html",
			controller: "DashboardCtrl"
		})

		.state("admin",{
			url: "/admin",
			templateUrl: "/templates/admin/admin.html",
			controller: "AdminCtrl"
		})

		.state("profile",{
			url: "/profile",
			templateUrl: "/templates/user/profile.html",
			controller: "UserCtrl"
		})

		.state("event",{
			url: "/event",
			templateUrl: "/templates/event/event.html",
			controller: "EvenCtrl"
		})

		.state("book",{
			url: "/book",
			templateUrl: "/templates/book/book.html",
			controller: "BookCtrl"
		})

		.state("reader",{
			url: "/reader",
			templateUrl: "/templates/reader/reader.html",
			controller: "ReaderCtrl"
		})

		.state("borrow",{
			url: "/borrow",
			templateUrl: "/templates/borrow/borrow.html",
			controller: "BorrowCtrl"
		})
		.state("report", {})
		.state("report.borrow", {
			url: "/report/borrow",
			templateUrl: "/templates/report/borrow/borrow.html",
			controller: "ReportBorrowTimeCtrl"
		});

		$locationProvider.hashPrefix('');

		// ui mask config
	  uiMaskConfigProvider.clearOnBlur(false);
	  uiMaskConfigProvider.allowInvalidValue(true);
	  uiMaskConfigProvider.clearOnBlurPlaceholder(true);

	  // ui block 
	  blockUIConfig.message = 'Đang tải';

	  // chart
	  ChartJsProvider.setOptions({
	  	chartColors:  ['#0078ff', '#FF8A80'],
	  	layout: {
				padding: "10"
			},
      legend: {
      	display: true,
      	position: "bottom"
      },
			maintainAspectRatio: false,
	  });

}])
.run(["$rootScope", function($rootScope){
	$rootScope._error = {};
	window.$rootScope = $rootScope; // for debug
	$rootScope._validate = function(type, data){
		
		switch(type){
	    case "name":
	      data = (data ? data : "").toString().replace(/ /g, "");
	      if(!data.length){
	        $rootScope._error.name = true;
	      } else {
	        if($rootScope._error.name) delete $rootScope._error.name;
	      }
	      break;

	    case "mobile":
	      data = (data ? data : "").toString();
	    
	      if(/[^0-9]/g.test(data) || data.length < 10 || data.length > 11){
	        $rootScope._error.mobile = true;
	      } else {
	        if($rootScope._error.mobile) delete $rootScope._error.mobile;
	      }
	      break;
	    case "array":
	      data = data.toString();
	    
	      if(!data || !data.length){
	        $rootScope._error.array = true;
	      } else {
	        if($rootScope._error.array) delete $rootScope._error.array;
	      }
	      break;
	  }
	};
}]);