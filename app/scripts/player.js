'use strict';
angular.module('Quilava.controllers')
	.controller('PlayerCtrl', ['$scope', '$rootScope', '$localStorage', '$ionicLoading', '$ionicScrollDelegate', '$cordovaGeolocation', 'LoadingService', 'cfpLoadingBar', function($scope, $rootScope, $localStorage, $ionicLoading, $ionicScrollDelegate, $cordovaGeolocation, LoadingService, cfpLoadingBar) {
		function init() {
			/*global Parse*/
			LoadingService.showLoading();
			cfpLoadingBar.start();
			cfpLoadingBar.inc();
			$scope.players = {};
			$scope.loaded = false;
			$scope.lnglat = {
				lat: null,
				lng: null,
				err: false
			};
			var posOptions = {
				timeout: 2000,
				enableHighAccuracy: false
			};
			$cordovaGeolocation
				.getCurrentPosition(posOptions)
				.then(function(position) {
					$scope.lnglat = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
						err: false
					};
				}, function() {
					$scope.lnglat.err = true;
					LoadingService.hideLoading();
					cfpLoadingBar.complete();
					$scope.loaded = true;
				});
		}
		$scope.resetLocation = function() {
			$scope.lnglat.err = true;
			$ionicScrollDelegate.scrollBottom(true);
		};
		$scope.$watch('lnglat', function() {
			if ($scope.lnglat.lat !== null && $scope.lnglat.err !== true) {
				$ionicLoading.show();
				var Player = Parse.Object.extend('Player');
				var query = new Parse.Query(Player);
				var point = new Parse.GeoPoint($scope.lnglat.lat, $scope.lnglat.lng);
				query.equalTo('isSetup' , true);
				query.withinMiles('latlng', point, 50);
				query.find({
					success: function(playerObjects) {
						$scope.players = playerObjects;
						LoadingService.hideLoading();
						$ionicLoading.hide();
						cfpLoadingBar.complete();
						$scope.loaded = true;
						if ($scope.isRefresh) {
							$scope.$broadcast('scroll.refreshComplete');
						}
						$scope.$apply();

					},
					error: function() {
						$ionicLoading.show({
							template: 'Error connecting to server...',
							duration: 2000
						});
					}
				});
			}
		});
		$scope.getDistance = function(lat1, lon1, lat2, lon2, unit) {
			var radlat1 = Math.PI * lat1 / 180,
				radlat2 = Math.PI * lat2 / 180,
				theta = lon1 - lon2,
				radtheta = Math.PI * theta / 180,
				dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			dist = Math.acos(dist);
			dist = dist * 180 / Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit === 'K') {
				dist = dist * 1.609344;
			}
			if (unit === 'N') {
				dist = dist * 0.8684;
			}
			return Math.round(dist * 100) / 100;
		};
		$scope.doRefresh = function() {
			init();
			$scope.isRefresh = true;
		};
		$scope.isRefresh = false;
		init();
	}]);

/*
		$scope.subscribe = function() {
			PubNub.ngSubscribe({ channel: 'Demo_Channel' });
			$rootScope.$on(PubNub.ngMsgEv('Demo_Channel'), function(event, payload) {
				// payload contains message, channel, env...
				console.log('got a message event:', payload);
			});
			$rootScope.$on(PubNub.ngPrsEv('Demo_Channel'), function(event, payload) {
				console.log('got a presence event:', payload);
			});
		};*/