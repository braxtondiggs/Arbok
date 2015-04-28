'use strict';
angular.module('Quilava.controllers')
	.controller('QueueCtrl', ['$scope', function($scope) {
		/*global Parse*/
		var user = Parse.User.current();
		if (user) {
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
						$scope.queue = queue;
						console.log(queue);
						$scope.$apply();
					}
				});
			});
		}
	}]);