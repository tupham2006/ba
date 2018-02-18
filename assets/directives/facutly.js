angular.module('ba').directive('facutlySelect', [
	function() {
		return {
			restrict: 'E',
			require: "?ngModel",
			scope: {
				ngModel:"=",
				editMode:"="
			},
			template: '<select ng-change="facutlyChange()" class="form-control" ng-model="ngModel"><option value="" ng-hide="editMode">Tất cả các khoa</option><option ng-repeat="(k,v) in facutlyList" value={{k}}>{{v}}</option></select>',
			link: function(scope, attr, ele, ctrl){
				scope.facutlyList = angular.copy(CONST.FACUTLY);

				scope.facutlyChange = function(){
					ctrl.$setViewValue(scope.ngModel);
				};
			}
		};
}]);