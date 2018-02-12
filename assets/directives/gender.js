angular.module('ba').directive('genderHtml', function() {
	return {
		scope: {
			ngModel:"="
		},
		template: '<span ng-show="!ngModel">Chưa rõ</span><span ng-show="ngModel == 1">Nam</span><span ng-show="ngModel == 2">Nữ</span>'
	};
});

angular.module('ba').directive('genderSelect', function() {
	return {
		scope:{
			ngModel: "="
		},
		template: "<select ng-model='ngModel' class='form-control' convert-to-number><option value='0'>Chưa rõ</option><option value='1'>Nam</option><option value='2'>Nữ</option></select>"
	};
});