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
			facutly_id: ""
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
					facutly_id: 0,
					course: moment().get('years') - 1956,
					gender: 1,
					facebook_id: "",
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
		
	}]);
