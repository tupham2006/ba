angular.module('ba').directive('depositSelect', [
	"Deposit", 
	function(Deposit) {
		return {
			require: "?ngModel",
			restrict: 'E',
			scope: {
				ngModel:"=",
				editMode: "="
			},
			template: '<select ng-change="depositChange()" class="form-control" ng-model="ngModel" convert-to-number><option value="" ng-hide="editMode">Tẩt cả loại đặt cọc</option><option ng-repeat="deposit in depositList track by $index" value={{deposit.id}}>{{deposit.name}}</option></select>',
			link: function(scope, attr, ele, ctrl){
				scope.depositList = [];
				Deposit.getDepositList()
					.then(function(deposits){
						scope.depositList = deposits;
					});

				scope.depositChange = function(){
					ctrl.$setViewValue(scope.ngModel);
				};
			}
		};
}]);