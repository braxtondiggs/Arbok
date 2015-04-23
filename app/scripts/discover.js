'use strict';
angular.module('Quilava.controllers')
	.controller('DiscoverCtrl', ['$scope', '$ionicLoading', 'LoadingService', 'cfpLoadingBar', function($scope, $ionicLoading, LoadingService, cfpLoadingBar) {
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
		$scope.discover.newSelected = function() {
			if (!$scope.discover.new.videos) {
				loading(true);
				var Browse = Parse.Object.extend('Browse');
				var query = new Parse.Query(Browse);
				query.equalTo('section', 0);
				query.ascending('artistOrder');
				query.find({
					success: function(results) {
						$scope.discover.new.videos = results;
						$scope.discover.new.loaded = true;
						loading(false);
						$scope.$apply();
					}
				});
			}
		};
		$scope.discover.topSelected = function() {
			if (!$scope.discover.top.week.videos) {
				loading(true);
				var Browse = Parse.Object.extend('Browse');
				var query = new Parse.Query(Browse);
				query.equalTo('section', 1);
				query.ascending('artistOrder');
				query.find({
					success: function(results) {
						$scope.discover.top.week.videos = results;
						$scope.discover.top.week.loaded = true;
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
		$scope.discover.loadMoreNew = function() {
			if ($scope.discover.new.videos.length > $scope.discover.new.limit) {
				$scope.discover.new.limit += 10;
			}else {
				$scope.discover.new.limitMax = true;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};
		$scope.discover.loadMoreTop = function() {
			if ($scope.discover.top.week.videos.length > $scope.discover.top.week.limit) {
				$scope.discover.top.week.limit += 10;
			}else {
				$scope.discover.top.week.limitMax = true;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};
	}]);