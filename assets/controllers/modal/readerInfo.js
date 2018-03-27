angular.module('ba')
	.controller("ReaderInfoCtrl", [
		"$scope",
		"$uibModalInstance",
		"Reader",
		"reader_id",
		"Borrow",
		"BorrowBook",
		function ($scope, $uibModalInstance, Reader, reader_id, Borrow, BorrowBook) {

			Reader.getReaderById(reader_id)
				.then(function (res) {
					$scope.readerData = res;
				});

			Borrow.getBorrowList({ limit: 100, reader_id: reader_id })
				.then(function (res) {
					$scope.borrowList = res;
				})
				.then(function(){
					BorrowBook.getBorrowBookList()
						.then(function(book_borrows){
							var i,k;
							
							// get borrow book
							for(k in $scope.borrowList){
								$scope.borrowList[k].book = [];
								for(i in book_borrows) {
									if($scope.borrowList[k].id == book_borrows[i].borrow_id){
										$scope.borrowList[k].book.push(book_borrows[i]);
									}
								}
							}
						});
				})
				.catch(function(err){
					toastr.error(err);
				});
		}
	]);