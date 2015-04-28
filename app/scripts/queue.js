'use strict';
angular.module('Quilava.controllers')
	.controller('QueueCtrl', ['$scope', '$rootScope', '$cordovaDialogs', function($scope, $rootScope, $cordovaDialogs) {
		/*global Parse*/
		$rootScope.queue = [];
		var user = Parse.User.current();
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
						player.relation('playerVideo').query().find({
							success: function(queue) {
								$rootScope.queue = queue;
								console.log(queue);
								$scope.$apply();
							}
						});
					});
				}
			}
		}
		$scope.deleteSong = function(index){
			$cordovaDialogs.confirm('Are you sure you want to delete this video from the queue?', 'MVPlayer', ['Delete','Cancel']).then(function(res) {
				if (res === 1) {
					/*PubNub.ngPublish({
						channel: $scope.player[index].id,
						message: {'player_delete': $scope.player[index].id}
					});*/
					$rootScope.queue[index].destroy();
					$rootScope.queue.splice(index, 1);
					$cordovaDialogs.alert('Your video has successfully been removed from the queue', 'MVPlayer');
				}
			});
		};
	}]);