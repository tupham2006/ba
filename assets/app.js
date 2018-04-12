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

		.state("help",{
			url: "/help",
			templateUrl: "/templates/dashboard/help.html",
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
.run(["$rootScope", 
	"Notification",
	"$state", 
	"User", 
	"$cookies", 
	"Store", 
	"$compile",
	function($rootScope, Notification, $state, User, $cookies, Store, $compile){
	$rootScope.BAM = {};

	// init to rootScope
	$rootScope.$state = $state;
	
	$rootScope.BAM.notification = {
		data: [],
		unread_count: 0,
		readNotification: readNotification,
	};

	getNotification();
	$rootScope.BAM.isNavCollapsed = true;
	$rootScope.BAM.collapedOnlyMobile = function() {
		if($rootScope.BAM.isMobile) {
			$rootScope.BAM.isNavCollapsed = !$rootScope.BAM.isNavCollapsed;
		}
	};

	if(window.innerWidth < 800) {
		$rootScope.BAM.isMobile = true;	
	}

	$( window ).resize(function() {
		if(!$rootScope.BAM.isMobile && window.innerWidth < 800) {
			window.location.reload();
		} else if($rootScope.BAM.isMobile && window.innerWidth >= 800) {
			window.location.reload();
		}
	});

	/*
		Notification
	*/
	function getNotification() {
		Notification.getNotificationList()
			.then(function(res){
				$rootScope.BAM.notification.data = res;
				$rootScope.BAM.notification.unread_count = 0;				
				var i;

				for(i in $rootScope.BAM.notification.data) {
					if($rootScope.BAM.notification.data[i].id > $rootScope.user.last_seen_noti_id) {
						$rootScope.BAM.notification.unread_count += 1;
					}
				}
			})
			.catch(function(err){
				toast.error(err);
			});
	}

	function readNotification() {
		if(!$rootScope.BAM.notification.unread_count) return;
		$rootScope.BAM.notification.unread_count = 0;
		var i, user = angular.copy($rootScope.user);
		for(i in $rootScope.BAM.notification.data) {
			user.last_seen_noti_id = Math.max(user.last_seen_noti_id, $rootScope.BAM.notification.data[i].id);
		}
		User.updateUserInfo(user)
			.then(function(res){
				$rootScope.user.last_seen_noti_id = user.last_seen_noti_id;
				$cookies.putObject("user", res);
				getNotification();
			})

			.catch(function(err){
				toastr.error(err);
			});
	}

	if (!io.socket.notificationEventReady) {
  	io.socket.notificationEventReady = true;
		io.socket.on("notification", function(res){
			toastr.info(res.data.message);
			Store.notificationTable.syncData(res.action, res.data);
			getNotification();
		});
	}

}]);