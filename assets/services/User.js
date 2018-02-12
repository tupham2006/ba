angular.module('ba').factory('User', User);

User.$inject = ['$rootScope', 'Request', '$q'];

function User($rootScope, Request, $q){

	var service = {
		updateUserInfo: updateUserInfo
	};

	function updateUserInfo(params){
		var df = $q.defer();
		Request.post("/user/updateUserInfo", params)
			.then(function(res){

				if(res && !res.error){
					df.resolve(res.user);
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