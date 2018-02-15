angular.module('ba').directive('bookSearch', ["Book", 
	function(Book) {
		return {
			restrict: 'E',
			scope: {
				ngModel: "=",
				selectBook: "=?",
				option: "=?"
			},
			templateUrl: "/templates/directive/book-search.html",
			link: function(scope, attr, ele, ctrl){
				scope.bookList = [];
				if(!scope.option) {
					scope.option = {};
				}
				scope.getBookList = function(){

					if(!scope.ngModel) {
						scope.bookList = [];
						return;
					}

					var params = {
						typing: scope.ngModel,
						limit: 10
					};

					if(scope.option.status >= 0) {
						params.status = scope.option.status;
					}

					Book.getBookList(params)
						.then(function(res){
							scope.bookList = res.books;
						});					
				};

				scope.$watch("ngModel", function(n, o){
					if(n != o){
						scope.getBookList();
					}
				});

				// check click to close
				angular.element($("body").click(function($e){
					if(!$e.target.closest("#bookSearchParent") && scope.bookList.length){ // clear book list when click outside element
						scope.bookList = [];
						scope.$apply();
					}
				}));
			}
		};
}]);