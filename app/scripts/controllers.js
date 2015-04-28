'use strict';

angular.module('Quilava.controllers', [])
	.controller('AppCtrl', ['$scope', '$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$cordovaDialogs', '$cordovaVibration', '$ionicLoading', '$ionicHistory', '$localStorage', 'lodash', 'PubNub', function($scope, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $cordovaDialogs, $cordovaVibration, $ionicLoading, $ionicHistory, $localStorage, lodash, PubNub) {
		/*global Parse*/
		/*global ionic*/
		/*jshint camelcase: false */
		/* exported PubNub */
		$rootScope.currentUser = Parse.User.current() || {};$scope.showVotePanel = true;
		PubNub.init({
			publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',
			subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'
		});
		if (Parse.User.current()) {
			if (!$rootScope.currentUser.get('image')) {
				$rootScope.currentUser.set('image', cordova.file.applicationDirectory + '/images/missingPerson.jpg');
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
		/*$rootScope.$on(PubNub.ngMsgEv('Demo_Channel'), function(event, payload) {
			// payload contains message, channel, env...
			console.log('got a message event:', payload);
		});
		$rootScope.$on(PubNub.ngPrsEv('Demo_Channel'), function(event, payload) {
			console.log('got a presence event:', payload);
		});*/
	}]);