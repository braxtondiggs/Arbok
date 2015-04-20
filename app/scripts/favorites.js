'use strict';
angular.module('Quilava.controllers')
	.controller('FavoritesCtrl', ['$scope', function($scope) {
		$scope.isFavorites = function() {
			$scope.favorites = {
				title: 'Favorites'
			};
		};
		$scope.isPlaylist = function() {
			$scope.favorites = {
				title: 'Playlist'
			};
		};
		$scope.isFavorites();
	}]);