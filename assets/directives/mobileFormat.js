angular.module("ba").directive("mobileFormat", function () {
	return {
		require: "?ngModel",
		scope: {
			ngModel: "="
		},
		link: function(scope, ele, attr, ctrl){
			
			var option = {
				mask: "9999 999 999[9]" ,
				skipOptionalPartCharacter: " ",
				greedy : false 
			};

			$(ele).inputmask(option);
			$(ele).change(function(){
				scope.ngModel = $(ele).val().replace(/[^0-9]/g, "");
				ctrl.$setViewValue(scope.ngModel);
				scope.$apply();
			});
		}
	};
});