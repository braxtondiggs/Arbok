'use strict';
angular.module('Alma.controllers')
	.controller('DashboardCtrl', ['$scope', '$state', '$localStorage', '$cordovaDialogs', 'lodash', 'PubNub', function($scope, $state, $localStorage, $cordovaDialogs, lodash, PubNub) {
		/*global Parse*/
		$scope.dashboard = {
			chat: {}
		};
		$scope.$storage = $localStorage.$default({
			'hasSetupDashboard': false
		});
		var user = $scope.currentUser;;
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
			if (msg !== '') {
				if (!lodash.isEmpty(user)) {
					if (user.get('connectedPlayer')) {
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
	}]);