angular.module('ba')
	.controller("ReportBorrowCtrl",[
		"$scope",
	  "$rootScope", 
	  "Dialog",
	  "Report",
	  "$uibModal",
	  function($scope, $rootScope, toastr, Dialog, $uibModal){
		

			$scope.changePageMode();
	  }
]);