'use strict';

angular.module('Quilava.controllers', [])
	.controller('AppCtrl', ['$scope', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$cordovaDialogs', '$cordovaVibration', '$ionicLoading', '$ionicHistory', '$localStorage', 'lodash', 'PubNub', function($scope, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $cordovaDialogs, $cordovaVibration, $ionicLoading, $ionicHistory, $localStorage, lodash, PubNub) {
		/*global Parse*/
		/*global ionic*/
		/*jshint camelcase: false */
		/* exported PubNub */
		$rootScope.currentUser = Parse.User.current() || {};$scope.showVotePanel = false;
		PubNub.init({
			publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',
			subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'
		});
		if (Parse.User.current()) {
			if (!$rootScope.currentUser.get('image')) {
				$rootScope.currentUser.set('image', cordova.file.applicationDirectory + '/images/missingPerson.jpg');
			}
		}
		function onResume() {
			if ($rootScope.currentUser) {
				if ($rootScope.currentUser.get('connectedPlayer')) {
					PubNub.ngSubscribe({channel: $rootScope.currentUser.get('connectedPlayer').id});
				}
			}
		}
		function onPause() {
			if ($rootScope.currentUser) {
				if ($rootScope.currentUser.get('connectedPlayer')) {
					PubNub.ngUnsubscribe({channel: $rootScope.currentUser.get('connectedPlayer').id});
				}
			}
		}
		$scope.activateVote = function(index) {
			console.log(index);
			if (ionic.Platform.isWebView()) {
				$cordovaVibration.vibrate(100);
			}
			if ($ionicSideMenuDelegate.isOpenRight() === true) {
				$ionicSideMenuDelegate.toggleRight();
			}
			$scope.showVotePanel = true;
			$ionicSideMenuDelegate.canDragContent(false);
		};
		$scope.onSwipeUp = function() {
			console.log('vote Up');
			$scope.vote = 1;
			//$scope.showVotePanel = false;
			$ionicSideMenuDelegate.canDragContent(true);
		};
		$scope.onSwipeDown = function() {
			console.log('vote Down');
			$scope.vote = 2;
			//$scope.showVotePanel = false;
			$ionicSideMenuDelegate.canDragContent(true);
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
		if (!lodash.isEmpty($rootScope.currentUser)) {
			if ($rootScope.currentUser.get('connectedPlayer')) {
				PubNub.ngSubscribe({channel: $rootScope.currentUser.get('connectedPlayer').id});
				$rootScope.$on(PubNub.ngMsgEv($rootScope.currentUser.get('connectedPlayer').id), function(event, payload) {
					if (payload.message.type === 'song_added') {
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
					if (payload.message.type === 'song_delete') {
						for (var i = 0; i < $rootScope.queue.length; i++) {
							if ($rootScope.queue[i].id === payload.message.id) {
								$rootScope.queue.splice(i, 1);
							}
						}
					}
				});
			}
		}
		document.addEventListener('resume', onResume, false);
		document.addEventListener('pause', onPause, false);
	}]);