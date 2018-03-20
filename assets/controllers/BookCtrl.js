angular.module('ba').controller("BookCtrl",[
	"$scope",
  "Book", 
  "$rootScope",
  "Dialog",
  "$uibModal",
  "BookType",
  "Request",
  function($scope, Book, $rootScope, Dialog, $uibModal, BookType, Request){

		$rootScope.activePage = "book";
		$scope.bookList = [];
		$scope.scope = {};

  	$scope.filter = {
  		typing: "",
  		type_id: "0",
  		limit: 10,
  		skip: 0,
  		currentPage: 1,
  		use_quantity: 1,
  		status: 1,
  		// inventory_quantity: 0,
  	};

	  // init upload
	  $scope.image = Request.upload("/upload/uploadImage", {type: 'book'});

	  // handle upload
	  $scope.image.onSuccessItem = function(item, response){
	  	if(response && !response.error){
	  		$scope.bookInfo.image = response.fileUrl;
	  	} else {
	  		toastr.error(response.message);
	  	}
	  };

	  $scope.changePage = function(){
	  	$scope.filter.skip = $scope.filter.limit * ($scope.filter.currentPage -1);
	  	$scope.getBookList();
	  };

		$scope.getBookList = function(){
			var param = $scope.filter;
			Book.getBookList(param)
				.then(function(res){
					$scope.bookList = res.books;
					$scope.bookCount = res.count;
				})

				.catch(function(err){
					toastr.error(err);
				});
		};


		$scope.openBookModal = function(id){
			$scope.scope.isAdvance = 0;

			if(id){
				for(var i in $scope.bookList){
					if($scope.bookList[i].id == id){
						$scope.bookInfo = angular.copy($scope.bookList[i]);
					}
				}

			} else {
				$scope.bookInfo = {
					name: "",
					intro: "",
					note: "",
					author: "",
					type_id: 1,
					use_quantity: 1,
					inventory_quantity: 0,
					hot: 0
				};
			}

			$scope.createBookModalInstance = $uibModal.open({
				size: "md",
				scope: $scope,
				templateUrl: "/templates/book/book-modal.html",
				backdrop: "static"
			});

			$scope.createBookModalInstance.result.then(function(){ }, function () {});
		};

		$scope.modalClose = function(){
			 $scope.createBookModalInstance.close();
		};

		$scope.saveBook = function(){
			var params = {
				name: $scope.bookInfo.name,
				intro: $scope.bookInfo.intro,
				note: $scope.bookInfo.note,
				author: $scope.bookInfo.author,
				type_id: $scope.bookInfo.type_id,
				use_quantity: $scope.bookInfo.use_quantity,
				inventory_quantity: $scope.bookInfo.inventory_quantity,
				hot: $scope.bookInfo.hot,
				image: $scope.bookInfo.image
			};

			if($scope.scope.isAdvance && $scope.bookInfo.current_quantity >= 0){
				params.current_quantity = $scope.bookInfo.current_quantity;
			}

			if($scope.bookInfo.id) {
				params.id = $scope.bookInfo.id;
			}

			Book.saveBook(params)
				.then(function(res){

					$scope.modalClose();

					$scope.getBookList();
				})

				.catch(function(err){
					toastr.error(err);
				});
		};

		$scope.openBookType = function(){
			$scope.bookTypeList = [];
			$scope.bookTypeMode = "VIEW";
			$scope.getBookTypeList();

			$scope.bookTypeInstance = $uibModal.open({
				size: "md",
				scope: $scope,
				templateUrl: "/templates/book/book-type.html",
				backdrop: "static"
			});

			$scope.bookTypeInstance.result.then(function(){ }, function () {});
			
		};

		$scope.getBookTypeList = function(){
			$scope.bookTypeMode = "VIEW";
			BookType.getBookTypeList({ actived: 0 })
				.then(function(bookTypes){
					$scope.bookTypeList = bookTypes;
					
				})

				.catch(function(e){
					toastr.error(e);
				});
		};

		$scope.editBookType = function(id){
			$rootScope._error = {};
			$scope.bookTypeMode = "EDIT";
			
			if(id){
				for(var i in $scope.bookTypeList){
					if($scope.bookTypeList[i].id == id){
						$scope.bookTypeInfo = angular.copy($scope.bookTypeList[i]);
					}
				}
			} else {
				$scope.bookTypeInfo = {
					name: "",
					actived: 1
				};
			}
		};

		$scope.backBookType = function(){
			$scope.bookTypeMode = "VIEW";
		};

		$scope.saveBookType = function(){

	    BookType.saveBookType($scope.bookTypeInfo)
	    	.then(function(res){
	    		$scope.getBookTypeList();
	    	})

	    	.catch(function(e){
	    		toastr.error(e);
	    	});
		};
	}]);
