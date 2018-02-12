angular.module('ba').factory('Department', Department);

Department.$inject = ['$rootScope', 'Request', '$q'];

function Department($rootScope, Request, $q){

	var service = {
		getDepartmentList: getDepartmentList,
		saveDepartment: saveDepartment
	};

	var departmentList = [];

	function getDepartmentList(params){
		var df = $q.defer();
		// if(departmentList.length){
		// 	df.resolve(departmentList);

		// } else {
			Request.post("/department/getList", params)
				.then(function(res){

					if(!res.error){
						departmentList = res.departments;

						df.resolve(departmentList);
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

	function saveDepartment(params){
		var df = $q.defer();
		Request.post("/department/save", params)
			.then(function(res){

				if(res && !res.error){
					// if(Array.isArray(res.data) && res.data.length){ // update
					// 	for(var i in departmentList)	{
					// 		if(departmentList[i].id == res.data[0].id){
					// 			departmentList[i] = res.data[0];
					// 		}
					// 	}
					// } else { // create new
					// 	departmentList.unshift(res.data);
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