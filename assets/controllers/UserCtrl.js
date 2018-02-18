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
	  var questionList = angular.copy(CONST.PROFILE_QUESTION);

	  $scope.getRandomQuestion = function(){
	  	$scope.question = questionList[Math.floor(Math.random()*questionList.length)];
	  };
	  $scope.getRandomQuestion();

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

			User.updateUserInfo($scope.userInfo)
				.then(function(res){
					$scope.userInfo = angular.copy(res);
					$rootScope.user = angular.copy(res);
					

					$cookies.putObject("user", res);

					toastr.success("Cập nhật thông tin thành công");
				})

				.catch(function(err){
					toastr.error(err);
				});
		};

		$scope.logout = function(){
			CONST.clearCookie();
		};

	}]);
