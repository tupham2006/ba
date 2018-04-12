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
.run(["$rootScope", "Notification","$state", "User", "$cookies", "Store", function($rootScope, Notification, $state, User, $cookies, Store){
	$rootScope.BAM = {};

	// init to rootScope
	$rootScope.$state = $state;
	
	$rootScope.BAM.notification = {
		data: [],
		unread_count: 0,
		readNotification: readNotification
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
				
				var i, htmlNotification = [];
				$rootScope.BAM.notification.unread_count = 0;

				for(i in $rootScope.BAM.notification.data) {
					if($rootScope.BAM.notification.data[i].id > $rootScope.user.last_seen_noti_id) {
						$rootScope.BAM.notification.unread_count += 1;
					}

					htmlNotification.push('<li role="menuitem" class="fix-notification">');
					htmlNotification.push('<a href="javascript:void(0)" ng-click="' + renderActionNotification($rootScope.BAM.notification.data[i].click) + '" ' + (($rootScope.BAM.notification.data[i].id > $rootScope.user.last_seen_noti_id) ? 'style="background: #f6f6f6"' : "") + '>');
					htmlNotification.push('<div class="fix-notification-message"><i class="fa '+ renderNotificationClassByPriotity($rootScope.BAM.notification.data[i].priority) + '"></i> ' + $rootScope.BAM.notification.data[i].message + '</div>');
					htmlNotification.push('<div class="fix-notification-info">' + moment($rootScope.BAM.notification.data[i].created_at).format("HH:mm DD/MM/YYYY") + '</div>');
					htmlNotification.push('</a>');
					htmlNotification.push('</li>');
				}

				// build notification
				angular.element($("#notification").html(htmlNotification.join("")));
			})
			.catch(function(err){
				toast.error(err);
			});
	}

	function renderNotificationClassByPriotity(priority) {
		switch(priority) {
			case "INFO": return "";
			case "PRIMARY": return "fa-info-circle text-blue";
			case "WARNING": return "fa-exclamation-triangle text-orange";
			case "ERROR": return "fa-minus-circle text-red";
			default: return "";
		}
	}

	function renderActionNotification(action) {
		switch(action) {
			default: return "$state.go(" + action + ")";
		}
	}

	function readNotification() {
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
			console.log("res", res);
			Store.notificationTable.syncData(res.action, res.data);
			getNotification();
		});
	}

}]);