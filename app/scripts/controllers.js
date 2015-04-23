'use strict';

angular.module('Quilava.controllers', [])
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
/*
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
	}]);