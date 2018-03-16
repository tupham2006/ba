angular.module('ba').directive('facutlySelect', [
	"Facutly",
	function(Facutly) {
		return {
			restrict: 'E',
			require: "?ngModel",
			scope: {
				ngModel:"=",
				editMode:"="
			},
			template: '<select ng-change="facutlyChange()" class="form-control" ng-model="ngModel" convert-to-number><option value="" ng-hide="editMode">Tất cả các khoa</option><option value="0"> Chưa phân khoa <option ng-repeat="facutly in facutlyList" value={{facutly.id}}>{{facutly.name}}</option></select>',
			link: function(scope, attr, ele, ctrl){
				Facutly.getFacutlyList()
					.then(function(facutlys){
						scope.facutlyList = facutlys;
					});

				scope.facutlyChange = function(){
					ctrl.$setViewValue(scope.ngModel);
				};
			}
		};
}]);

angular.module('ba').directive('facutlyHtml', [
	"Facutly",
	function(Facutly) {
		return {
			restrict: 'E',
			scope: {
				ngModel:"=",
			},
			template: '<span ng-if="ngModel == 0"> Chưa phân khoa </span>	<span ng-if="ngModel">	<span ng-repeat="facutly in facutlyList" ng-if="facutly.id == ngModel">{{ facutly.name }}</span></span>',
			link: function(scope, attr, ele, ctrl){
				Facutly.getFacutlyList()
					.then(function(facutlys){
						scope.facutlyList = facutlys;
					});
			}
		};
}]);