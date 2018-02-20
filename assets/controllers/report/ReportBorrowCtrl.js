angular.module('ba')
	.controller("ReportBorrowCtrl",[
		"$scope",
	  "$rootScope", 
	  "toastr",
	  "Dialog",
	  "Report",
	  "$uibModal",
	  function($scope, $rootScope, toastr, Dialog, Report, $uibModal){
		

			$scope.changePageMode();
	  }
]);