'use strict';
angular.module('Quilava.controllers')
	.controller('SearchCtrl', ['$scope', '$stateParams', '$http', '$ionicLoading', '$cordovaDialogs', 'UserService', '$localStorage', 'lodash', '$state', function($scope, $stateParams, $http, $ionicLoading, $cordovaDialogs, UserService, $localStorage, lodash, $state) {
		/*jshint camelcase: false */
		$scope.search = {};
		function init() {
			$scope.search.tracks = {
				loaded: false,
				hasChanged: true,
				maxed: false,
				current_page: 0

			};
			$scope.search.artist = {
				loaded: false,
				hasChanged: true,
				maxed: false,
				current_page: 0
			};
			$scope.search.playlist =  {
				loaded: false,
				hasChanged: true,
				maxed: true,
				current_page: 0
			};
		}
		init();
		$scope.search.term = '';
		$scope.search.activeTab = 0;
		$scope.$storage = $localStorage.$default({
			'search': {
				tracks: [],
				artist: [],
				playlist: []
			}
		});
		function searchIMVDB(term, action, obj, page) {
			if (page > 1) {
				$scope.search[obj].loaded = false;
			}
			$ionicLoading.show();
			$http.get(
				'http://imvdb.com/api/v1/search/' + action + '?q=' + term + '&page=' + page
			).success(function(data) {
				if (page > 1) {
					lodash.merge($scope.search[obj], data, function(a, b) {
						if (lodash.isArray(a)) {
							return a.concat(b);
						}
					});
					$scope.search[obj].current_page = data.current_page;
					$scope.search[obj].loaded = true;
				}else {
					$scope.search[obj] = {
						results: data.results,
						current_page: data.current_page,
						total_pages: data.total_pages,
						loaded: true,
						maxed: false
					};
				}
				$ionicLoading.hide();
				saveHistory(term, obj);
			});
		}
		function searchParse(term, parseObj, obj) {
			/*global Parse*/
			$scope.search[obj].loaded = false;
			$ionicLoading.show();
			var ParseObj = Parse.Object.extend(parseObj);
			var query = new Parse.Query(ParseObj);
			query.contains('name' , term);
			query.find({
				success: function(playlists) {
					$scope.search[obj] = {
						results: playlists,
						loaded: true
					};
					$ionicLoading.hide();
					$scope.$apply();
				},
				error: function() {
					$ionicLoading.hide();
					$ionicLoading.show({
						template: 'Error connecting to server...',
						duration: 2000
					});
				}
			});
		}
		function saveHistory(term, obj) {
			var index = $scope.$storage.search[obj].indexOf(term);
			if (index === -1) {
				$scope.$storage.search[obj].unshift(term);
				if ($scope.$storage.search[obj].length >= 5) {
					$scope.$storage.search[obj] = $scope.$storage.search[obj].slice(0, 5);
				}
			}else {
				/*global ionic*/
				$scope.$storage.search[obj] = ionic.Utils.arrayMove($scope.$storage.search[obj], 0, index);
			}
		}
		function getPage(obj) {
			return ($scope.search[obj].current_page > 0)?parseInt($scope.search[obj].current_page, 10) + 1:1;
		}
		$scope.$watch('search.term', function (search) {
			if (!search || search.length <= 2) {
				init();
				return 0;
			}
			if (search === $scope.search.term) {
				if ($scope.search.activeTab === 0) {
					$scope.search.artist.hasChanged = true;
					$scope.search.playlist.hasChanged = true;
					searchIMVDB(search, 'videos', 'tracks', 1);
				}else if ($scope.search.activeTab === 1) {
					$scope.search.tracks.hasChanged = true;
					$scope.search.playlist.hasChanged = true;
					searchIMVDB(search, 'entities', 'artist', 1);
				}else if ($scope.search.activeTab === 2) {
					$scope.search.tracks.hasChanged = true;
					$scope.search.artist.hasChanged = true;
					searchParse(search, 'Playlist', 'playlist');
				}
				$scope.search.hasChanged = true;
			}
		});
		$scope.$watch('search.activeTab', function (tab) {
			if($scope.search.term !== '' && $scope.search.term !== undefined) {
				if(tab === 0 && $scope.search.tracks.hasChanged) {
					$scope.search.tracks.hasChanged = false;
					searchIMVDB($scope.search.term, 'videos', 'tracks', 1);
				}else if(tab === 1 && $scope.search.artist.hasChanged) {
					$scope.search.artist.hasChanged = false;
					searchIMVDB($scope.search.term, 'entities', 'artist', 1);
				}else if (tab === 2 && $scope.search.playlist.hasChanged) {
					$scope.search.playlist.hasChanged = false;
					searchParse($scope.search.term, 'Playlist', 'playlist');
				}
			}
		});
		$scope.loadMoreSearch = function(action, obj) {
			if (obj === 'tracks' || obj === 'artist') {
				if (parseInt($scope.search[obj].current_page, 10) !== parseInt($scope.search[obj].total_pages, 10)) {
					searchIMVDB($scope.search.term, action, obj, getPage(obj));
				}else {
					$scope.search[obj].maxed = true;
				}
			}else {
				searchParse($scope.search.term, action, obj);
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		};
		$scope.search.checkImage = function(img) {
			return UserService.checkImage(img);
		};
		$scope.search.convertSlug = function(name, slug) {
			return UserService.convertSlug(name, slug);
		};
		$scope.search.activateTab= function(tab) {
			$scope.search.activeTab = tab;
		};
		$scope.search.setSearch = function(term) {
			$scope.search.term = term;
		};
		$scope.search.submitSong = function(index) {
			if ($scope.currentUser && $scope.room) {
				$cordovaDialogs.confirm('Are you sure you want add this song?', 'MVPlayer').then(function(res) {
					if (res === 1) {
					}
				});
				console.log(index);
				/*confirmPopup.then(function(res) {
					if (res) {
						var found = false;
						for (var i = 0; i < $scope.queue_list.length; i++) {
							if ($scope.queue_list[i].IMVDBtrackId === id) {
								found = true;
							}
						}
						if (!found) {
							socket.emit('song:new', {
								server_id: $scope.room,
								track_id: id,
								userId: $scope.currentUser.id,
								userName: $scope.currentUser._serverData.name,
								trackTitle: title,
								artistName: name,
								artistImage: image
							}, function(confirm) {
								if (confirm.status === 1) {
									$ionicPopup.alert({
										title: 'MVPlayer',
										template: "Your song is now in the queue! Sit back and be the <span class=\"special\">MVP</span> you are."
									});
								} else {
									$ionicPopup.alert({
										title: 'MVPlayer',
										template: "A Serious Error Occured, Sorry Bro!"
									});
								}
							});
						} else {
							$ionicPopup.alert({
								title: 'MVPlayer - Error',
								template: 'Looks like this song is already in the Queue.'
							});
						}
					}
				});*/
			} else {
				var body = ($scope.currentUser) ? 'You have not connected to a MVPlayer yet.' : 'You need to be logged inorder to suggest a song',
					location = ($scope.currentUser) ? 'app.player' : null;
				$cordovaDialogs.alert(body, 'MVPlayer - Error').then(function() {
					if (location !== null) {
						$state.transitionTo(location);
					}else {
						//$scope.login();
					}
				});
			}
		};
	}]);