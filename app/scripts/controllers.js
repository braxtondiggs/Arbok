'use strict';

angular.module('Quilava.controllers', [])
	.controller('AppCtrl', ['$scope', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$cordovaDialogs', '$cordovaVibration', '$cordovaToast', '$ionicLoading', '$ionicHistory', '$localStorage', '$timeout', 'lodash', 'PubNub', 'MusicService', function($scope, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $cordovaDialogs, $cordovaVibration, $cordovaToast, $ionicLoading, $ionicHistory, $localStorage, $timeout, lodash, PubNub, MusicService) {
		/*global Parse*/
		/*global ionic*/
		/*jshint camelcase: false */
		/* exported PubNub */
		$rootScope.currentUser = Parse.User.current() || {};
		$scope.vote = {
			panel:false,
			track: null
		};
		var user = $rootScope.currentUser;
		PubNub.init({
			publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',
			subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'
		});
		if (!lodash.isEmpty(user)) {
			if (!user.get('image')) {
				user.set('image', cordova.file.applicationDirectory + '/images/missingPerson.jpg');
			}
		}
		function onResume() {
			if (!lodash.isEmpty(user)) {
				if (user.get('connectedPlayer')) {
					PubNub.ngSubscribe({channel: user.get('connectedPlayer').id});
				}
			}
		}
		function onPause() {
			if (!lodash.isEmpty(user)) {
				if (user.get('connectedPlayer')) {
					PubNub.ngUnsubscribe({channel: user.get('connectedPlayer').id});
				}
			}
		}
		$scope.activateVote = function(index) {
			if (ionic.Platform.isWebView()) {
				$cordovaVibration.vibrate(100);
			}
			if ($ionicSideMenuDelegate.isOpenRight() === true) {
				$ionicSideMenuDelegate.toggleRight();
			}
			if ($scope.queue[index]) {
				var track = $scope.queue[index];
				var action = null;
				console.log(track);
				/*if (track.get('trackVotes')) {
					if (track.get('trackVotes').get('votes')) {
						action = track.get('trackVotes').get('votes');
					}
				}*/
				$scope.vote = {
					panel: true,
					track: track,
					action: action
				};
			}
			$ionicSideMenuDelegate.canDragContent(false);
		};
		$scope.onSwipeAction = function(action) {
			$scope.vote.action = action;
			var Vote = Parse.Object.extend('Vote');
			var vote = new Vote();
			var relation = $scope.vote.track.relation('trackVotes');
			vote.set('userId', user);
			vote.set('playerId', user.get('connectedPlayer'));
			vote.set('videoId', $scope.vote.track);
			vote.set('vote', action);
			vote.save(null, {
				success: function() {
					relation.add(vote);
					$scope.vote.track.save();
					PubNub.ngPublish({
						channel: user.get('connectedPlayer').id,
						message: {'type': 'vote', 'id': vote.id, 'username': user.get('name'), 'image': user.get('image')._url, 'vote': vote.get('vote')}
					});
					$cordovaToast.show('Vote successful', 'short', 'bottom')
				}
			});
			$timeout(function() {
				$scope.vote.panel = false;
				$ionicSideMenuDelegate.canDragContent(true);
			}, 2000);
		};
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
					delete $rootScope.currentUser;
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
		if (!lodash.isEmpty(user)) {
			if (user.get('connectedPlayer')) {
				PubNub.ngSubscribe({channel: user.get('connectedPlayer').id});
				$rootScope.$on(PubNub.ngMsgEv(user.get('connectedPlayer').id), function(event, payload) {
					if (payload.message.type === 'song_added') {
						MusicService.inQueue(payload.message.id, function(found) {
							if (!found) {
								var Videos = Parse.Object.extend('Videos');
								var query = new Parse.Query(Videos);
								query.equalTo('objectId', payload.message.id);
								query.limit(1);
								query.find({
									success: function(video) {
										$rootScope.queue.push(video[0]);
										$scope.$apply();
									}
								});
							}
						});
					}
					if (payload.message.type === 'song_delete') {
						for (var i = 0; i < $rootScope.queue.length; i++) {
							if ($rootScope.queue[i].id === payload.message.id) {
								$rootScope.queue.splice(i, 1);
								$scope.$apply();
							}
						}
					}
				});
			}
		}
		document.addEventListener('resume', onResume, false);
		document.addEventListener('pause', onPause, false);
	}]);