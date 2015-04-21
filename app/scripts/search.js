'use strict';
angular.module('Quilava.controllers')
	.controller('SearchCtrl', ['$scope', '$rootScope', '$stateParams', '$http', '$ionicLoading', 'UserService', '$localStorage', function($scope, $rootScope, $stateParams, $http, $ionicLoading, UserService, $localStorage) {
		function init() {
			$rootScope.search = {
				tracks: {
					loaded: false,
					hasChanged: true,
					maxed: false
				},
				artist: {
					loaded: false,
					hasChanged: true,
					maxed: false
				},
				playlist: {
					loaded: false,
					hasChanged: true,
					maxed: false
				}
			};
		}
		init();
		$scope.searchTerm = '';
		$scope.searchActiveTab = 0;
		$scope.$storage = $localStorage.$default({
			'search': {
				tracks: [],
				artist: [],
				playlist: []
			}
		});
		function searchIMVDB(term, action, obj) {
			$rootScope.search[obj].loaded = false;
			$http.get(
				'http://imvdb.com/api/v1/search/' + action + '?q=' + term
			).success(function(data) {
				$rootScope.search[obj] = {
					results: data.results,
					loaded: true
				};
				saveHistory(term, obj);
			});
		}
		function searchParse(term, parseObj, obj) {
			/*global Parse*/
			$rootScope.search[obj].loaded = false;
			var ParseObj = Parse.Object.extend(parseObj);
			var query = new Parse.Query(ParseObj);
			query.contains('name' , term);
			query.find({
				success: function(playlists) {
					$rootScope.search[obj] = {
						results: playlists,
						loaded: true
					};
					$scope.$apply();
				},
				error: function() {
					$ionicLoading.show({
						template: 'Error connecting to server...',
						duration: 2000
					});
				}
			});
		}
		function saveHistory(term, obj) {
			if ($scope.$storage.search[obj].indexOf(term) === -1) {
				$scope.$storage.search[obj].unshift(term);
				if ($scope.$storage.search[obj].length >= 5) {
					$scope.$storage.search[obj] = $scope.$storage.search[obj].slice(0, 5);
				}
			}
		}
		$scope.$watch('searchTerm', function (search) {
			if (!search || search.length <= 2) {
				init();
				return 0;
			}
			if (search === $scope.searchTerm) {
				if ($scope.searchActiveTab === 0) {
					$scope.search.artist.hasChanged = true;
					$scope.search.playlist.hasChanged = true;
					searchIMVDB(search, 'videos', 'tracks');
				}else if ($scope.searchActiveTab === 1) {
					$scope.search.tracks.hasChanged = true;
					$scope.search.playlist.hasChanged = true;
					searchIMVDB(search, 'entities', 'artist');
				}else if ($scope.searchActiveTab === 2) {
					$scope.search.tracks.hasChanged = true;
					$scope.search.artist.hasChanged = true;
					searchParse(search, 'Playlist', 'playlist');
				}
				$scope.search.hasChanged = true;
				$rootScope.searchTerm = $scope.searchTerm;
			}
		});
		$scope.$watch('searchActiveTab', function (tab) {
			if($rootScope.searchTerm !== '' && $rootScope.searchTerm !== undefined) {
				if(tab === 0 && $scope.search.tracks.hasChanged) {
					$rootScope.search.tracks.hasChanged = false;
					searchIMVDB($rootScope.searchTerm, 'videos', 'tracks');
				}else if(tab === 1 && $scope.search.artist.hasChanged) {
					$rootScope.search.artist.hasChanged = false;
					searchIMVDB($rootScope.searchTerm, 'entities', 'artist');
				}else if (tab === 2 && $scope.search.playlist.hasChanged) {
					$rootScope.search.playlist.hasChanged = false;
					searchParse($rootScope.searchTerm, 'Playlist', 'playlist');
				}
			}
		});
		$scope.loadMoreSearch = function(action, obj) {
			/*if (obj === 'tracks' || obj === 'artist') {
				searchIMVDB($scope.searchTerm, action, obj);
			}else {
				searchParse($scope.searchTerm, action, obj);
			}*/
			//console.log(action, obj);
			console.log(action, obj);
		};
		$scope.search.checkImage = function(img) {
			return UserService.checkImage(img);
		};
		$scope.search.convertSlug = function(name, slug) {
			return UserService.convertSlug(name, slug);
		};
		$scope.activateTab= function(tab) {
			$scope.searchActiveTab = tab;
		};
	}]);