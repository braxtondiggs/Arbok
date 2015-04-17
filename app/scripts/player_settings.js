'use strict';
angular.module('Quilava.controllers')
.controller('PlayerSettingsCtrl', ['$scope', '$rootScope', '$ionicLoading', '$localStorage', '$cordovaInAppBrowser', function($scope, $rootScope, $ionicLoading, $localStorage, $cordovaInAppBrowser)  {
	$scope.$storage = $localStorage.$default({
    	initConfig: false
	});
	$scope.getStarted = function() {
		$scope.$storage.initConfig = true;
	};
	$scope.openBrowser = function(url) {
		$cordovaInAppBrowser.open(url, '_blank', {location: 'yes', clearcache: 'yes', toolbar: 'no'});
	};
	$scope.toggleGroup = function(group) {
	    $scope.shownGroup = ($scope.isGroupShown(group))? null: group;
  	};
  	$scope.isGroupShown = function(group) {
    	return $scope.shownGroup === group;
  	};
}]);