angular.module('ba').controller("BookCtrl",[
	"$scope",
  "Book", 
  "$rootScope",
  "Dialog",
  "$uibModal",
  "BookType",
  "Request",
  "Store",
  "$timeout",
  function($scope, Book, $rootScope, Dialog, $uibModal, BookType, Request, Store, $timeout){

		$rootScope.BAM.active_page = "book";
		$scope.bookList = [];
		$scope.scope = {};

  	$scope.filter = {
  		typing: "",
  		type_id: 0,
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
					// console.log("$scope.bookList", $scope.bookList);
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
      if($scope.createBookModalInstance ) {
		    $scope.createBookModalInstance.close();
      }
		};

		$scope.onSelectBook = function (book) {
			$scope.bookInfo = angular.copy(book);
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
					$scope.getBookList();
					$scope.modalClose();
				})

				.catch(function(err){
					toastr.error(err);
				});
		};

    $scope.deleteBook = function (id) {
      $scope.bookInfo = {};

      for(var i in $scope.bookList){
        if($scope.bookList[i].id == id){
          $scope.bookInfo = angular.copy($scope.bookList[i]);
        }
      }

      $scope.bookInfo.current_quantity = 0;
      $scope.bookInfo.use_quantity = 0;
      $scope.bookInfo.inventory_quantity = 0;

      Dialog.confirmModal("Bạn có muốn xóa cuốn sách này không? Lưu ý: Sách sẽ không bị xóa hoàn toàn. Hành động này chỉ có tác dụng cập nhật số lượng sách về 0.")
        .then(function (res) {
          if(res) {
            $scope.saveBook();
            $scope.getBookList();
          }
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

		if (!io.socket.bookEventReady) {
    	io.socket.bookEventReady = true;
			io.socket.on("book", function(res){
				Store.bookTable.syncData(res.action, res.data.book, res.data.syncId);
				$scope.getBookList();
			});
  	}

	}]);
