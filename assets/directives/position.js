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
			template: '<select ng-change="positionChange()" class="form-control" ng-model="ngModel" convert-to-number><option value="" ng-hide="editMode">Tẩt cả các chức vụ</option><option value="0">Chưa có chức vụ</option><option ng-repeat="position in positionList track by $index" value={{position.id}}>{{position.name}}</option></select>',
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

angular.module('ba').directive('positionHtml', [
	"Position", 
	function(Position) {
		return {
			restrict: 'E',
			scope: {
				ngModel:"=",
			},
			template: '<span ng-if="ngModel == 0"> Chưa có chức vụ </span><span ng-if="ngModel"><span ng-repeat="position in positionList" ng-if="position.id == ngModel">{{ position.name }}</span></span>',
			link: function(scope, attr, ele, ctrl){
				scope.positionList = [];

				Position.getPositionList()
					.then(function(positions){
						scope.positionList = positions;
					});
			}
		};
}]);