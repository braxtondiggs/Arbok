'use strict';
angular.module('Quilava.controllers')
	.controller('DiscoverCtrl', ['$scope', function($scope) {
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
		$scope.discover.newSelected = function() {
			if (!$scope.discover.new.videos) {
				var Browse = Parse.Object.extend('Browse');
				var query = new Parse.Query(Browse);
				query.equalTo('section', 0);
				query.ascending('artistOrder');
				query.find({
					success: function(results) {
						$scope.discover.new.videos = results;
						$scope.discover.new.loaded = true;
						$scope.$apply();
					}
				});
			}
		};
		$scope.discover.topSelected = function() {
			if (!$scope.discover.top.week.videos) {
				var Browse = Parse.Object.extend('Browse');
				var query = new Parse.Query(Browse);
				query.equalTo('section', 1);
				query.ascending('artistOrder');
				query.find({
					success: function(results) {
						$scope.discover.top.week.videos = results;
						$scope.discover.top.week.loaded = true;
						$scope.$apply();
					}
				});
			}
		};
		$scope.discover.playlistSelected = function() {

		};
		$scope.discover.genreSelected = function() {
			if (!$scope.discover.genres) {
				var Genres = Parse.Object.extend('Genres');
				var query = new Parse.Query(Genres);
				query.equalTo('public', true);
				query.find({
					success: function(results) {
						$scope.discover.genres = results;
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