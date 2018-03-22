angular.module('ba').controller("DialogCtrl", [
	"title",
	"$scope",
	"$uibModalInstance",
	function(title, $scope, $uibModalInstance){

		$scope.title = title;
		$scope.action = function(action){
			$scope.action = action;
			$uibModalInstance.close(action);
		};
	}
]);
