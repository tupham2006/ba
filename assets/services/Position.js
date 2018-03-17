angular.module('ba').factory('Position', Position);

Position.$inject = ['Store', 'Request', '$q'];

function Position(Store, Request, $q){

	var service = {
		getPositionList: getPositionList,
		savePosition: savePosition
	};

	var positionList = [];

	function getPositionList(params){
		var df = $q.defer();

		positionList = Store.positionTable.list;

		if(positionList.length){
			df.resolve(getPositionListStore(params));

		} else {
			Request.post("/position/getList", params)
				.then(function(res){

					if(!res.error){
						positionList = res.positions;
						Store.positionTable.list = res.positions;
						df.resolve(getPositionListStore(params));

						df.resolve(positionList);
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

	function getPositionListStore(param){
		console.log("param", param);

		if(!param) param = {};
		var actived = param.actived;
		var data = angular.copy(positionList);

		var filterList = [];

		// start filter
		for(var i in data){

			// filter typing
			if(parseInt(actived) >= 0){
				if(data[i].actived != actived) data[i].remove = true;
			}
			
			// push to list
			if(!data[i].remove){
				filterList.push(data[i]);
			}			
		}

		return filterList;
	}

	function savePosition(params){
		var df = $q.defer();
		Request.post("/position/save", params)
			.then(function(res){

				if(res && !res.error && res.data){
					if(params.id && res.data.length > 0) {
						Store.positionTable.update = res.data[0];
					} else {
						Store.positionTable.create = res.data;
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