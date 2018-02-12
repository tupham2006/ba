angular.module('ba').factory('Deposit', Deposit);

Deposit.$inject = ['$rootScope', 'Request', '$q'];

function Deposit($rootScope, Request, $q){

	var service = {
		getDepositList: getDepositList,
		saveDeposit: saveDeposit
	};

	var depositList = [];

	function getDepositList(params){
		var df = $q.defer();
		// if(depositList.length){
		// 	df.resolve(depositList);

		// } else {
			Request.post("/deposit/getList", params)
				.then(function(res){

					if(!res.error){
						depositList = res.deposits;

						df.resolve(depositList);
					} else {
						df.reject(res.message);
					}
				})

				.catch(function(err){
					df.reject(err.message);
				});
		// }
		return df.promise;
	}

	function saveDeposit(params){
		var df = $q.defer();
		Request.post("/deposit/save", params)
			.then(function(res){

				if(res && !res.error){
					// if(Array.isArray(res.data) && res.data.length){ // update
					// 	for(var i in depositList)	{
					// 		if(depositList[i].id == res.data[0].id){
					// 			depositList[i] = res.data[0];
					// 		}
					// 	}
					// } else { // create new
					// 	depositList.unshift(res.data);
					// }

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