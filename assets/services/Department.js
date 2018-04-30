angular.module('ba').factory('Department', Department);

Department.$inject = ['Store', 'Request', '$q'];

function Department(Store, Request, $q){

	var service = {
		getDepartmentList: getDepartmentList,
		saveDepartment: saveDepartment
	};

	var departmentList = [];

	function getDepartmentList(params){
		var df = $q.defer();
		departmentList = Store.departmentTable.list;

		if(departmentList.length){
			df.resolve(getDepartmentListStore(params));

		} else {
			Request.post("/department/getList", params)
				.then(function(res){

					if(!res.error){
						departmentList = res.departments;
						Store.departmentTable.list = res.departments;
						df.resolve(getDepartmentListStore(params));
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

	function getDepartmentListStore(param){

		if(!param) param = {};
		var actived = param.actived;
		var data = angular.copy(departmentList);

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


	function saveDepartment(params){
		var df = $q.defer();
		Request.post("/department/save", params)
			.then(function(res){

				if(res && !res.error && res.data){
					if(params.id && res.data.length > 0) {
						Store.departmentTable.update = res.data[0];
					} else {
						Store.departmentTable.create = res.data;
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