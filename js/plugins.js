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
					$('#page-loader').css('width',"25%");
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
			},

			/**
			 * Gets hash text from location and return related tab number
			 * @return {Number} Related tab number
			 */
			getHashTabNumber : function(){
				switch (window.location.hash){
					case "#quick-reports":
						return 0;
					break;
					case "#fmy-folders":
						return 1;
					break;
					case "#my-team-folders":
						return 2;
					break;
					case "#public-folders":
						return 3;
					break;
					default:
						return 0;  // Default selected tab when page finish laod
					break;
				}
			},

			/**
			 * Set location hash by tab number
			 * @param {Number} tabNumber Related tab number
			 */
			setHash : function(tabNumber){
				// Update location hash
				var stringHash;
				switch (tabNumber){
					case 0:
						stringHash = "#quick-reports";
					break;
					case 1:
						stringHash = "#fmy-folders";
					break;
					case 2:
						stringHash = "#my-team-folders";
					break;
					case 3:
						stringHash = "#public-folders";
					break;
					default:
						stringHash = "#quick-reports";  // Default selected tab when page finish laod
					break;
				}
				$("<a href='"+stringHash+"'></a>")[0].click();
			},

			/**
			 * Check if there is data in localstorage
			 * @param  {String} tabType Tab type to request data by
			 * @return {TabObject}         
			 */
			checkStoredUrls: function(tabType){
				try{
					return JSON.parse(localStorage["WebApp"])[tabType];
				}catch(e){
					return {
						urls: this.defaultUrlContent,
						selectedUrl: -1,
						editing: true
					};
				}
			},

			defaultUrlContent:[{
				"url":"",
				"title":""
			},{
				"url":"",
				"title":""
			},{
				"url":"",
				"title":""
			}]

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
						if($(elem).hasClass('hovered')){
							$('.top-button').removeClass("hovered");
						}else{
							$('.top-button').removeClass("hovered");
							$(elem).addClass('hovered');
						}
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
	})

	/**
	 * Tab factory used to favorite urls tabs
	 */
	.factory('Tab', function(){
		return function name(){
			
		};
	});
})(window.angular);







