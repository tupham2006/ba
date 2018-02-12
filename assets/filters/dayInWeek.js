angular.module('ba').filter('dayInWeek', function(){
	return function(date){
		return moment(date).get('days') + 1;
	};
});