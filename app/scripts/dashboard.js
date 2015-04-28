'use strict';
angular.module('Quilava.controllers')
	.controller('DashboardCtrl', ['$scope', '$ionicScrollDelegate', 'LoadingService', function($scope, $ionicScrollDelegate, LoadingService) {
		/*global Parse*/
		LoadingService.showLoading();
		LoadingService.hideLoading();
		var user = Parse.User.current();
		function isConnected(player) {
			console.log(player);
		}
		if (user) {
			if (isConnected()) {

			}
		}else {

		}
		/*if ($scope.room !== null) {
			$scope.chats = null;
			var Chat = Parse.Object.extend("Chat");
			var query = new Parse.Query(Chat);
			LoadingService.showLoading();
			query.equalTo("room", $scope.room);
			query.ascending("createdAt");
			$scope.loaded = false;
			query.find({
				success: function(results) {
					var result = [];
					for (var i = 0; i < results.length; i++) {
						results[i]._serverData.self = ($scope.currentUser !== null && results[i]._serverData.userId === $scope.currentUser.id) ? true : false;
						results[i]._serverData.createdAt = moment(results[i].createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
						result.push(results[i]._serverData);
					}
					$scope.chats = result;
					$ionicScrollDelegate.scrollBottom();
					LoadingService.hideLoading();
					$scope.loaded = true;
				}
			});
		} else {
			$ionicPopup.alert({
				title: 'MVPlayer',
				template: 'You need to be connect to player first to see chat messages! Click \'OK\' to goto player setup!'
			}).then(function(res) {
				if (res) {
					$window.location = '#/app/player'
				}
			});
		}
		$scope.sendChat = function(msg) {
			var title = 'MVPlayer - Error',
				body = null;
			if (msg.chatMsg !== "") {
				if ($scope.room) {
					if ($scope.currentUser) {
						var img = ($scope.currentUser._serverData.image) ? $scope.currentUser._serverData.image._url : null;
						document.getElementById('chat-input').value = '';
						socket.emit('chat', {
							'room': $scope.room,
							'from': $scope.currentUser._serverData.name,
							'userId': $scope.currentUser.id,
							'img': img,
							'body': msg.chatMsg
						});
					} else {
						body = 'You have not connected to a MVPlayer yet.';
						location = '#/app/player';
					}
				} else {
					body = 'You need to be logged inorder to suggest a song';
					location = null;
				}
				if (body !== null) {
					$ionicPopup.alert({
						title: title,
						template: body
					}).then(function(res) {
						if (location !== null){
							window.location = location;
						}else {
							$scope.login();
						}
					});
				}
			}
		}

		socket.on('chat:new', function(data) {
			data.self = (data.userId === $scope.currentUser.id) ? true : false;
			data.createdAt = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
			$scope.chats.push(data);
			$ionicScrollDelegate.scrollBottom();
		});*/
		$scope.scrollBottom = function() {
			$ionicScrollDelegate.scrollBottom();
		};
	}]);