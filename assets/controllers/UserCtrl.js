angular.module('ba')
	.controller("UserCtrl",[
		"$scope",
	  "User", 
	  "$rootScope", 
	  "toastr",
	  "Dialog",
	  "Request",
	  "$timeout",
	  "$cookies",
	  function($scope, User, $rootScope, toastr, Dialog, Request, $timeout, $cookies){
	  $rootScope.activePage = 'profile';
	  $rootScope.userInfo = angular.copy($rootScope.user);

	  // init upload
	  $scope.image = Request.upload("/upload/uploadImage", {type: 'user'});

	  // handle upload
	  $scope.image.onSuccessItem = function(item, response){
	  	if(response && !response.error){
	  		$scope.userInfo.image = $rootScope.user.image = response.fileUrl;

	  		$cookies.putObject("user", $rootScope.user);
	  	} else {
	  		toastr.error(response.message);
	  	}
	  };
		
		$scope.updateUserInfo = function(){
			$rootScope.loading = $scope.saveLoading = true;

			User.updateUserInfo($rootScope.userInfo)
				.then(function(res){
					$scope.userInfo = res;
					$rootScope.user = angular.copy(res);

					$cookies.putObject("user", res);

					$rootScope.loading = $scope.saveLoading = false;
					toastr.success("Cập nhật thông tin thành công");
				})

				.catch(function(err){
					$rootScope.loading = $scope.saveLoading = false;
					toastr.error(err);
				});
		};

		$scope.logout = function(){
			CONST.clearCookie();
		};

	}]);
