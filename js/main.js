var ngScope;
(function(angular) {
  	'use strict';
  	angular.module('WebApp', ['ngSanitize']);
	angular.module('WebApp').controller('MainCtrl', ["$rootScope", "$scope", "$sce", "$timeout", "$window", "UTILS", "$filter",
		function($rootScope, $scope, $sce, $timeout, $window, UTILS, $filter){

		$scope.selectedTab;   			// Holding selected tab
		$scope.notification;  			// Holding notification data
		$scope.topButtons;	  			// Holding buttons description and links
		$scope.tabs = {};	 	  			// Holding tabs data
		$scope.appInitialized = false;	// Hide binding data before initlized
		$scope.quickReportSelectedUrl = -1;
		$scope.TeamFolderSelectedUrl = -1;
		$scope.HoldQuickReportUrl = [];
		$scope.HoldTeamFolderUrl = [];

		// For Debugging
		var appElement = document.querySelector('[ng-controller=MainCtrl]');
        ngScope = angular.element(appElement).scope();

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
					$scope.tabs["myFolders"] = {"url":data.tabsList[1].options.url};
					$scope.tabs["myTeamFolders"] = UTILS.checkStoredUrls("myTeamFolders");
					$scope.tabs["publicFolders"] = {"url":data.tabsList[3].options.url};


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
						"myFolders":{"url":""},
						"myTeamFolders":{
							urls: UTILS.defaultUrlContent,
							selectedUrl: -1,
							editing: true
						},
						"publicFolders":{"url":""}
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

				$scope.HoldQuickReportUrl = $filter('filter')($scope.tabs["quickReport"].urls, UTILS.emptyUrl);
				$scope.HoldTeamFolderUrl = $filter('filter')($scope.tabs["myTeamFolders"].urls, UTILS.emptyUrl);
				$scope.quickReportSelectedUrl = $scope.HoldQuickReportUrl[0];
				$scope.TeamFolderSelectedUrl = $scope.HoldTeamFolderUrl[0];

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
			if(url)
				return $sce.trustAsResourceUrl(url.url);
			return '';
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
					$scope.tabs.myTeamFolders.editing = false;
					$("#teamFolderName1").val($scope.tabs.myTeamFolders.urls[0].title);
					$("#teamFolderURL1").val($scope.tabs.myTeamFolders.urls[0].url);
					$("#teamFolderName2").val($scope.tabs.myTeamFolders.urls[1].title);
					$("#teamFolderURL2").val($scope.tabs.myTeamFolders.urls[1].url);
					$("#teamFolderName3").val($scope.tabs.myTeamFolders.urls[2].title);
					$("#teamFolderURL3").val($scope.tabs.myTeamFolders.urls[2].url);
				break;
				default: break;
			}
		}
		$scope.saveEditUrls = function(action){
			$scope.notification = {};
			switch(action){
				case "quickReport":

					debugger;
					function checkValidInputs1(index, callback){
						if($("#reportName"+index).val() != "" && $("#reportURL"+index).val() != ""){
							if(UTILS.isUrl($("#reportURL"+index).val())){
								$scope.tabs.quickReport.urls[index-1]	= {title:$("#reportName"+index).val(), url:$("#reportURL"+index).val()};
								callback();
							}else{
								$scope.notification = {
									message:"ERROR: Not Valid Url!",
									style:{
										"color":"rgb(234, 47, 64)"
									}
								};
							}
						}else if($("#reportName"+index).val() == "" && $("#reportURL"+index).val() == ""){
							$scope.tabs.quickReport.urls[index-1]	= {title:$("#reportName"+index).val(), url:$("#reportURL"+index).val()};
							callback();
						}else{
							$scope.notification = {
								message:"ERROR: You Must Specified (title, url).",
								style:{
									"color":"rgb(234, 47, 64)"
								}
							};
						}
					}
					checkValidInputs1(1, function(){
						checkValidInputs1(2, function(){
							checkValidInputs1(3, function(){
								$scope.tabs.quickReport.editing = false;
								$scope.HoldQuickReportUrl = $filter('filter')($scope.tabs["quickReport"].urls, UTILS.emptyUrl);
								$scope.quickReportSelectedUrl = $scope.HoldQuickReportUrl[0];
								UTILS.saveContentInLocalStorage($scope.tabs);
							});
						});
					});
				break;
				case "myTeamFolders":
					
					function checkValidInputs(index, callback){
						if($("#teamFolderName"+index).val() != "" && $("#teamFolderURL"+index).val() != ""){
							if(UTILS.isUrl($("#teamFolderURL"+index).val())){
								$scope.tabs.myTeamFolders.urls[index-1]	= {title:$("#teamFolderName"+index).val(), url:$("#teamFolderURL"+index).val()};
								callback();
							}else{
								$scope.notification = {
									message:"ERROR: Not Valid Url!",
									style:{
										"color":"rgb(234, 47, 64)"
									}
								};
							}
						}else if($("#teamFolderName"+index).val() == "" && $("#teamFolderURL"+index).val() == ""){
							$scope.tabs.myTeamFolders.urls[index-1]	= {title:$("#teamFolderName"+index).val(), url:$("#teamFolderURL"+index).val()};
							callback();
						}else{
							$scope.notification = {
								message:"ERROR: You Must Specified (title, url).",
								style:{
									"color":"rgb(234, 47, 64)"
								}
							};
						}
					}
					checkValidInputs(1, function(){
						checkValidInputs(2, function(){
							checkValidInputs(3, function(){
								$scope.tabs.myTeamFolders.editing = false;
								$scope.HoldTeamFolderUrl = $filter('filter')($scope.tabs["myTeamFolders"].urls, UTILS.emptyUrl);
								$scope.TeamFolderSelectedUrl = $scope.HoldTeamFolderUrl[0];
								UTILS.saveContentInLocalStorage($scope.tabs);
							});
						});
					});
				break;
				default: break;
			}
		}

		$scope.toggleEditing = function(action){
			switch(action){
				case "quickReport":
					if($scope.tabs.quickReport.editing == true)
						$scope.tabs.quickReport.editing = false;
					else{
						$scope.tabs.quickReport.editing = true;
						$("#reportName1").val($scope.tabs.quickReport.urls[0].title);
						$("#reportURL1").val($scope.tabs.quickReport.urls[0].url);
						$("#reportName2").val($scope.tabs.quickReport.urls[1].title);
						$("#reportURL2").val($scope.tabs.quickReport.urls[1].url);
						$("#reportName3").val($scope.tabs.quickReport.urls[2].title);
						$("#reportURL3").val($scope.tabs.quickReport.urls[2].url);
					}
				break;
				case "myTeamFolders":
					if($scope.tabs.myTeamFolders.editing == true)
						$scope.tabs.myTeamFolders.editing = false;
					else{
						$scope.tabs.myTeamFolders.editing = true;
						$("#teamFolderName1").val($scope.tabs.myTeamFolders.urls[0].title);
						$("#teamFolderURL1").val($scope.tabs.myTeamFolders.urls[0].url);
						$("#teamFolderName2").val($scope.tabs.myTeamFolders.urls[1].title);
						$("#teamFolderURL2").val($scope.tabs.myTeamFolders.urls[1].url);
						$("#teamFolderName3").val($scope.tabs.myTeamFolders.urls[2].title);
						$("#teamFolderURL3").val($scope.tabs.myTeamFolders.urls[2].url);
					}
				break;
				default: break;
			}	
		}




		$scope.quickReportSelectedUrlChange = function(newUrl){
			$timeout(function(){$scope.$apply(function(){
				$scope.quickReportSelectedUrl = newUrl;
				$scope.tabs["quickReport"].selectedUrl = newUrl;
				UTILS.saveContentInLocalStorage($scope.tabs);
			});},1);
		}
		$scope.TeamFolderSelectedUrlChange = function(newUrl){
			$timeout(function(){$scope.$apply(function(){
				$scope.TeamFolderSelectedUrl = newUrl;
				$scope.tabs["myTeamFolders"].selectedUrl = newUrl;
				UTILS.saveContentInLocalStorage($scope.tabs);
			});},1);
		}


		$scope.searchForText = function(text){
			if(text != ""){
				debugger;
				var found = false;
				for(var i = 0; i < $scope.HoldQuickReportUrl.length; i++){
					if($scope.HoldQuickReportUrl[i].title.indexOf(text) != -1){
						focusUrl('quickReport', i);
						found = true;
						break;
					}
				}
				for(var i = 0; i < $scope.HoldTeamFolderUrl.length; i++){
					if($scope.HoldTeamFolderUrl[i].title.indexOf(text) != -1){
						focusUrl('myTeamFolders', i);
						found = true;
						break;
					}
				}
				if(found == false){
					$scope.$apply(function(){
						$scope.notification = {
							message: "The searched report \""+text+"\" was not found."
						};
					});
				}else{
					$scope.notification = {};
				}
			}else{
				$scope.notification = {};
			}

			function focusUrl(urlType, urlIndex){
				if(urlType == "quickReport"){
					$('.tab-buttons > a')[0].click();
					$scope.quickReportSelectedUrl = $scope.HoldQuickReportUrl[urlIndex];
				}else if(urlType == "myTeamFolders"){
					$('.tab-buttons > a')[2].click();
					$scope.TeamFolderSelectedUrl = $scope.HoldTeamFolderUrl[urlIndex];
				}
			}
		}



	}]);
})(window.angular);


