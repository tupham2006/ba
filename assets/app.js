// Define app
angular.module('ba',[
	'ui.router',
	'daterangepicker',
	"toastr",
	"ui.bootstrap",
	"angularjs-dropdown-multiselect",
	"angularFileUpload",
	"ngCookies",
	"ui.mask",
	"blockUI"
])

// Router
.config([
	'$stateProvider', 
	'$locationProvider', 
	'uiMask.ConfigProvider', 
	"blockUIConfig", 
	function ($stateProvider, $locationProvider, uiMaskConfigProvider, blockUIConfig) {

	$stateProvider
		.state("dashboard",{
			url: "/",
			templateUrl: "/templates/auth/dashboard.html",
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
		.state("report", {
			url: "/report/overview",
			templateUrl: "/templates/report/overview.html",
			controller: "OverviewCtrl"
		});

		$locationProvider.hashPrefix('');

		// ui mask config
	  uiMaskConfigProvider.clearOnBlur(false);
	  uiMaskConfigProvider.allowInvalidValue(true);
	  uiMaskConfigProvider.clearOnBlurPlaceholder(true);

	  // ui block 
	  blockUIConfig.message = 'Đang tải';

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