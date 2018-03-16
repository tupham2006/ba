angular.module('ba').factory('Facutly', Facutly);

Facutly.$inject = ['Store', 'Request', '$q'];

function Facutly(Store, Request, $q){

	var service = {
		getFacutlyList: getFacutlyList,
	};

	var facutlyList = [];

	function getFacutlyList(params){
		var df = $q.defer();
		facutlyList = Store.facutlyTable.list;

		if(facutlyList.length){
			df.resolve(getFacutlyListStore(params));

		} else {
			Request.post("/facutly/getList", params)
				.then(function(res){

					if(!res.error){
						facutlyList = res.facutlys;
						Store.facutlyTable.list = res.facutlys;
						df.resolve(getFacutlyListStore(params));
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


	function getFacutlyListStore(param){

		if(!param) param = {};
		var actived = param.actived >= 0 ? param.actived : 1;
		var data = angular.copy(facutlyList);

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

	return service;

}