'use strict';
angular.module('Quilava.controllers')
	.controller('PlayerSettingsCtrl', ['$scope', '$rootScope', '$ionicLoading', '$localStorage', '$cordovaInAppBrowser', function($scope, $rootScope, $ionicLoading, $localStorage, $cordovaInAppBrowser) {
		$scope.$storage = $localStorage.$default({
			initConfig: false
		});
		$scope.getStarted = function() {
			$scope.$storage.initConfig = true;
		};
		$scope.openBrowser = function(url) {
			$cordovaInAppBrowser.open(url, '_blank', {
				location: 'yes',
				clearcache: 'yes',
				toolbar: 'no'
			});
		};
	}]);