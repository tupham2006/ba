angular.module('ba').factory('Position', Position);

Position.$inject = ['$rootScope', 'Request', '$q'];

function Position($rootScope, Request, $q){

	var service = {
		getPositionList: getPositionList,
		savePosition: savePosition
	};

	// var positionList = [];

	function getPositionList(params){
		var df = $q.defer();
		// if(positionList.length){
		// 	df.resolve(positionList);

		// } else {
			Request.post("/position/getList", params)
				.then(function(res){

					if(!res.error){
						positionList = res.positions;

						df.resolve(positionList);
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

	function savePosition(params){
		var df = $q.defer();
		Request.post("/position/save", params)
			.then(function(res){

				if(res && !res.error){
					// if(Array.isArray(res.data) && res.data.length){ // update
					// 	for(var i in positionList)	{

					// 		if(positionList[i].id == res.data[0].id){
					// 			positionList[i] = res.data[0];
					// 		}
					// 	}
					// } else { // create new
					// 	positionList.unshift(res.data);
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