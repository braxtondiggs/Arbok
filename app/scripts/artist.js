'use strict';
angular.module('Quilava.controllers')
	.controller('ArtistCtrl', ['$scope', '$stateParams', 'UserService', function($scope, $stateParams, UserService) {
		$scope.artist = {};
		/*
		function getArtistInfo(id) {
			$http.get(
				$scope.domain + 'music/artist?e=' + id
			).success(function(data) {
				$rootScope.artist.loaded = true;
				$rootScope.artist.name = data.name;
				$rootScope.artist.slug = data.slug;
				$rootScope.artist.img = data.image;
				$rootScope.artist.convertedSlug = $scope.convertSlug(data.name, data.slug);
				$rootScope.artist.videography = data.artist_videos.videos;
				$rootScope.artist.featured = data.featured_artist_videos.videos;
				Echonest.artists.get({
				  name: $rootScope.artist.convertedSlug
				}).then(function(artist) {
				  return artist.getBiographies();
				}).then(function(artist) {
					for (var i = 0; i < artist.biographies.length; i++) {
						if (!artist.biographies[i].truncated) {
							$rootScope.artist.biographies = artist.biographies[i].text;
							break;
						}
					}
				});
			});
		}
		var param = $stateParams;
		if (param && param.artistId && param.action && $rootScope.artist.id !== param.artistId) {
			$rootScope.artist.id = param.artistId;
			$rootScope.artist.loaded = false;
			if (param.action === 'id') {
				getArtistInfo(param.artistId);
			} else if (param.action === 'slug') {
				$http.get(
					$scope.domain + 'music/search?e=' + param.artistId
				).success(function(data) {
					if (data.results.length) {
						getArtistInfo(data.results[0].id);
					}else {
						$rootScope.artist.loaded = true;
						$rootScope.artist.convertedSlug = $scope.convertSlug(null, param.artistId);
					}
				});
			}
		}*/
		$scope.artist.checkImage = function(img) {
			return UserService.checkImage(img);
		};
		$scope.artist.convertSlug = function(name, slug) {
			return UserService.convertSlug(name, slug);
		};
	}]);