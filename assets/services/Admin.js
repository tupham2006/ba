angular.module('ba').factory('Admin', Admin);

Admin.$inject = ['$rootScope', 'Request', '$q'];

function Admin($rootScope, Request, $q){

	var userList = [];

	var service = {
		getUserList: getUserList,
		updateUserInfo: updateUserInfo
	};

	function getUserList(params){
		var df = $q.defer();
		Request.post('/admin/getUserList', params)
			.then(function(res){
				
				if(!res.error){
					df.resolve({
						user: res.data,
						count: res.count
					});
					
				} else {
					df.reject(res.message);
				}
			})

			.catch(function(err){
				df.reject(err);
			});
			return df.promise;
	}

	function updateUserInfo(params){
		var df = $q.defer();
		Request.post("/admin/setUserRole", params)
			.then(function(res){

				if(!res.error){
					df.resolve();
				} else {
					df.reject(res.message);
				}
			})

			.catch(function(err){
				df.reject(err.message);
			});

		return df.promise;
	}

	return service;

}