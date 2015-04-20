'use strict';
angular.module('Quilava.controllers')
	.controller('DiscoverCtrl', ['$scope', function($scope) {
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
		var Browse = Parse.Object.extend('Browse');
		var query = new Parse.Query(Browse);
		query.equalTo('section', 0);
		query.ascending('artistOrder');
		query.find({
			success: function(results) {
				$scope.discover.new.videos = results;
				$scope.discover.new.loaded = true;
			}
		});
		var Browse = Parse.Object.extend('Browse');
		query = new Parse.Query(Browse);
		query.equalTo('section', 1);
		query.ascending('artistOrder');
		query.find({
			success: function(results) {
				$scope.discover.top.week.videos = results;
				$scope.discover.top.week.loaded = true;
			}
		});
		var Genres = Parse.Object.extend('Genres');
		query = new Parse.Query(Genres);
		query.equalTo('public', true);
		query.find({
			success: function(results) {
				$scope.discover.genres = results;
			}
		});
		$scope.loadMoreNew = function() {
			if ($scope.discover.new.videos.length > $scope.discover.new.limit) {
				$scope.discover.new.limit += 10;
			}else {
				$scope.discover.new.limitMax = true;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};
		$scope.loadMoreTop = function() {
			if ($scope.discover.top.week.videos.length > $scope.discover.top.week.limit) {
				$scope.discover.top.week.limit += 10;
			}else {
				$scope.discover.top.week.limitMax = true;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};
	}]);