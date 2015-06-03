'use strict';
angular.module('Alma.controllers')
	.controller('DashboardCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$localStorage', '$ionicScrollDelegate', '$cordovaDialogs', '$cordovaVibration', '$ionicLoading', '$ionicActionSheet', '$cordovaCamera', '$cordovaKeyboard', '$cordovaClipboard', 'lodash', 'PubNub', 'MusicService', function($scope, $rootScope, $timeout, $state, $localStorage, $ionicScrollDelegate, $cordovaDialogs, $cordovaVibration, $ionicLoading, $ionicActionSheet, $cordovaCamera, $cordovaKeyboard, $cordovaClipboard, lodash, PubNub, MusicService) {
		$scope.dashboard = {
			chat: {}
		};
		$scope.$storage = $localStorage.$default({
			'hasSetupDashboard': false
		});
		$scope.dashboard.skipTutorial = function() {
			$scope.$storage.hasSetupDashboard = true;
		};
		$scope.dashboard.startTutorial = function() {
			/*global EnjoyHint*/
			var enjoyhint = new EnjoyHint({});
			var ehSteps= [
				{
					'click .buttons.buttons-left.header-item' : 'Press the top corner to open your menu', showSkip: false, shape : 'circle', radius: 30
				}, {
					'click .demo-venue': 'Here is where you find all the Alma Venues in your area', showSkip: false, timeout: 1500, onBeforeStart: function() {$scope.$storage.hasSetupDashboard = true;}
				}
			];
			enjoyhint.set(ehSteps);
			enjoyhint.run();
		};
		$scope.$on('$ionicView.enter', function() {
			$ionicScrollDelegate.scrollBottom(true);
		});
		$scope.dashboard.attachImage = function() {
			var hideSheet = $ionicActionSheet.show({
				buttons: [{
					text: 'Take Photo'
				}],
				titleText: 'Photo Upload',
				cancelText: 'Cancel',
				buttonClicked: function(index) {
					$scope.dashboard.uploadImage();
					return true;
				}
			});
		};
		$scope.dashboard.changeImage = function() {
			var hideSheet = $ionicActionSheet.show({
				buttons: [{
					text: 'Change Photo',
				},{
					text: 'Remove Photo',
				}],
				titleText: 'Photo Options',
				cancelText: 'Cancel',
				buttonClicked: function(index) {
					switch (index) {
						case 0:
							$scope.dashboard.uploadImage();
							break;
						case 1:
							delete $scope.dashboard.image;
							break;
					}
					return true;
				}
			});
		};
		$scope.dashboard.uploadImage = function() {
			$ionicLoading.show();
			/* global Camera*/
			var cameraOptions = {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				encodingType: Camera.EncodingType.PNG,
				correctOrientation: true,
				targetWidth: 150,
				allowEdit: true
			};
			$cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
				$scope.dashboard.image = imageData;					
			}, function() {
				hideSheet();
				$ionicLoading.hide();
				$ionicLoading.show({
					template: 'Error, could not load photo...',
					duration: 2000
				});
			});
		}
		$scope.dashboard.sendChat = function(msg) {
			if (msg !== '') {
				var user = Parse.User.current();
				if (!lodash.isEmpty(user)) {
					if (user.get('connectedPlayer')) {
						MusicService.addChat(user.id, msg, user.get('name'), (user.get('image'))?user.get('image')._url:undefined, ($scope.dashboard.image)?$scope.dashboard.image:undefined);
						PubNub.ngPublish({
							channel: user.get('connectedPlayer').id,
							message: {'type': 'chat_msg', 'id': user.id, 'msg': msg, 'username': user.get('name'), 'image': (user.get('image'))?user.get('image')._url:'/images/missingPerson.jpg', 'msg_image': ($scope.dashboard.image)?$scope.dashboard.image:undefined}
						});
						delete $scope.dashboard.image;
					}else {
						$cordovaDialogs.alert('You have not connected to an Alma yet.', 'Alma - Error').then(function() {
							$state.transitionTo('app.player');
						});
					}
				}else {
					$cordovaDialogs.alert('You need to be logged in to send a chat message', 'Alma - Error').then(function() {
						$scope.login();
					});
				}
			}
		};
		$scope.dashboard.onMessageHold = function(e, itemIndex, message) {
			/*global ionic*/
			if (ionic.Platform.isWebView()) {
				$cordovaVibration.vibrate(100);
			}
			$ionicActionSheet.show({
				buttons: [{
					text: 'Copy Text'
				}, {
					text: 'Delete Message'
				}],
				titleText: 'Message Options',
				cancelText: 'Cancel',
				buttonClicked: function(index) {
					switch (index) {
						case 0:
							$cordovaClipboard.copy(message.text);
							break;
						case 1:
							$rootScope.chats.splice(itemIndex, 1);
							$timeout(function() {
								$ionicScrollDelegate.resize();
							}, 0);
							break;
					}
					return true;
				}
			});
		};
		$scope.dashboard.getKeys = function($event) {
			if($event.which === 13){
				if (window.cordova && window.cordova.plugins.Keyboard) {
					if ($cordovaKeyboard.isVisible()) {
						$cordovaKeyboard.close();
					}
				}
				$scope.dashboard.sendChat($scope.dashboard.chat.chatMsg);
				$scope.dashboard.chat.chatMsg = '';
			}
		};
	}]);