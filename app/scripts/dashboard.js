'use strict';
angular.module('Alma.controllers')
	.controller('DashboardCtrl', ['$scope', '$rootScope', '$state', '$localStorage', '$cordovaDialogs', '$cordovaKeyboard', 'lodash', 'PubNub', 'MusicService', function($scope, $rootScope, $state, $localStorage, $cordovaDialogs, $cordovaKeyboard, lodash, PubNub, MusicService) {
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
		$scope.dashboard.uploadImage = function() {
			$cordovaDialogs.alert('We are currently working on this, check back later', 'Alma - Error');
		};
		$scope.dashboard.sendChat = function(msg) {
			var user = $rootScope.currentUser;
			if (msg !== '') {
				console.log(user);
				if (!lodash.isEmpty(user)) {
					if (user.get('connectedPlayer')) {
						MusicService.addChat(user.id, msg, user.get('name'), user.get('image'));
						PubNub.ngPublish({
							channel: user.get('connectedPlayer').id,
							message: {'type': 'chat_msg', 'id': user.id, 'msg': msg, 'username': user.get('name'), 'image': user.get('image')}
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