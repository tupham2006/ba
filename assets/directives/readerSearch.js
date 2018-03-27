angular.module('ba').directive('readerSearch', ["Reader", 
	function(Reader) {
		return {
			restrict: 'E',
			scope: {
				ngModel: "=",
				selectReader: "=?",
				option: "=?"
			},
			templateUrl: "/templates/directive/reader-search.html",
			link: function(scope, attr, ele, ctrl){
				scope.readerList = [];
				if(!scope.option) {
					scope.option = {};
				}
				scope.getReaderList = function(){

					if(!scope.ngModel) {
						scope.readerList = [];
						return;
					}

					var params = {
						typing: scope.ngModel,
						limit: 10,
						actived: 1
					};

					Reader.getReaderList(params)
						.then(function(res){
							scope.readerList = res.reader;
						});					
				};

				scope.$watch("ngModel", function(n, o){
					if(n != o){
						scope.getReaderList();
					}
				});

				// check click to close
				angular.element($("body").click(function($e){
					scope.readerList = [];
					scope.$apply();
				}));
			}
		};
}]);