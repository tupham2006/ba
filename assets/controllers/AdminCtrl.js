angular.module('ba')
	.controller("AdminCtrl",[
		"$scope",
	  "Admin", 
	  "$rootScope", 
	  "Dialog",
	  "Position",
	  "Department",
	  "Deposit",
	  "$uibModal",
	  "Facutly",
	  function($scope, Admin, $rootScope, Dialog, Position, Department, Deposit, $uibModal, Facutly){

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
		$scope.facutlyList = [];

		$scope.changePage = function(){
	  	$scope.filter.skip = $scope.filter.limit * ($scope.filter.currentPage -1);
	  	Admin.getUserList($scope.filter)
				.then(function(res){
					$scope.userList = res.user;
					$scope.userCount = res.count;
				})
				.catch(function(err){
					toastr.error(err);
				});
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

		var getFacutlyList = function() {
			return new Promise(function(resolve, reject){
				Facutly.getFacutlyList()
					.then(function(deposits){
						$scope.facutlyList = $scope.facutlyList;
						return resolve();
					})

					.catch(function(e){
						return reject(e);
					});
			});
		};

		$scope.getUserList = function(){
			
			$rootScope.BAM.active_page = "admin";
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

				.then(function(){
					return getFacutlyList();
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
					} else {
						Admin.getUserList($scope.filter)
							.then(function(res){
								$scope.userList = res.user;
								$scope.userCount = res.count;
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


		$scope.saveDepartment = function(actived){
			if(actived) $scope.departmentInfo = actived;
			
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

		$scope.savePosition = function(actived){
			if(actived) $scope.positionInfo = actived;
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

		$scope.saveDeposit = function(actived){
			if(actived) $scope.depositInfo = actived;
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
