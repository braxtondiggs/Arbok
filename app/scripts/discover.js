'use strict';
angular.module('Alma.controllers')
	.controller('DiscoverCtrl', ['$scope', '$ionicLoading', '$cordovaDialogs', '$http', '$timeout', 'LoadingService', 'MusicService', 'cfpLoadingBar', function($scope, $ionicLoading, $cordovaDialogs, $http, $timeout, LoadingService, MusicService, cfpLoadingBar) {
		/*global Parse*/
		$scope.discover = {
			top:{
				week: {
					limit: 10,
					loaded: false,
					limitMax: false
				}
			},
			new: {
				limit: 10,
				loaded: false,
				limitMax: false
			}
		};
		function loading(isload) {
			if (isload) {
				cfpLoadingBar.start();
				cfpLoadingBar.inc();
				LoadingService.showLoading();
				$ionicLoading.show();
			}else {
				LoadingService.hideLoading();
				$ionicLoading.hide();
				cfpLoadingBar.complete();
			}
		}
		$scope.discover.queueSong = function(discoverObj) {
			$ionicLoading.show();
			$http.get(
				'http://imvdb.com/api/v1/search/videos?q=' + discoverObj.get('artistTitle')
			).success(function(data) {
				var failed = true;
				if (data.results.length) {
					for (var i = 0; i < data.results.length; i++) {
						/*jshint camelcase: false */
						if (data.results[i].song_title === discoverObj.get('artistTitle') && data.results[i].artists[0].slug === discoverObj.get('artistSlug')) {
							MusicService.storeDB(data.results[i]);
							failed = false;
							break;
						}
					}
				}
				if (failed) {
					$ionicLoading.hide();
					$cordovaDialogs.alert('A Serious Error Occured, Sorry Bro!', 'Alma');
				}
			});
		};
		$scope.discover.getSelected = function(discoverObj, section) {
			if (!discoverObj.videos) {
				loading(true);
				var Browse = Parse.Object.extend('Browse');
				var query = new Parse.Query(Browse);
				query.equalTo('section', section);
				query.ascending('artistOrder');
				query.find({
					success: function(results) {
						discoverObj.videos = results;
						discoverObj.loaded = true;
						loading(false);
						$scope.$apply();
					}
				});
			}
		};
		$scope.discover.playlistSelected = function() {

		};
		$scope.discover.genreSelected = function() {
			if (!$scope.discover.genres) {
				loading(true);
				var Genres = Parse.Object.extend('Genres');
				var query = new Parse.Query(Genres);
				query.equalTo('public', true);
				query.find({
					success: function(results) {
						$scope.discover.genres = results;
						loading(false);
						$scope.$apply();
					}
				});
			}
		};
		$scope.discover.loadMore = function(discoverObj) {
			if (discoverObj.videos.length > discoverObj.limit) {
				discoverObj.limit += 10;
			}else {
				discoverObj.limitMax = true;
			}
			$timeout(function() {
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}, 500);
		};
	}]);