'use strict';
angular.module('Quilava.controllers')
	.controller('DiscoverCtrl', ['$scope', function($scope) {
		$scope.isDiscover = function() {
			$scope.discover = {
				title: 'Discover'
			};
		};
		$scope.isGenre = function() {
			$scope.discover = {
				title: 'Genre'
			};
		};
		$scope.isDiscover();
		var Genres = Parse.Object.extend('Genres');
		var query = new Parse.Query(Genres);
		query.equalTo('public', true);
		query.find({
			success: function(results) {
				$scope.genres = results;
			}
		});

	}]);

	/*$scope.browse = {};
		$scope.browse.id = $stateParams.browseId;
		$scope.browse.loaded = false;
		$scope.browse.sections = [{
			title: 'Best New Music Video'
		}, {
			title: 'Top Music Video of The Week'
		}, {
			title: 'Top Music Video of The Month'
		}, {
			title: 'Top Music Video of All Time'
		}];
		if ($stateParams.browseId) {
			LoadingService.showLoading();
			var Browse = Parse.Object.extend("Browse");
			var query = new Parse.Query(Browse);
			query.equalTo("section", parseInt($stateParams.browseId, 10));
			query.ascending("artistOrder");
			query.find({
				success: function(results) {
					$scope.browse.music = results;
					$scope.browse.loaded = true;
					LoadingService.hideLoading();
				}
			});
		}*/