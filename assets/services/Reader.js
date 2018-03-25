angular.module('ba').factory('Reader', Reader);

Reader.$inject = ['Request', '$q', "$rootScope", "Store"];

function Reader(Request, $q, $rootScope, Store){

	var service = {
		getReaderList: getReaderList,
		saveReader: saveReader,
		getReaderByMobile: getReaderByMobile,
		deleteReader: deleteReader,
		getReaderById: getReaderById
	};

	var readerList;
	
	function getReaderList(params){
		var df = $q.defer();

		// get store list
		readerList = Store.readerTable.list;
		
		if(readerList.length){
			var result = getReaderListStore(params);
			df.resolve({
				reader: result.data,
				count: result.count
			});

		} else {
			Request.post("/reader/getList", params)
				.then(function(res){
					if(!res.error && res.reader){
						Store.readerTable.list = res.reader;
						readerList = Store.readerTable.list;
						
						var result = getReaderListStore(params);
						df.resolve({
							reader: result.data,
							count: result.count
						});
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

	function getReaderListStore(params){

		if(!params) params = {};
		var actived = params.actived;
		var skip = params.skip ? params.skip : 0;
		var limit = params.limit ? params.limit : 10;
		var facutly_id = params.facutly_id;
		var typing = params.typing ? params.typing : "";
		var filterList = [];
		var returnList = [];
		var data = angular.copy(readerList);

		// filter
		for(var i in data){

			// filter by typing
			if(data[i].deleted) data[i].remove = true;
			
			if(typing && !isNaN(typing)){
				
				if(typing != data[i].mobile) data[i].remove = true;
				
			} else if(typing){

				if(CONST.removeVN(data[i].name).indexOf(CONST.removeVN(typing)) == -1){
			 		data[i].remove = true;
				}			 
			}
			
			if(!data[i].remove && facutly_id){
				if(facutly_id != data[i].facutly_id) data[i].remove = true;
			}

			// filter by active
			if(!data[i].remove && params.actived >= 0){
				if( data[i].actived != params.actived ) data[i].remove = true;
			}

			// push to list
			if(!data[i].remove){
				filterList.push(data[i]);
			}		
		}

		// limit and skip, cut record
		for(var j = 0; j < filterList.length; j++){
			
			if(j >= skip && returnList.length < limit){
				returnList.push(filterList[j]);
			}
		}
		
		return {
			data: returnList,
			count: filterList.length
		};
	}

	function getReaderByMobile(param){
		var df = $q.defer();
		var readerInfo;
		for(var i in readerList){
			if(readerList[i].mobile == param.mobile){
				readerInfo = readerList[i];
				break;
			} 
		}
		
		df.resolve(readerInfo); 
		return df.promise;
	}

	function getReaderById(id){
		var df = $q.defer();
		var readerInfo;

		for(var i in readerList){
			if(readerList[i].id == id){
				readerInfo = readerList[i];
				break;
			} 
		}
		
		df.resolve(readerInfo); 
		return df.promise;
	}

	/**
	 * Save reader: update or create new
	 */
	function saveReader(data){
		var df = $q.defer();
		if(data && data.id){ // update
			Request.post("/reader/update", data)
			.then(function(res){

				if(res && !res.error && res.reader){
					Store.readerTable.syncData("update", res.reader);

					df.resolve();
				} else {
					df.reject(res.message);
				}
			})

			.catch(function(err){
				df.reject(err.message);
			});

		} else { // create new
			Request.post("/reader/create", data)
			.then(function(res){
				
				if(res && !res.error){
					Store.readerTable.syncData("create", res.reader);
					df.resolve();
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

	function deleteReader(params) {
		var df = $q.defer();
		Request.post("/reader/delete", params)
			.then(function (res) {
				if(res && res.reader && res.reader.id) {
					Store.readerTable.syncData("delete", res.reader.id);
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