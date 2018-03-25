var isOnline = true;

function request($http, $cookies, $rootScope, FileUploader, $q, blockUI){

	var token = $cookies.get('token');
	var user = $cookies.get('user');
	window.debugMode = false;

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
    	if(!data) data = {};
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
	    	if(io.socket && isOnline) {
	    		option.data.clientId = $rootScope.user ? $rootScope.user.id : 0;
	    		
	    		io.socket.request(option, function(res){
	    			if(window.debugMode){
  						console.log(option.method + " " + option.url, res);
  					}	
	    			resolve(res);
	    			blockUI.stop();
	    		});

	    	} else {
		    	$http(option)
		    		.then(function(res){
    					if(window.debugMode){
    						console.log(option.method + " " + option.url, res);
    					}	

		    			resolve(res.data);
		    			blockUI.stop();
		    		}, function(err){
			    		blockUI.stop();
		    			if(err && err.status == -1) {
		    				reject({
		    					message: "Mất kết nối. Vui lòng thử lại!"
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
		    					message: "Mất kết nối. Vui lòng thử lại!"
		    				});
		    			}

		    			if(err && err.status == 403){
		    				CONST.clearCookie();
		    			}

		    			reject(err.message);
		    		});
	    	}
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

// socket event
io.socket.on("connect", function () {
	isOnline = true;
	connectSocket();
});

io.socket.on("disconnect", function () {
	toastr.error("Mất kết nối từ máy chủ!");
	isOnline = false;
});

// when connection error
io.socket.on('error', function(){
	toastr.error("Kết nối thất bại!");
  isOnline = false;
});

// when browser trying to connect to server
io.socket.on('reconnecting', function(){
  isOnline = false;
});

// when reconnected
io.socket.on('reconnect', function(){
  connectSocket('reconnect');
});

function connectSocket(type) {
	if(!io.socket) return;

	var option = {
		method: "get",
		headers: {
      'authorization': 'Bearer ' + CONST.getCookie("token")
    },
    url: "/connectSocket"
	};

	io.socket.request(option, function(res, jwres){

		if(type == "reconnect") {
			toastr.success("Kết nối thành công!");
		}
		isOnline = true;
	});
}

angular.module('ba').factory('Request', ['$http','$cookies', "$rootScope", "FileUploader", "$q", "blockUI", request]);