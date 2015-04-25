'use strict';
angular.module('Quilava.controllers')
	.controller('ArtistCtrl', ['$scope', '$ionicSlideBoxDelegate', '$stateParams', '$http', 'UserService', function($scope, $ionicSlideBoxDelegate, $stateParams, $http, UserService) {
		/*jshint camelcase: false */
		$scope.artist = {
			info: {}
		};
		function getArtistInfo(id) {
			$http.get(
				'http://imvdb.com/api/v1/entity/' + id + '?include=artist_videos,featured_videos'
			).success(function(data) {
				$scope.artist.loaded = true;
				$scope.artist.info = {
					name: data.name,
					slug: data.slug,
					img: data.image,
					convertedSlug: $scope.artist.convertSlug(data.name, data.slug),
					checkedImage: $scope.artist.checkImage(data.image),
					videography: data.artist_videos.videos,
					featured: data.featured_artist_videos.videos,
					style: {'background-image' : 'url('+$scope.artist.checkImage(data.image)+')'}
				};
				$ionicSlideBoxDelegate.update();
				/*Echonest.artists.get({
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
				});*/
			});
		}
		$scope.onSlideMove = function(data){
			console.log('You have selected ' + data.index + ' tab');
		};
		var param = $stateParams;
		if (param && param.artistId && param.action) {
			$scope.artist.id = param.artistId;
			$scope.artist.loaded = false;
			if (param.action === 'id') {
				getArtistInfo(param.artistId);
			} else if (param.action === 'slug') {
				/*$http.get(
					$scope.domain + 'music/search?e=' + param.artistId ?method=slug
				).success(function(data) {
					if (data.results.length) {
						getArtistInfo(data.results[0].id);
					}else {
						$rootScope.artist.loaded = true;
						$rootScope.artist.convertedSlug = $scope.convertSlug(null, param.artistId);
					}
				});*/
			}
		}
		$scope.artist.checkImage = function(img) {
			return UserService.checkImage(img);
		};
		$scope.artist.convertSlug = function(name, slug) {
			return UserService.convertSlug(name, slug);
		};
	}]);