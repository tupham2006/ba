angular.module('ba').factory('Dashboard', Dashboard);

Dashboard.$inject = ['Request', '$q'];

function Dashboard(Request, $q){

	var service = {
		getDashboard: getDashboard,
	};

	function getDashboard(params){
		var df = $q.defer();
		Request.post("/dashboard/getDashboard", params)
			.then(function(res){

				if(!res.error && res.data){
					df.resolve(res.data);
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