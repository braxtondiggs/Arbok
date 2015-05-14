'use strict';
angular.module('Alma.controllers')
	.controller('ArtistCtrl', ['$scope', '$stateParams', '$http', 'UserService', 'MusicService', '$ionicLoading', '$cordovaDialogs', '$ionicHistory', 'Echonest', 'lodash', 'LoadingService', function($scope, $stateParams, $http, UserService, MusicService, $ionicLoading, $cordovaDialogs, $ionicHistory, Echonest, lodash, LoadingService) {
		/*jshint camelcase: false */
		$scope.artist = {
			info: {}
		};
		$ionicLoading.show();
		function getArtistInfo(id) {
			$http.get(
				'http://imvdb.com/api/v1/entity/' + id + '?include=artist_videos,featured_videos'
			).success(function(data) {
				$ionicLoading.hide();
				$scope.artist.loaded = true;
				$scope.artist.info = {
					id: data.discogs_id,
					name: data.name,
					slug: data.slug,
					img: data.image,
					convertedSlug: $scope.artist.convertSlug(data.name, data.slug),
					artistStyles: ($scope.artist.convertSlug(data.name, data.slug).indexOf('logo_missing.png') > -1)?'emptyArtist':'',
					checkedImage: $scope.artist.checkImage(data.image),
					videography: data.artist_videos.videos,
					featured: data.featured_artist_videos.videos,
					style: {'background-image' : 'url('+$scope.artist.checkImage(data.image)+')'},
					bio: null,
					bioLoaded: false,
					related: null,
					relatedLoaded: false
				};
			});
		}
		var param = $stateParams;
		if (param && param.artistId && param.action) {
			$scope.artist.id = param.artistId;
			$scope.artist.loaded = false;
			if (param.action === 'id') {
				getArtistInfo(param.artistId);
			} else if (param.action === 'slug') {
				$http.get(
					'http://imvdb.com/api/v1/search/entities?q=' + param.artistId
				).success(function(data) {
					if (data.results.length) {
						for (var i = 0; i < data.results.length; i++) {
							if (data.results[i].slug === param.artistId) {
								getArtistInfo(data.results[i].id);
								break;
							}
						}
					}else {
						$cordovaDialogs.alert('We are having trouble getting this artists information right now. Our data is constantly changing, so check back later', 'Alma - Error').then(function() {
							$ionicHistory.goBack(-1);
						});
					}
				});
			}
		}
		$scope.queueSong = function(index, type) {
			MusicService.storeDB($scope.artist.info[type][index]);
		};
		$scope.artist.checkImage = function(img) {
			return UserService.checkImage(img);
		};
		$scope.artist.convertSlug = function(name, slug) {
			return UserService.convertSlug(name, slug);
		};
		$scope.artist.getBio = function() {
			if ($scope.artist.info.bio === null) {
				Echonest.artists.get({
					name: $scope.artist.info.convertedSlug
				}).then(function(artist) {
					console.log(artist);
					if (!lodash.isEmpty(artist)) {
						return artist.getBiographies();
					}else {
						$scope.artist.info.bioLoaded = true;
						return false;
					}
				}).then(function(artist) {
					if(artist) {
						for (var i = 0; i < artist.biographies.length; i++) {
							if (!artist.biographies[i].truncated) {
								$scope.artist.info.bio = artist.biographies[i].text;
								break;
							}
						}
						$scope.artist.info.bioLoaded = true;
					}
				});
			}
		};
		$scope.artist.getRelated = function() {
			if ($scope.artist.info.related === null) {
				LoadingService.showLoading();
				Echonest.artists.get({
					name: $scope.artist.info.convertedSlug
				}).then(function(artist) {
					if (!lodash.isEmpty(artist)) {
						$http.get(
							'http://developer.echonest.com/api/v4/artist/similar?api_key=0NPSO7NBLICGX3CWQ&id='+artist.id+'&format=json&results=5&start=0'
						).success(function(data) {
							LoadingService.hideLoading();
							$scope.artist.info.related = data.response.artists;
							for (var i = 0; i < $scope.artist.info.related.length; i++) {
								$scope.artist.info.related[i].slug = $scope.artist.toSlug($scope.artist.info.related[i].name);
							}
							$scope.artist.info.relatedLoaded = true;
						});
					}else {
						LoadingService.hideLoading();
						$scope.artist.info.relatedLoaded = true;
					}
				});
			}
		};
		$scope.artist.toSlug = function(artist) {
			return artist.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
		};
	}]);