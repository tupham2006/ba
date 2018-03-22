angular.module('ba')
	.controller("ReaderInfoCtrl", [
		"$scope",
		"$uibModalInstance",
		"Reader",
		"reader_id",
		"Borrow",
		function ($scope, $uibModalInstance, Reader, reader_id, Borrow) {

			Reader.getReaderById(reader_id)
				.then(function (res) {
					$scope.readerData = res;
				});

			Borrow.getBorrowList({ limit: 100, reader_id: reader_id })
				.then(function (res) {
					$scope.borrowList = res;
				});
		}
	]);