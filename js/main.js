(function(angular) {
  	'use strict';
  	angular.module('WebApp', ['ngSanitize']);
	angular.module('WebApp').controller('MainCtrl', ["$rootScope", "$scope", "$sce", "$timeout", "$window", "UTILS",
		function($rootScope, $scope, $sce, $timeout, $window, UTILS){

		$scope.selectedTab;   			// Holding selected tab
		$scope.notification;  			// Holding notification data
		$scope.topButtons;	  			// Holding buttons description and links
		$scope.tabs = {};	 	  			// Holding tabs data
		$scope.appInitialized = false;	// Hide binding data before initlized

		/**
		 * Initialize application parameters and loading data from ajax
		 */
		$scope.initializeApp = function(){
			// Start animating loader
			UTILS.animatePageLoad(true);

			$scope.notification = {};
			$scope.topButtons = [];
			$scope.tabs = {};

			// Check url hash tag
			$scope.selectedTab = UTILS.getHashTabNumber();
			UTILS.setHash($scope.selectedTab);

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
					$scope.tabs["quickReport"] = UTILS.checkStoredUrls("quickReport");
					$scope.tabs["myFolders"] = data.tabsList[1].options.url;
					$scope.tabs["myTeamFolders"] = UTILS.checkStoredUrls("myTeamFolders");
					$scope.tabs["publicFolders"] = data.tabsList[3].options.url;


				}else{
					// Ajax error
					$scope.notification = {
						message:"ERROR: Cannot reteive data from server!",
						style:{
							"color":"rgb(234, 47, 64)"
						}
					};

					$scope.tabs = { // default data for tabs
						"quickReport":{
							urls: UTILS.defaultUrlContent,
							selectedUrl: -1,
							editing: true
						},
						"myFolders":"",
						"myTeamFolders":{
							urls: UTILS.defaultUrlContent,
							selectedUrl: -1,
							editing: true
						},
						"publicFolders":""
					};
				}



				// Init focus tabs
				$('.top-button > .drop-down-options > li:last-child a').live('blur', function(e){
					$(this).parents(".top-button").removeClass('hovered');
				});

				// Init watch event for location hash
				$($window).bind('hashchange', function () {
					$scope.$apply(function(){
						$scope.selectedTab = UTILS.getHashTabNumber();
					});
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
		 * @param  {Number} tabNumber Tab number between 0-3
		 */
		$scope.selectTab = function(tabNumber){
			if(UTILS.isNumber(tabNumber)){
				if(tabNumber > 3 || tabNumber < 0)
					UTILS.setHash(tabNumber);
				else
					UTILS.setHash(0);	
			}else{
				// Select default tab
				UTILS.setHash(0);
			}
		}

		/**
		 * Get valid url. angularjs library
		 * @param  {String} url Url to check
		 * @return {String}     url if is valid URL else ''
		 */
		$scope.getUrl = function(url){
			return $sce.trustAsResourceUrl(url);
		}

		/**
		 * Open specific url in new tab
		 * @param  {String} url Url to open
		 */
		$scope.openNewTab = function(url){
			$('<a href="'+$scope.getUrl(url)+'" target="_blank"></a>')[0].click();
		}

		/**
		 * Check if url-manager urls empty
		 */
		$scope.checkUrls = function(urlsArray){
			if(urlsArray)
				return (urlsArray[0].title == "" && urlsArray[1].title == "" && urlsArray[2].title == "");
			else
				return true;
		}

		$scope.cancelEditUrls = function(action){
			switch(action){
				case "quickReport":
					$scope.tabs.quickReport.editing = false;
					$("#reportName1").val($scope.tabs.quickReport.urls[0].title);
					$("#reportURL1").val($scope.tabs.quickReport.urls[0].url);
					$("#reportName2").val($scope.tabs.quickReport.urls[1].title);
					$("#reportURL2").val($scope.tabs.quickReport.urls[1].url);
					$("#reportName3").val($scope.tabs.quickReport.urls[2].title);
					$("#reportURL3").val($scope.tabs.quickReport.urls[2].url);
				break;
				case "myTeamFolders":
					$("#reportName1").val($scope.tabs.myTeamFolders.urls[0].title);
					$("#reportURL1").val($scope.tabs.myTeamFolders.urls[0].url);
					$("#reportName2").val($scope.tabs.myTeamFolders.urls[1].title);
					$("#reportURL2").val($scope.tabs.myTeamFolders.urls[1].url);
					$("#reportName3").val($scope.tabs.myTeamFolders.urls[2].title);
					$("#reportURL3").val($scope.tabs.myTeamFolders.urls[2].url);
				break;
				default: break;
			}
		}
		$scope.saveEditUrls = function(action){
			switch(action){
				case "quickReport":
					$scope.tabs.quickReport.editing = false;
					$scope.tabs.quickReport.urls = [{
						title: $("#reportName1").val(),
						url: $("#reportURL1").val()
					},{
						title: $("#reportName2").val(),
						url: $("#reportURL2").val()
					},{
						title: $("#reportName3").val(),
						url: $("#reportURL3").val()
					}];
				break;
				case "myTeamFolders":
					$scope.tabs.myTeamFolders.editing = false;
					$scope.tabs.myTeamFolders.urls = [{
						title: $("#teamFolderName1").val(),
						url: $("#teamFolderURL1").val()
					},{
						title: $("#teamFolderName2").val(),
						url: $("#teamFolderURL2").val()
					},{
						title: $("#teamFolderName3").val(),
						url: $("#teamFolderURL3").val()
					}];
				break;
				default: break;
			}
			UTILS.saveContentInLocalStorage($scope.tabs);
		}

		$scope.toggleEditing = function(action){
			switch(action){
				case "quickReport":
					if($scope.tabs.quickReport.editing == true)
						$scope.tabs.quickReport.editing = false;
					else
						$scope.tabs.quickReport.editing = true;
				break;
				case "myTeamFolders":
					if($scope.tabs.myTeamFolders.editing == true)
						$scope.tabs.myTeamFolders.editing = false;
					else
						$scope.tabs.myTeamFolders.editing = true;
				break;
				default: break;
			}	
		}


		$scope.getUrlsNonEmpty = function(urlsArray){
			if(urlsArray){
				var tempUrls = [];
				for(var i = 0; i < urlsArray.length; i++){
					if(urlsArray[i].title != ""){
						tempUrls.push(urlsArray[i]);
					}
				}
				return tempUrls;
			}else
				return [];
		}

		$scope.$watchCollection(function(){
			// console.log("")
		});


	}]);
})(window.angular);


