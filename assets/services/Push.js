angular.module('ba').factory('Push', Push);

Push.$inject = ['Request', '$q'];

function Push(Request, $q){

	var service = {
		register: register,
	};

	function register(){
		var df = $q.defer();
		var endpoint;
		navigator.serviceWorker.register('/libs/sw/sw.js')
		.then(function(registration) {
			 return registration.pushManager.getSubscription()
  			.then(function(subscription) {
					if (subscription) {
			      return subscription;
			    }

			    return registration.pushManager.subscribe({ userVisibleOnly: true });
			   });
  		})
		.then(function(subscription) {
			var params = JSON.stringify({
	      endpoint: subscription.endpoint,
	    });

		  endpoint = subscription.endpoint;
		  Request.post("/push/register", params)
		  	.then(function(res){
		  		df.resolve(res);
		  	})

		  	.catch(function(e){
		  		df.reject(e);
		  	});
		  });

		return df.promise;
	}

	return service;
}