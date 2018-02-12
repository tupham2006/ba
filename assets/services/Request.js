function request($http, $cookies, $rootScope, FileUploader, $q, blockUI){

	var token = $cookies.get('token');
	var user = $cookies.get('user');
	window.debugMode = true;

	if(!token || !user){
	CONST.clearCookie();
	}

	try{
		$rootScope.user = JSON.parse(user);
	} catch(e){

	}

	return {
		headers: {
      'Content-Type': 'application-json',
      'authorization': 'Bearer ' + token
    },

    post: function(url, data){
    	blockUI.start();
    	var option = {
    		method: "POST",
    		url: url,
    		data: data,
    		headers: this.headers
    	};

    	if(window.debugMode) {
    		console.log(option.method + " " + option.url, option);
    	}

	    return new Promise(function(resolve, reject){
	    	$http(option)
	    		.then(function(res){

	    			setTimeout(function () {
    					
    					if(window.debugMode){
    						console.log(option.method + " " + option.url, res);
    					}	

		    			resolve(res.data);
		    			blockUI.stop();
	    			}, 200);
	    		}, function(err){
		    		blockUI.stop();
	    			if(err && err.status == -1) {
	    				reject({
	    					message: "Mất kết nối mạng. Vui lòng thử lại!"
	    				});
	    			}

	    			if(err && err.status == 403){
	    				CONST.clearCookie();
	    			}

	    			reject(err.message);
	    		})

	    		.catch(function(err){
	    			blockUI.stop();
	    			if(err && err.status == -1) {
	    				reject({
	    					message: "Mất kết nối mạng. Vui lòng thử lại!"
	    				});
	    			}

	    			if(err && err.status == 403){
	    				CONST.clearCookie();
	    			}

	    			reject(err.message);
	    		});
	    });
    },

    /*
    		Upload file
     */
    upload: function(url, data) {

    	var newFile = new FileUploader({
		  	url: url,
		  	autoUpload: true,
		  	formData: [data],
		  	headers: {
		  		'authorization': 'Bearer ' + token
		  	}
		  });

    	return newFile;
    }
	};
}

angular.module('ba').factory('Request', ['$http','$cookies', "$rootScope", "FileUploader", "$q", "blockUI", request]);