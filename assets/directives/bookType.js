angular.module('ba').directive('bookTypeSelect', [
	"BookType", 
	function(BookType) {
		return {
			require: "?ngModel",
			restrict: 'E',
			scope: {
				ngModel:"=",
				editMode:"="
			},
			template: '<select class="form-control" ng-change="bookTypeChange()" ng-model="ngModel" convert-to-number><option value="" ng-hide="editMode">Tất cả</option><option value="0">Chưa phân loại</option><option ng-repeat="bookType in bookTypeList track by $index" value={{bookType.id}}>{{bookType.name}}</option></select>',
			link: function(scope, attr, ele, ctrl){


				scope.bookTypeList = [];
				BookType.getBookTypeList()
					.then(function(bookTypes){
						scope.bookTypeList = bookTypes;
							if(scope.bookTypeList.length && scope.ngModel != 0 && scope.bookTypeList.indexOf() == -1){
								var ngModelExist = false;

								for(var i in scope.bookTypeList){
									if(scope.ngModel == scope.bookTypeList[i].id) {
										ngModelExist = true;
										break;
									}
								}
								
								if(!ngModelExist) {
									scope.ngModel = scope.bookTypeList[0].id;
									scope.bookTypeChange();
								}
							}
					});

				scope.bookTypeChange = function(){
					ctrl.$setViewValue(scope.ngModel);
				};
			}
		};
}]);