angular.module('ba').factory('Deposit', Deposit);

Deposit.$inject = ['Store', 'Request', '$q'];

function Deposit(Store, Request, $q){

	var service = {
		getDepositList: getDepositList,
		saveDeposit: saveDeposit
	};

	var depositList = [];

	function getDepositList(params){
		var df = $q.defer();
		depositList = Store.depositTable.list;

		if(depositList.length){
			df.resolve(getDepositListStore(params));

		} else {
			Request.post("/deposit/getList", params)
				.then(function(res){

					if(!res.error){
						depositList = res.deposits;
						Store.depositTable.list = res.deposits;
						df.resolve(getDepositListStore(params));
					} else {
						df.reject(res.message);
					}
				})

				.catch(function(err){
					df.reject(err.message);
				});
		}
		return df.promise;
	}


	function getDepositListStore(param){

		if(!param) param = {};
		var actived = param.actived >= 0 ? param.actived : 1;
		var data = angular.copy(depositList);

		var filterList = [];

		// start filter
		for(var i in data){

			// filter typing
			if(actived){
				if(data[i].actived != actived) data[i].remove = true;
			}
			
			// push to list
			if(!data[i].remove){
				filterList.push(data[i]);
			}			
		}

		return filterList;
	}

	function saveDeposit(params){

		var df = $q.defer();
		Request.post("/deposit/save", params)
			.then(function(res){
				console.log("res", res);

				if(res && !res.error && res.data){
					if(params.id && res.data.length > 0) {
						Store.depositTable.update = res.data[0];
					} else {
						Store.depositTable.create = res.data;
					}
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