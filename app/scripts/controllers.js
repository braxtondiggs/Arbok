'use strict';

angular.module('Quilava.controllers', [])
	.controller('AppCtrl', ['$scope', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$cordovaDialogs', '$ionicLoading', '$ionicHistory', '$localStorage', 'lodash', 'PubNub', function($scope, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $cordovaDialogs , $ionicLoading, $ionicHistory, $localStorage, lodash, PubNub) {
		/*global Parse*/
		/*jshint camelcase: false */
		/* exported PubNub */
		$rootScope.currentUser = Parse.User.current() || {};
		PubNub.init({
			publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',
			subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'
		});
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
					$cordovaDialogs.alert('Welcome, you are currently logged in! You can now chat and suggest songs!', 'MVPlayer');
				}
			});
		};
		$scope.logout = function() {
			$cordovaDialogs.confirm('Are you sure you want to logout?', 'MVPlayer').then(function(res) {
				if (res === 1) {
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
					$cordovaDialogs.alert('You have been successfully logged out', 'MVPlayer');
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

$rootScope.$on(PubNub.ngMsgEv('Demo_Channel'), function(event, payload) {
				// payload contains message, channel, env...
				console.log('got a message event:', payload);
			});
			$rootScope.$on(PubNub.ngPrsEv('Demo_Channel'), function(event, payload) {
				console.log('got a presence event:', payload);
			});
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