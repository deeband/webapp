(function(angular) {
  	'use strict';
  	angular.module('WebApp', ['ngSanitize']);
	angular.module('WebApp').controller('MainCtrl', ["$rootScope", "$scope", "$timeout", "UTILS", 
		function($rootScope, $scope, $timeout, UTILS){

		$scope.selectedTab;   			// Holding selected tab
		$scope.notification;  			// Holding notification data
		$scope.topButtons;	  			// Holding buttons description and links
		$scope.tabs;	 	  			// Holding tabs data
		$scope.appInitialized = false;	// Hide binding data before initlized

		/**
		 * Initialize application parameters and loading data from ajax
		 */
		$scope.initializeApp = function(){
			// Start animating loader
			UTILS.animatePageLoad(true);


			$scope.selectedTab = 0;  // Default selected tab when page finish laod
			$scope.notification = {};
			$scope.topButtons = [];
			$scope.tabs = [];


			// Load 
			UTILS.loadJsonData(function(data){
				if(data && data != null){
					// Fill controller parameters from data
					

					// Check if there is notification to display
					if(data.notification && data.notification.length > 0){
						$scope.notification={
							message: data.notification,
							style:{}
						}
					}

					// Fill quick actions (top buttons) and modify the icons and actions label
					if(data.quickActions && data.quickActions.length > 0){
						$scope.topButtons = data.quickActions;
						for(var i = 0; i < $scope.topButtons.length; i++){
							$scope.topButtons[i].icon = {
								"background-image":"url(img/"+$scope.topButtons[i].icon+".png)"
							}
							$scope.topButtons[i].actionsLabel += '<div class="drop-arrow"><img src="img/arrow.png" /></div>';
						}	
					}

					// Fill tabs 
					// Get related tabs links
					// Check if there is old stored content in local storage



				}else{
					// Ajax error
					$scope.notification = {
						message:"ERROR: Cannot reteive data from server!",
						style:{
							"color":"rgb(234, 47, 64)"
						}
					};
				}

				// Init focus tabs
				$('.top-button > .drop-down-options > li:last-child a').live('blur', function(e){
					$(this).parents(".top-button").removeClass('hovered');
				});

				// Animate page load
				UTILS.animatePageLoad(false,function(){
					$scope.appInitialized = true;
				});
			});
		}
		$scope.initializeApp();

		/**
		 * Change selected tab and initialize it's content
		 * @param  {Number} tabNumber Tab number between 1-4
		 */
		$scope.selectTab = function(tabNumber){
			if(UTILS.isNumber(tabNumber)){
				$scope.selectTab = tabNumber;
			}else{
				// Select default tab
				$scope.selectTab = 0;
			}
		}
	}]);
})(window.angular);


