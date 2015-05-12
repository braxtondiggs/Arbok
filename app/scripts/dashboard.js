'use strict';
angular.module('Alma.controllers')
	.controller('DashboardCtrl', ['$scope', '$rootScope', '$timeout', '$state', '$localStorage', '$ionicScrollDelegate', '$cordovaDialogs', '$ionicLoading', '$ionicActionSheet', '$cordovaCamera', '$cordovaKeyboard', '$cordovaClipboard', 'lodash', 'PubNub', 'MusicService', function($scope, $rootScope, $timeout, $state, $localStorage, $ionicScrollDelegate, $cordovaDialogs, $ionicLoading, $ionicActionSheet, $cordovaCamera, $cordovaKeyboard, $cordovaClipboard, lodash, PubNub, MusicService) {
		$scope.dashboard = {
			chat: {}
		};
		$scope.$storage = $localStorage.$default({
			'hasSetupDashboard': false
		});
		var user = $rootScope.currentUser;
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
			//getMessages
		});
		$scope.dashboard.uploadImage = function(msg) {
			var hideSheet = $ionicActionSheet.show({
				buttons: [{
					text: 'Take Photo'
				}],
				titleText: 'Photo Upload',
				cancelText: 'Cancel',
				buttonClicked: function(index) {
					function imageError() {
						hideSheet();
						$ionicLoading.hide();
						$ionicLoading.show({
							template: 'Error, could not load photo...',
							duration: 2000
						});
					}
					if (index === 0) {
						$ionicLoading.show();
						/* global Camera*/
						/*global Parse*/
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
							var file = new Parse.File(user.id + '.png', {
								base64: imageData
							});
							user.set('image', file);
							user.save(null, {
								success: function(image) {
									console.log(image);
									$scope.dashboard.sendChat(msg, image._url);
								},
								error: function() {
									$ionicLoading.show({
										template: 'Error, we could not upload your photo...',
										duration: 2000
									});
								}
							});
							
						}, function() {
							imageError();
						});
					}
				}
			});
		};
		$scope.dashboard.sendChat = function(msg, image) {
			if (msg !== '') {
				console.log(user);
				if (!lodash.isEmpty(user)) {
					if (user.get('connectedPlayer')) {
						MusicService.addChat(user.id, msg, user.get('name'), user.get('image'));
						PubNub.ngPublish({
							channel: user.get('connectedPlayer').id,
							message: {'type': 'chat_msg', 'id': user.id, 'msg': msg, 'username': user.get('name'), 'image': user.get('image'), 'msg_image': image}
						});
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
				/*if (window.cordova && window.cordova.plugins.Keyboard) {
					if ($cordovaKeyboard.isVisible()) {
						$cordovaKeyboard.close();
					}
				}*/
				$scope.dashboard.sendChat($scope.dashboard.chat.chatMsg);
				$scope.dashboard.chat.chatMsg = '';
			}
		};
		/*$scope.$on('taResize', function(e, ta) {
			console.log('taResize');
			if (!ta) return;

			var taHeight = ta[0].offsetHeight;
			console.log('taHeight: ' + taHeight);
			if (!footerBar) return;

			var newFooterHeight = taHeight + 10;
			newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

			footerBar.style.height = newFooterHeight + 'px';
			scroller.style.bottom = newFooterHeight + 'px'; 
		});*/
	}]);