'use strict';

var serverApp = angular.module('serverApp');
serverApp.controller('PlayerCtrl', function($scope, socket) {
	$scope.room = 'R1BwluUoNs';
	$scope.event = {};
	$scope.onReady = function(event) {
		var player = event.target;
		$scope.event = event;
		socket.emit('server:init', {
			room: $scope.room
		}, function(confirm) {
			$scope.queueList = confirm;
			if (youtubeURL(player.getVideoUrl()) !== $scope.queueList[0].youtubeId) {
				player.loadVideoById($scope.queueList[0].youtubeId);
				activateBar();
			}
		});
	};
	$scope.onStateChange = function(event) {
		if (event.data === YT.PlayerState.ENDED) {
			socket.emit('song:ended', {
				room: $scope.room,
				trackId: $scope.queueList[0].objectId,
				artistInfo: $scope.queueList[0].artistInfo
			});

			//set Time out to check if video is playing, if not force bad new music
		}
	};
	$scope.onError = function() {
		socket.emit('song:ended', {
			room: $scope.room,
			trackId: $scope.queueList[0].objectId,
			artistInfo: $scope.queueList[0].artistInfo
		});
	};
	$scope.onApiChange = function() {
		//console.log(event);
	};
	$scope.onControllerReady = function() {
		//console.log(event);
	};
	$scope.onApiLoadingFailure = function(controller) {
		controller.reload(); // try load youtube api again
	};
	$scope.player = {
		width: $(window).width(),
		height: $(window).height(),
		videoId: 'i9MHigUZKEM',
		playerVars: {
			controls: 0,
			disablekb: 0,
			showinfo: 0,
			rel: 0,
			iv_load_policy: 3,
			autoplay: 0
		}
	};
	socket.on('connect', function() {
		socket.on('playlist:change', function(msg) {
			var player = $scope.event.target,
				event = $scope.event;
			$scope.queueList = msg;
			console.log(msg);
			if (youtubeURL(player.getVideoUrl()) !== $scope.queueList[0].youtubeId) {
				player.loadVideoById($scope.queueList[0].youtubeId);
				$('#currentlyPlaying').addClass('active');
				activateBar();
			}else {
				if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
					player.playVideo();
				}
			}
		});
		socket.on('chat:new', function(msg) {
			$.gritter.add({
				title: msg.from,
				text: msg.body,
				image: msg.image
			});
		});
		socket.on('song:new:server', function(msg) {
			$.gritter.add({
				title: String(msg.userName) + ', just added a new song!',
				text: String(msg.artistTitle) + ' - ' + String(msg.artistName),
				image: String(msg.artistImage)
			});
		});
		socket.on('vote:change', function(msg) {
			$.gritter.add({
				title: String(msg.userName) + ' '+ ((String(msg.voteChoice) === 'upvote')?'liked':'disliked') + ' this song!',
				image: '<i class="fa fa-camera-retro fa-5x"></i>'
			});
		});
	});

	function youtubeURL(url) {
		if (url !== undefined) {
			var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
			var match = url.match(regExp);
			if (match && match[7].length === 11) {
				return match[7];
			}
		} else {
			return false;
		}
	}

	function activateBar() {
		setTimeout(function() {
			$('#currentlyPlaying').removeClass('active');
		}, 60000);
	}

});