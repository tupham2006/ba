angular.module('ba').factory('Report', Report);

Report.$inject = ['$rootScope', 'Request', '$q'];

function Report($rootScope, Request, $q){

	var service = {
		reportBorrowTime: reportBorrowTime
	};

	function reportBorrowTime(params){
		var df = $q.defer();
		Request.post("/report/borrowTime", params)
			.then(function(res){

				if(res && !res.error){
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