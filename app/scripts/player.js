'use strict';
angular.module('Alma.controllers')
	.controller('PlayerCtrl', ['$scope', '$rootScope', '$localStorage', '$state', '$ionicScrollDelegate', '$ionicHistory', '$ionicLoading', '$cordovaGeolocation', '$cordovaDialogs', 'LoadingService', 'PubNub', 'MusicService', 'lodash', '$timeout', function($scope, $rootScope, $localStorage, $state, $ionicScrollDelegate, $ionicHistory, $ionicLoading, $cordovaGeolocation, $cordovaDialogs, LoadingService, PubNub, MusicService, lodash, $timeout) {
		function init() {
			/*global Parse*/
			LoadingService.showLoading();
			$scope.players = {};
			$scope.loaded = false;
			$scope.lnglat = {
				lat: null,
				lng: null,
				err: false
			};
			var posOptions = {
				timeout: 10000,
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
					$scope.loaded = true;
					if ($scope.isRefresh) {
						$scope.$broadcast('scroll.refreshComplete');
					}
					LoadingService.hideLoading();
					$timeout(function() {
						$ionicLoading.hide();
					}, 1000);
				});
			$scope.$storage = $localStorage.$default({
				'hasSetupPlayer': false
			});
		}
		$scope.resetLocation = function() {
			$scope.lnglat.err = true;
			$ionicScrollDelegate.scrollBottom(true);
		};
		$scope.$watch('lnglat', function() {
			if ($scope.lnglat.lat !== null && $scope.lnglat.err !== true) {
				LoadingService.showLoading();
				var Player = Parse.Object.extend('Player');
				var query = new Parse.Query(Player);
				var point = new Parse.GeoPoint($scope.lnglat.lat, $scope.lnglat.lng);
				query.equalTo('isSetup' , true);
				query.equalTo('isActive' , true);
				query.withinMiles('latlng', point, 50);
				query.find({
					success: function(playerObjects) {
						$scope.players = playerObjects;
						LoadingService.hideLoading();
						$scope.loaded = true;
						if ($scope.isRefresh) {
							$scope.$broadcast('scroll.refreshComplete');
						}
						$scope.$apply();
						if (!$scope.$storage.hasSetupPlayer) {
							/*global EnjoyHint*/
							var enjoyhint = new EnjoyHint({});
							var ehSteps= [
								{
									selector: '.demo-player',  description: 'Here is a list of all Alma Venues in your area, click one to get started.', onBeforeStart: function() {$scope.$storage.hasSetupPlayer = true;}, right: 40
								}
							];
							enjoyhint.set(ehSteps);
							enjoyhint.run();
						}
					},
					error: function() {
						$ionicLoading.hide();
						$ionicLoading.show({
							template: 'Error connecting to server...',
							duration: 2000
						});
					}
				});
			}
		});
		$scope.findLocation = function(location) {
			/*global GeocoderJS*/
			var googleGeocoder = new GeocoderJS.createGeocoder({'provider': 'google'});
			googleGeocoder.geocode(location, function(result) {
				$scope.lnglat = {lat: result[0].latitude, lng: result[0].longitude, err: false};
				$ionicScrollDelegate.scrollTop(true);
				$scope.$apply();
			});
		};
		$scope.joinServer = function(index) {
			function getQueue(player) {
				player.relation('playerVideo').query().find({
					success: function(queue) {
						$rootScope.queue = queue;
						MusicService.getActiveSong();
						$scope.$apply();
					}
				});
			}
			$cordovaDialogs.confirm('Are you sure you want to connect to this player?', 'Alma', ['Connect', 'Cancel']).then(function(res) {
				if (res ===1) {
					var user = $scope.currentUser;
					if (!lodash.isEmpty(user)) {
						if ($scope.currentUser.get('connectedPlayer')) {
							PubNub.ngUnsubscribe({channel: $scope.currentUser.get('connectedPlayer').id});
						}
					}
					MusicService.subscribeToPlayer($scope.players[index].id);
					if (!lodash.isEmpty(user)) {
						$scope.$storage.connectedPlayer = $scope.players[index].id;
						user.set('connectedPlayer', $scope.players[index]);
						user.save(null, {
							success: function() {
								getQueue($scope.players[index]);
								$scope.$apply();
							}
						});
					} else {
						$scope.$storage.connectedPlayer = $scope.players[index].id;
						getQueue($scope.players[index]);
					}
					/*Should unsubscribe from all*/
					$cordovaDialogs.alert('You have succesfully connect to this player', 'Alma').then(function() {
						$state.transitionTo('app.dashboard');
						$ionicHistory.nextViewOptions({
							historyRoot: true
						});
					});
				}
			});
			
		};
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