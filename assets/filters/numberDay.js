angular.module('ba').filter('numberDay', function(){
	return function(milliseconds){
		if(!milliseconds) milliseconds = 0;
		
		var returnData = "";
		var day = Math.floor(milliseconds/(24*60*60*1000));
		var mAfterDay = milliseconds%(24*60*60*1000);
		
		var hour = Math.floor(mAfterDay/(60*60*1000));
		
		if(day){
			returnData += day + " ngày ";
		}

		if(hour){
			returnData += hour + " giờ";
		}

		if(!returnData){
			returnData = "0 giờ";
		}

		return returnData;
	};
});