angular.module('ba').directive('bookImg', function() {
	return {
		restrict: 'AE',
		scope: {
			ngModel: '=',
			avSize: '=?',
			avUpload: '=?',
			avFont: "=?",
		},
		templateUrl: '/templates/directive/book-img.html',
		link: function(scope) {

			if(!scope.avSize) {
				scope.avSize = "60";
			}

			switch(scope.avSize){
				case 150: //big avatar for borrow 
					scope.iconStyle = {
						"font-size": "100px",
					};
					break;
				case 100: 
					scope.iconStyle = {
						"font-size": "80px",
					};
					break;
				case 60: 
					scope.iconStyle = {
						"font-size": "35px",
					};

					break;
				case 50: 
					scope.iconStyle = {
						"font-size": "30px",
					};

					break;
				case 40: 
					scope.iconStyle = {
						"font-size": "25px",
					};
					break;
			}

			scope.$watch("ngModel", function(n, o){
				o = 0;
				if(!scope.ngModel){
					scope.imgStyle = {
						'width': scope.avSize + "px", 
						'height': scope.avSize + "px",
						"line-height": (scope.avSize - 2) + "px",
					};
				} else {
					scope.imgStyle = {
						"background": "url('" + scope.ngModel +"')",
						"background-size": "contain",
						"background-repeat": "no-repeat",
    				"background-position": "center center",
						'width': scope.avSize + "px", 
						'height': scope.avSize + "px",
					};
				}
			});
		}
	};
});