app.factory('UTILS', ["$timeout", function($timeout){

	return {
		/**
		 * Check if a given value is a plain Object
		 *
		 * @param  {*}       o Any value to be checked
		 * @return {Boolean}   true if it's an Object
		 */
		isObject: function (o) {
			var toString = Object.prototype.toString;
			return (toString.call(o) === toString.call({}));
		},

		/**
		 * Check if a given value is a Number
		 *
		 * @param  {*}       o Any value to be checked
		 * @return {Boolean}   true if it's a Number
		 */
		isNumber: function (o) {
			if(o)
				return (typeof o == 'number');
			else
				return false;
		},

		animatePageLoad: function(callback){
			$timeout(function(){$('#page-loader').css('width',"25%");$timeout(function(){$('#page-loader').css('width',"90%");$timeout(function(){$('#page-loader').css('width',"100%");$timeout(function(){
				$('#page-loader').hide();
				$('#main-container').removeClass('transparet');
				callback();
			},400);},200);},200);},200);
		}
	}
}]);