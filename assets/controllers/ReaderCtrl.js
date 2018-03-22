angular.module('ba')
	.controller("ReaderCtrl",[
		"$scope",
	  "$rootScope", 
	  "Dialog",
	  "Reader",
	  "$uibModal",
	  function($scope, $rootScope, Dialog, Reader, $uibModal){
		
		$rootScope.activePage = "reader";
		$scope.filter = {
			typing: "",
			limit: 10,
			skip: 0,
			actived: 1,
			facutly_id: 0
		};

		$scope.facutlyList = CONST.FACUTLY;

		$scope.readerList = [];
		$scope.readerCount = 0;

		$scope.changePage = function(){
	  	$scope.filter.skip = $scope.filter.limit * ($scope.filter.currentPage -1);
	  	$scope.getReaderList();
	  };

		$scope.getReaderList = function(){
			Reader.getReaderList($scope.filter)
				.then(function(readers){
					$scope.readerList = readers.reader;
					$scope.readerCount = readers.count;
				})

				.catch(function(e){
					toastr.error(e);
				});
		};

		$scope.openReaderModal = function(id){
			if(id){
				for(var i in $scope.readerList){
					if($scope.readerList[i].id == id){
						$scope.readerInfo = angular.copy($scope.readerList[i]);
					}
				}

			} else {
				// default 
				$scope.readerInfo = {
					name: "",
					mobile: "",
					facutly_id: 1,
					course: moment().get('years') - 1956,
					gender: 1,
					note: "",
					actived: 1
				};
			}

			$scope.createReaderModalInstance = $uibModal.open({
				size: "md",
				scope: $scope,
				templateUrl: "/templates/reader/reader-modal.html",
				backdrop: "static"
			});

			$scope.createReaderModalInstance.result.then(function(){ }, function () {});
		};

		$scope.saveReader = function(){
			$scope.readerInfo.course = parseInt($scope.readerInfo.course) ? parseInt($scope.readerInfo.course) : 0;

			Reader.saveReader($scope.readerInfo)
				.then(function(res){
					$scope.getReaderList();
					$scope.createReaderModalInstance.close();
				})

				.catch(function(e){
					toastr.error(e);
				});
		};

		$scope.deleteReader = function (id) {
			Dialog.confirmModal("Bạn có muốn xóa bạn đọc này không?")
				.then(function (ok) {
					if(ok) {
						Reader.deleteReader({id : id})
							.then(function() {
								$scope.getReaderList();
							})
							.catch(function(e){
								toastr.error(e);
							});
					}
				});
		};


		$scope.openReaderInfo = function (id) {
			$scope.readerInfoInstance = $uibModal.open({
				size: "lg",
				scope: $scope,
				templateUrl: "/templates/modal/reader-info.html",
				controller: "ReaderInfoCtrl",
				resolve: {
					reader_id: function(){
						return id;
					}
				}
			});

			$scope.readerInfoInstance.result.then(function(){ }, function () {});
		};

	}]);
