'use strict';

angular.module('Alma.controllers', [])
	.controller('AppCtrl', ['$scope', '$rootScope', '$cordovaInAppBrowser', '$cordovaNetwork', function($scope, $rootScope, $cordovaInAppBrowser, $cordovaNetwork) {
		var options = {
      		location: 'no',
      		clearcache: 'no',
      		zoom: 'no'
    	};
    	if (AndroidFullScreen) {
    		AndroidFullScreen.immersiveMode();
    	}
    	if (WifiWizard) {
    		
    	}
  		document.addEventListener(function () {
    		$cordovaInAppBrowser.open('http://quilava.herokuapp.com/#/player/box', '_self', options).then(function() {
        		// success
     		}).catch(function(event) {
        		alert('error', event);
      		});
     	}, false);
		document.addEventListener('deviceready', function() {
			$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
		      var onlineState = networkState;
		    });
		    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
		      var offlineState = networkState;
		    });
		}, false);
		$rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event) {
			$cordovaInAppBrowser.executeScript({
      			code: 'localStorage.getItem(ngStorage-boxCode)'
    		}, function(value) {
    			$rootScope.boxCode = value;
    		});
		});
	}]);