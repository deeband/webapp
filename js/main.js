var app = angular.module('WebApp', []);
app.controller('MainCtrl', ["$rootScope", "$scope", "$http", "$timeout", "UTILS", 
	function($rootScope, $scope, $http, $timeout, UTILS){

	$scope.selectedTab;   			// Default selected tab when page finish laod
	$scope.notification;  			// Holding notification data
	$scope.topButtons;	  			// Holding buttons description and links
	$scope.tabs;	 	  			// Holding tabs data
	$scope.appInitialized = false;	// Hide binding data before initlized

	/**
	 * Initialize application parameters and loading data from ajax
	 */
	$scope.initializeApp = function(){
		$scope.selectedTab = 0;
		$scope.notification = {message:"The data of UTF BI would be updated at 16:00 pm."};
		$scope.topButtons = [];
		$scope.tabs = [];



		UTILS.animatePageLoad(function(){
			$scope.appInitialized = true;
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