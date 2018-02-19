angular.module('ba')
	.controller("AdminCtrl",[
		"$scope",
	  "Admin", 
	  "$rootScope", 
	  "toastr",
	  "Dialog",
	  "Position",
	  "Department",
	  "Deposit",
	  "$uibModal",
	  function($scope, Admin, $rootScope, toastr, Dialog, Position, Department, Deposit, $uibModal){

		$scope.filter = {
			typing: "",
			limit: 10,
			skip: 0,
			department_id: 0,
			position_id: 0,
			actived: 1
		};

		$scope.userList = [];
		$scope.roleList = CONST.ROLE;
		$scope.positionList = [];
		$scope.departmentList = [];
		$scope.depositList = [];
		$scope.facutlyList = CONST.FACUTLY;

		$scope.changePage = function(){
	  	$scope.filter.skip = $scope.filter.limit * ($scope.filter.currentPage -1);
	  	$scope.getUserList();
	  };
	  
		var getPositionList = function(){
			return new Promise(function(resolve, reject){
				Position.getPositionList()
					.then(function(positions){
						$scope.positionList = positions;
						return resolve();
					})

					.catch(function(e){
						return reject(e);
					});
			});
		};

		var getDepartmentList = function(){
			return new Promise(function(resolve, reject){
				Department.getDepartmentList()
					.then(function(departments){
						$scope.departmentList = departments;
						return resolve();
					})

					.catch(function(e){
						return reject(e);
					});
			});
		};

		var getDepositList = function(){
			return new Promise(function(resolve, reject){
				Deposit.getDepositList()
					.then(function(deposits){
						$scope.depositList = deposits;
						return resolve();
					})

					.catch(function(e){
						return reject(e);
					});
			});
		};

		$scope.getUserList = function(){
			
			$rootScope.activePage = "admin";
			$scope.currentPage = 1;
			// get user from server
			Admin.getUserList($scope.filter)
				.then(function(res){
					$scope.userList = res.user;
					$scope.userCount = res.count;
				})

				.then(function(){
					return getPositionList();
				})

				.then(function(){
					return getDepartmentList();
				})

				.then(function(){
					return getDepositList();
				})

				.catch(function(err){
					toastr.error(err);
				});
		};

		$scope.openUserInfoModal = function(id){
			$scope.userInfo = {};
			for(var i in $scope.userList){
				if($scope.userList[i].id == id){
					$scope.userInfo = $scope.userList[i];
				}
			}
			$scope.openUserInfoModalInstance = $uibModal.open({
				size: "md",
				scope: $scope,
				templateUrl: "/templates/admin/user-info-modal.html",
			});

			$scope.openUserInfoModalInstance.result.then(function(){ }, function () {});
		};

		$scope.setUserRole = function(userId, role){
			var params = {
				user_id: userId,
				role: role
			};

			Dialog.confirmModal("Bạn có muốn thay đổi quyền của thành viên này không?")
				.then(function(action){
					if(action){
						Admin.updateUserInfo(params)
							.then(function(res){
								toastr.success("Thay đổi chức vụ thành công!");
							})

							.catch(function(err){
								toastr.error(err);
							});
					}
				});
		};

		$scope.openPositionModal = function(){
			$scope.positionInfo = {
				name: "",
			};
			
			$scope.openPositionModalInstance = $uibModal.open({
				size: "md",
				scope: $scope,
				templateUrl: "/templates/admin/position-modal.html",
			});

			$scope.openPositionModalInstance.result.then(function(){ }, function () {});
		};

		$scope.openDepartmentModal = function(){
			$scope.departmentInfo = {
				name: "",
			};
			
			$scope.openDepartmentModalInstance = $uibModal.open({
				size: "md",
				scope: $scope,
				templateUrl: "/templates/admin/department-modal.html",
			});

			$scope.openDepartmentModalInstance.result.then(function(){ }, function () {});
		};

		$scope.openDepositModal = function(){
			$scope.depositInfo = {
				name: "",
			};
			
			$scope.openDepositModalInstance = $uibModal.open({
				size: "md",
				scope: $scope,
				templateUrl: "/templates/admin/deposit-modal.html",
			});

			$scope.openDepositModalInstance.result.then(function(){ }, function () {});
		};


		$scope.saveDepartment = function(data){
			if(data){
				$scope.departmentInfo = data;
			}
			Department.saveDepartment($scope.departmentInfo)
				.then(function(){
					getDepartmentList();
					if($scope.openDepartmentModalInstance){
						$scope.openDepartmentModalInstance.close();
					}
					toastr.success("Cập nhật thành công");
				})

				.catch(function(err){
					toastr.error(err);
				});
		};

		$scope.savePosition = function(data){
			if(data){
				$scope.positionInfo = data;
			}

			Position.savePosition($scope.positionInfo)
				.then(function(){
					getPositionList();
					if($scope.openPositionModalInstance){
						$scope.openPositionModalInstance.close();
					}
					toastr.success("Cập nhật thành công");
				})

				.catch(function(err){
					toastr.error(err);
				});
		};

		$scope.saveDeposit = function(data){
			if(data){
				$scope.depositInfo = data;
			}

			Deposit.saveDeposit($scope.depositInfo)
				.then(function(){
					getDepositList();
					if($scope.openDepositModalInstance){
						$scope.openDepositModalInstance.close();
					}
					toastr.success("Cập nhật thành công");
				})

				.catch(function(err){
					toastr.error(err);
				});
		};
		
	}]);
