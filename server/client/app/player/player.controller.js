'use strict';

var serverApp = angular.module('serverApp');
serverApp.controller('PlayerCtrl', function($scope, socket) {
	$scope.room = 'R1BwluUoNs';
	$scope.event = {};
	$scope.voteoff = {};
	$scope.voteoff.bannerLocation = "bottom";
	$scope.detonate = null;
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
		function songEnded() {
			socket.emit('song:ended', {
				room: $scope.room,
				trackId: $scope.queueList[0].objectId,
				artistInfo: $scope.queueList[0].artistInfo
			});
		}
		if (event.data === YT.PlayerState.ENDED) {
			songEnded();
			$scope.detonate = setTimeout(function() {
				console.log("nothif");
				songEnded();
			}, 5000);
		}else if(event.data === YT.PlayerState.PLAYING) {
			if ($scope.detonate !== null) {
				window.clearTimeout($scope.detonate);
				$scope.detonate = null;
			}
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
	$scope.voteOffBanner = function() {
		return 
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
			var downvote = parseInt(msg.downvote, 10),
				voteNum = parseInt(msg.upvote, 10) + downvote;
			$.gritter.add({
				title: String(msg.userName) + ' '+ ((String(msg.voteChoice) === 'upvote')?'liked':'disliked') + ' this song!',
				image: '/assets/images/thumbs-' + ((String(msg.voteChoice) === 'upvote')?'up':'down')+'.png'
			});
			if(downvote/voteNum >= 0.53 && voteNum >= 2) {
				$scope.voteoff = {};
				$scope.voteoff.count = 10;
				$scope.voteoff.bannerLocation = "active center";
		        var countdown = setInterval(function() {
		            $scope.voteoff.count--;
		        }, 1000);
		        setTimeout(function() {
		        	$scope.voteoff.bannerLocation = "active top";
		            clearInterval(countdown);
		            setTimeout(function() {
		            	$scope.voteoff.bannerLocation = "bottom";
		            }, 5000);
		            socket.emit('song:ended', {
						room: $scope.room,
						trackId: $scope.queueList[0].objectId,
						artistInfo: $scope.queueList[0].artistInfo
					});
		        }, 10000);
			}
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