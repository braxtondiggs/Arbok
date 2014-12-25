'use strict';

angular.module('serverApp')
	.controller('PlayerCtrl', function($scope, socket, YT_event) {
		$scope.room = 'R1BwluUoNs';
		$scope.yt = {
			width: $(window).width(),
			height: $(window).height(),
			playerStatus: 'NOT PLAYING'
		};
		socket.on('playlist:change', function(msg) {
			$scope.queueList = msg;
			$scope.yt.videoid = $scope.queueList[0].youtubeId;
		});
		$scope.YT_event = YT_event;

		$scope.sendControlEvent = function(ctrlEvent) {
			this.$broadcast(ctrlEvent);
		};
		$scope.$on(YT_event.STATUS_CHANGE, function(event, data) {
			$scope.yt.playerStatus = data;
			console.log(data);
			if (data === 'ENDED') {
				socket.emit('song:ended', {
					room: $scope.room,
					trackId: $scope.queueList[0].objectId,
					artistInfo: $scope.queueList[0].artistInfo
				});
			}else if (data === 'INIT') {
				setTimeout(function(){
					socket.emit('server:init', {
						room: $scope.room
					}, function(confirm) {
						$scope.queueList = confirm;
						$scope.yt.videoid = $scope.queueList[0].youtubeId;
					});
				}, 750);
			}
		});

	});