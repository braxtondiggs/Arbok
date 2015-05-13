'use strict';
angular.module('Alma.controllers')
	.controller('QueueCtrl', ['$scope', '$rootScope', '$cordovaDialogs', '$ionicSideMenuDelegate', 'PubNub', 'lodash', function($scope, $rootScope, $cordovaDialogs, $ionicSideMenuDelegate, PubNub, lodash) {
		/*global Parse*/
		$rootScope.queue = [];
		var user = Parse.User.current();
		function getVideos(player) {
			player.relation('playerVideo').query().find({
				success: function(queue) {
					console.log(queue);
					//$rootScope.queue = $filter('orderBy')(queue, value);
					$scope.$broadcast('sorted');
					console.log($rootScope.queue);
					$scope.$apply();
				}
			});
			$scope.$on('sorted', function() {
				//$rootScope.queue
			});
		}
		if (user) {
			if (user.get('connectedPlayer')) {
				if (!$scope.queue.length) {
					var Player = Parse.Object.extend('Player'),
						query = new Parse.Query(Player),
						myPlayer;
					query.get(user.get('connectedPlayer').id, {
						success: function(player) {
							myPlayer = player;
						}
					}).then(function(player) {
						getVideos(player);
					});
				}
			}
		}else {
			//if ($scope.$storage.connectedPlayer){
				//Need to get Object ID
				//getVideos(player);
			//}
		}
		$scope.deleteSong = function(index){
			$cordovaDialogs.confirm('Are you sure you want to delete this video from the queue?', 'Alma', ['Delete','Cancel']).then(function(res) {
				if (res === 1) {
					PubNub.ngPublish({
						channel: $rootScope.currentUser.get('connectedPlayer').id,
						message: {'type': 'song_delete', 'id': $rootScope.queue[index].id}
					});
					$rootScope.queue[index].destroy();
					$cordovaDialogs.alert('Your video has successfully been removed from the queue', 'Alma').then(function() {
						if ($ionicSideMenuDelegate.isOpenRight() === true) {
							$ionicSideMenuDelegate.toggleRight();
						}
					});
				}
			});
		};
		$scope.queuePage = function() {
			console.log('hi');
		};
	}]);