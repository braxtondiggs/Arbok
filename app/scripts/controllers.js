'use strict';

angular.module('Quilava.controllers', [])
	.controller('BodyCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.$on('$stateChangeStart', function(event, toState) {
			$rootScope.controllerClass = toState.className;
		});
	}])
	.controller('AppCtrl', ['$scope', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$ionicPopup', '$ionicLoading', '$ionicHistory', '$localStorage', 'lodash', function($scope, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicPopup , $ionicLoading, $ionicHistory, $localStorage, lodash) {
		/*global Parse*/
		$rootScope.currentUser = Parse.User.current() || {};
		if (!lodash.isEmpty($rootScope.currentUser)) {
			if ($rootScope.currentUser.get('image')) {
				$rootScope.currentUser.image = $rootScope.currentUser.get('image')._url;
			} else {
				$rootScope.currentUser.image = '/images/missingPerson.jpg';
			}
		} else {
			$rootScope.currentUser.image = '/images/missingPerson.jpg';
		}
		$scope.vote = {};
		//Login
		$scope.login = function() {
			$scope.modal.show();
			$ionicSlideBoxDelegate.enableSlide(false);
			$scope.login.title = 'Login';
		};
		$scope.signupPage = function() {
			$scope.login.title = 'Signup';
			$ionicSlideBoxDelegate.slide(0);
		};
		$scope.loginPage = function() {
			$scope.login.title = 'Login';
			$ionicSlideBoxDelegate.slide(1);
		};
		$scope.closeLogin = function(alert) {
			$scope.modal.hide().then(function() {
				if (alert) {
					$ionicPopup.alert({
						title: 'MVPlayer',
						template: 'Welcome, you are currently logged in! You can now chat and suggest songs!'
					});
				}
			});
		};
		$scope.logout = function() {
			$ionicPopup.confirm({
				title: 'MVPlayer',
				template: 'Are you sure you want to logout?'
			}).then(function(res) {
				if (res) {
					if ($ionicSideMenuDelegate.isOpenLeft() === true) {
						$ionicSideMenuDelegate.toggleLeft();
					}
					Parse.User.logOut();
					$localStorage.$reset();
					$ionicHistory.nextViewOptions({
						historyRoot: true
					});
					$scope.vote.selectedIndex = 0;
					$rootScope.currentUser = {};
					$ionicPopup.alert({
						title: 'MVPlayer',
						template: 'You have been successfully logged out'
					});
				}
			});
		};
		$ionicModal.fromTemplateUrl('templates/modal/login.html', {
			scope: $scope,
			controller: 'LoginCtrl'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		/*$scope.domain = ENV.apiEndpoint;
		$scope.isSearch = false;
		$scope.loginData = {};
		$scope.signupData = {};
		$scope.search = {};
		$scope.vote = {};
		$scope.chats = [];
		$scope.currentUser = Parse.User.current() || null;
		$scope.room = window.localStorage['room'] || null;
		$scope.hasVoted = window.localStorage['hasVoted'] || false;
		$scope.vote.voteId = window.localStorage['voteId'] || null;
		$scope.vote.selectedIndex = window.localStorage['voteselectedIndex'] || null;
		$scope.$storage = $localStorage.$default({
			'searchHistory': []
		});
		$scope.searchHistory = $scope.$storage.searchHistory;
		$scope.$watch('hasVoted', function() {
			window.localStorage['hasVoted'] = $scope.hasVoted;
		});
		$scope.$watch('vote.voteId', function() {
			window.localStorage['voteId'] = $scope.vote.voteId;
		});
		$scope.$watch('vote.selectedIndex', function() {
			window.localStorage['voteselectedIndex'] = $scope.vote.selectedIndex;
		});
		$scope.$watch('searchHistory', function() {
			$scope.$storage.searchHistory = $scope.searchHistory;
		});
		$scope.setSearchBar = function(val) {
			$scope.isSearch = val;
			if (val) {
				$timeout(function() {
					document.getElementById('search').focus();
				}, 500);
			}
		};
		$scope.goBack = function() {
			$ionicHistory.goBack(-1);
		}
		$scope.convertSlug = function(name, slug) {
			return UserService.convertSlug(name, slug);
		};
		$scope.voteClicked = function(index) {
			if ($scope.vote.selectedIndex !== index) {
				$scope.vote.selectedIndex = index;
				socket.emit('vote:client', {
					server_id: $scope.room,
					track_id: $scope.queue_list[0].objectId,
					upVote: ($scope.vote.selectedIndex === 2) ? true : false,
					downVote: ($scope.vote.selectedIndex === 1) ? true : false,
					userId: $scope.currentUser.id,
					userName: $scope.currentUser._serverData.name,
					hasVoted: $scope.hasVoted,
					voteId: $scope.vote.voteId
				});
				$scope.hasVoted = true;
			}
		}
		$scope.findSong = function(artist, title, image) {
			$http.get(
				$scope.domain + 'music/search?v=' + artist + ' ' + title
			).success(function(data) {
				$scope.addSong(data.results[0].id, artist, title, image);
			});
		};
		$scope.firstLetters = function(str) {*/
		//return ((str)?str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase()}):'');
		/*};
		$scope.addSong = function(id, name, title, image) {
			if ($scope.currentUser && $scope.room) {
				var confirmPopup = $ionicPopup.confirm({
					title: 'MVPlayer',
					template: 'Are you sure you want add this song?'
				});
				confirmPopup.then(function(res) {
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
				});
			} else {
				var body = ($scope.currentUser) ? 'You have not connected to a MVPlayer yet.' : 'You need to be logged inorder to suggest a song',
					location = ($scope.currentUser) ? '#/app/player' : null;
				$ionicPopup.alert({
					title: 'MVPlayer - Error',
					template: body
				}).then(function(res) {
					if (location !== null) {
						window.location = location;
					}else {
						$scope.login();
					}
				});
			}
		}
		$scope.joinServer = function(id) {
			$scope.queue_list = {};
			socket.emit('user:init', {
				room: id
			}, function(confirm) {
				window.localStorage['room'] = id;
				$scope.room = id;
				if (confirm.length > 0) {
					$scope.queue_list = confirm;
					$scope.vote.upvote = confirm[0].upvoteNum;
					$scope.vote.downvote = confirm[0].downvoteNum;
				}
				$ionicPopup.alert({
					title: 'MVPlayer',
					template: 'You are now joined to this player!'
				}).then(function(res) {
					window.location = '#/app/browse';
				});
			});
			socket.emit('chat:init', {
				room: id
			}, function(confirm) {
				$scope.chats = confirm;
			});
		};
		socket.on('connect', function() {
			if ($scope.room) {
				socket.emit('user:init', {
					room: $scope.room
				}, function(confirm) {
					if (confirm.length > 0) {
						$scope.queue_list = confirm;
						$scope.vote.upvote = confirm[0].upvoteNum;
						$scope.vote.downvote = confirm[0].downvoteNum;
					}
				});
				socket.emit('chat:init', {
					room: $scope.room
				}, function(confirm) {
					$scope.chats = confirm;
				});
			}
		});
		socket.on('playlist:playingImg', function(data) {
			//$scope.player.attributes.playingImg = data;//not going to work needs to update per player
		});
		socket.on('playlist:change', function(data) {
			if (data[0].objectId !== $scope.queue_list[0].objectId) {$scope.hasVoted = false;$scope.vote.selectedIndex = 0;$scope.vote.upvote = 0;$scope.vote.downvote=0;}
			$timeout(function() {
				$scope.queue_list = data;
			}, 100);
		});
		socket.on('vote:change', function(data) {
			$scope.vote.upvote = data.upvote;
			$scope.vote.downvote = data.downvote;
			$scope.vote.voteId = data.voteId;
		});
		$scope.deleteSong = function(item) {
			$ionicPopup.confirm({
				title: 'MVPlayer',
				template: 'Are you sure you want to delete this song from the queue?'
			}).then(function(res) {
				if (res) {
					socket.emit('song:delete', {
						'track_id': item.objectId,
						'player_id': item.playerId
					});
				}
			});
		};*/
	}])
	.controller('ArtistCtrl', function() {
		/*if (!$rootScope.artist) {
			$rootScope.artist = {};
		}
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
		}
		$scope.checkImage = function(img) {
			return UserService.checkImage(img);
		};
		$scope.convertSlug = function(name, slug) {
			return UserService.convertSlug(name, slug);
		};*/
	})
	//.controller('QueueCtrl', function() {

	//})
	.controller('ChatCtrl', function() {
		/*if ($scope.room !== null) {
			$scope.chats = null;
			var Chat = Parse.Object.extend("Chat");
			var query = new Parse.Query(Chat);
			LoadingService.showLoading();
			query.equalTo("room", $scope.room);
			query.ascending("createdAt");
			$scope.loaded = false;
			query.find({
				success: function(results) {
					var result = [];
					for (var i = 0; i < results.length; i++) {
						results[i]._serverData.self = ($scope.currentUser !== null && results[i]._serverData.userId === $scope.currentUser.id) ? true : false;
						results[i]._serverData.createdAt = moment(results[i].createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
						result.push(results[i]._serverData);
					}
					$scope.chats = result;
					$ionicScrollDelegate.scrollBottom();
					LoadingService.hideLoading();
					$scope.loaded = true;
				}
			});
		} else {
			$ionicPopup.alert({
				title: 'MVPlayer',
				template: 'You need to be connect to player first to see chat messages! Click \'OK\' to goto player setup!'
			}).then(function(res) {
				if (res) {
					$window.location = '#/app/player'
				}
			});
		}
		$scope.sendChat = function(msg) {
			var title = 'MVPlayer - Error',
				body = null;
			if (msg.chatMsg !== "") {
				if ($scope.room) {
					if ($scope.currentUser) {
						var img = ($scope.currentUser._serverData.image) ? $scope.currentUser._serverData.image._url : null;
						document.getElementById('chat-input').value = '';
						socket.emit('chat', {
							'room': $scope.room,
							'from': $scope.currentUser._serverData.name,
							'userId': $scope.currentUser.id,
							'img': img,
							'body': msg.chatMsg
						});
					} else {
						body = 'You have not connected to a MVPlayer yet.';
						location = '#/app/player';
					}
				} else {
					body = 'You need to be logged inorder to suggest a song';
					location = null;
				}
				if (body !== null) {
					$ionicPopup.alert({
						title: title,
						template: body
					}).then(function(res) {
						if (location !== null){
							window.location = location;
						}else {
							$scope.login();
						}
					});
				}
			}
		}

		socket.on('chat:new', function(data) {
			data.self = (data.userId === $scope.currentUser.id) ? true : false;
			data.createdAt = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
			$scope.chats.push(data);
			$ionicScrollDelegate.scrollBottom();
		});
		$scope.scrollBottom = function() {
			$ionicScrollDelegate.scrollBottom();
		};*/
	});