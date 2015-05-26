'use strict';
angular.module('Alma.controllers')
	.controller('QueueCtrl', ['$scope', '$rootScope', '$cordovaDialogs', '$ionicSideMenuDelegate', 'PubNub', function($scope, $rootScope, $cordovaDialogs, $ionicSideMenuDelegate, PubNub) {
		/*global Parse*/
		$rootScope.queue = [];
		function getVideos(player) {
			player.relation('playerVideo').query().ascending('createdAt').find({
				success: function(queue) {
					$rootScope.queue = queue;
					if (queue.length) {
						for (var i = 0;i < queue.length;i++) {
							$rootScope.queue[i].counter = parseInt(queue[i].get('upVotes'), 10) - parseInt(queue[i].get('downVotes'), 10);
						}
					}
					$scope.$apply();
				}
			});
		}
		if ($scope.$storage.connectedPlayer) {
			if (!$scope.queue.length) {
				var Player = Parse.Object.extend('Player'),
					query = new Parse.Query(Player),
					myPlayer;
				query.get($scope.$storage.connectedPlayer, {
					success: function(player) {
						myPlayer = player;
					}
				}).then(function(player) {
					getVideos(player);
				});
			}
		}
		$scope.deleteSong = function(index){
			$cordovaDialogs.confirm('Are you sure you want to delete this video from the queue?', 'Alma', ['Delete','Cancel']).then(function(res) {
				if (res === 1) {
					PubNub.ngPublish({
						channel: $scope.$storage.connectedPlayer,
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
	}]);