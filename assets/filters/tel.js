// Filter to render phone number
angular.module('ba').filter("tel", function() {
  	return function(tel){
  		if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/\D/g, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        switch (value.length) {
        	case 8:  // ####-####
        		return value.replace(/(\d{4})(\d{4})/, "$1 $2");

            case 10: // ###-###-####
            	if (value.startsWith('04') || value.startsWith('08')){
            		return value.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3");
            	}
            	else {
            		return value.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
            	}

            case 11: // ####-###-####
                return value.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");

            default:
                return value;
        }
  	};
});