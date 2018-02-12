angular.module('ba').directive('positionSelect', [
	"Position", 
	function(Position) {
		return {
			require: "?ngModel",
			restrict: 'E',
			scope: {
				ngModel:"=",
				editMode: "="
			},
			template: '<select ng-change="positionChange()" class="form-control" ng-model="ngModel" convert-to-number><option value="0" ng-hide="editMode">Tẩt cả các quyền</option><option ng-repeat="position in positionList track by $index" value={{position.id}}>{{position.name}}</option></select>',
			link: function(scope, attr, ele, ctrl){
				scope.positionList = [];
				Position.getPositionList()
					.then(function(positions){
						scope.positionList = positions;
					});

				scope.positionChange = function(){
					ctrl.$setViewValue(scope.ngModel);
				};
			}
		};
}]);