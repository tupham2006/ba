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
			template: '<select ng-change="departmentChange()" class="form-control" ng-model="ngModel" convert-to-number><option value="" ng-hide="editMode">Tẩt cả các ban</option><option value="0">Chưa phân ban</option><option ng-repeat="department in departmentList track by $index" value={{department.id}}>{{department.name}}</option></select>',
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

angular.module('ba').directive('departmentHtml', [
	"Department", 
	function(Department) {
		return {
			restrict: 'E',
			scope: {
				ngModel:"=",
			},
			template: '<span ng-if="ngModel == 0"> Chưa phân ban </span> <span ng-if="ngModel"><span ng-repeat="department in departmentList" ng-if="department.id == ngModel">{{ department.name }} </span></span>',
			link: function(scope, attr, ele, ctrl){
				scope.departmentList = [];
				Department.getDepartmentList()
					.then(function(departments){
						scope.departmentList = departments;
					});
			}
		};
}]);