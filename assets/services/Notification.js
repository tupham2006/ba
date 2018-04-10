angular.module('ba').factory('Notification', Notification);

Notification.$inject = ['Store', 'Request', '$q'];

function Notification(Store, Request, $q){

	var service = {
		getNotificationList: getNotificationList,
	};

	var notificationList = [];

	function getNotificationList(){
		var df = $q.defer();

		notificationList = Store.notificationTable.list;

		if(notificationList.length){
			df.resolve(notificationList);

		} else {
			Request.post("/notification/getList")
				.then(function(res){

					if(!res.error){
						notificationList = res.notifications;
						Store.notificationTable.list = res.notifications;
						df.resolve(notificationList);

						df.resolve(notificationList);
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

	return service;
}