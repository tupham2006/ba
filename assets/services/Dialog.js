angular.module('ba').factory('Dialog', [
	"$uibModal",
	function ($uibModal){
		return {
			confirmModal: function(title) {
				if(!title) title = "Thông báo xác nhận";

				return $uibModal.open({
					size: "sm",
					controller: "DialogCtrl",
					templateUrl: "/templates/dialog/confirm-modal.html",
					backdrop: "static",
					resolve: {
						title: function(){
							return title;
						}
					}
				}).result;
			}
		};
	}]);


