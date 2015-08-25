(function(angular) {
  'use strict';
	angular.module('WebApp').factory('UTILS', ["$timeout", "$http", function($timeout, $http){

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

			/**
			 * Animate top line loader and then display page content
			 * @param  {Number}   percentage Load percentage
			 * @param  {Function} callback   Function to call after Done
			 */
			animatePageLoad: function(percentage, callback){
				if(percentage){
					$('#page-loader').css('width',percentage+"%");
				}else{
					$timeout(function(){$('#page-loader').css('width',"90%");$timeout(function(){$('#page-loader').css('width',"100%");$timeout(function(){
						$('#page-loader').hide();
						$('#main-container').removeClass('transparet');
						callback();
					},400);},200);},200);
				}
			},

			/**
			 * Load data from json file with angularjs ajax request
			 * @param  {Function} callback Function to call after receiving data
			 */
			loadJsonData: function(callback){
				$http.get('http://ghyonimor.github.io/webappjquery/data/config.json').then(
					function(response) {
						if(response.status == 200 && response.data)
							callback(response.data);
						else
							callback(null);
					}, function(response) {
						callback(null);
					}
				);
			}
		}
	}])

	/**
	 * Handle Enter keydown when focusing quickaction button
	 */
	.directive('ngEnterHover', function() {
		return {
			restrict: 'A',
			link: function($scope,elem,attrs) {
				elem.bind('keydown', function(e) {
					var code = e.keyCode || e.which;
					if (code === 13) {
						$('.top-button').removeClass("hovered");
						$(elem).addClass('hovered');
						e.preventDefault();
					}
				});
			}
		}
	})
	/**
	 * Handle mouse over on other quickaction button while exploring there actions
	 */
	.directive('ngHover', function() {
		return {
			restrict: 'A',
			link: function($scope,elem,attrs) {
				$(elem).on('mouseover', function(e){
					$('.top-button').removeClass("hovered");
					$('.top-button').blur();
				});
			}
		}
	})
	/**
	 * Handle Enter keydown when focusing quickaction menu action to trigger click
	 */
	.directive('ngEnterLink', function() {
		return {
			restrict: 'A',
			link: function($scope,elem,attrs) {
				elem.bind('keydown', function(e) {
					var code = e.keyCode || e.which;
					if (code === 13) {
						$(elem)[0].click();
						e.preventDefault();
					}
				});
			}
		}
	});
})(window.angular);







