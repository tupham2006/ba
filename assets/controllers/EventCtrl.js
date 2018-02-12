angular.module('ba')
	.controller("EvenCtrl", ["$scope", "User", "$rootScope", function($scope, User, $rootScope){
		$rootScope.activePage = "event";
	}]);