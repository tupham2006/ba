angular.module('ba').directive('departmentSelect', [
	"Department", 
	function(Department) {
		return {
			require: "?ngModel",
			restrict: 'E',
			scope: {
				ngModel:"=",
				editMode: "="
			},
			template: '<select ng-change="departmentChange()" class="form-control" ng-model="ngModel" convert-to-number><option value="0" ng-hide="editMode">Tẩt cả các ban</option><option ng-repeat="department in departmentList track by $index" value={{department.id}}>{{department.name}}</option></select>',
			link: function(scope, attr, ele, ctrl){
				scope.departmentList = [];
				Department.getDepartmentList()
					.then(function(departments){
						scope.departmentList = departments;
					});

					scope.departmentChange = function(){
						ctrl.$setViewValue(scope.ngModel);
					};
			}
		};
}]);