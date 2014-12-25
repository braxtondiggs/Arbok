'use strict';

angular.module('serverApp')
	.config(function($routeProvider) {
		$routeProvider
			.when('/player', {
				templateUrl: 'app/player/player.html',
				controller: 'PlayerCtrl'
			});
	})
	.factory('socket', function($rootScope) {
		var socket = io.connect();
		return {
			on: function(eventName, callback) {
				socket.on(eventName, function() {
					var args = arguments;
					$rootScope.$apply(function() {
						callback.apply(socket, args);
					});
				});
			},
			emit: function(eventName, data, callback) {
				socket.emit(eventName, data, function() {
					var args = arguments;
					$rootScope.$apply(function() {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				});
			}
		};

	})
	.constant('YT_event', {
		STOP: 0,
		PLAY: 1,
		PAUSE: 2,
		STATUS_CHANGE: 3
	})
	.directive('youtube', function($window, YT_event, socket) {
		return {
			restrict: 'E',

			scope: {
				height: '@',
				width: '@',
				videoid: '@'
			},

			template: '<div></div>',

			link: function(scope, element, attrs, $rootScop) {
				var tag = document.createElement('script');
			      tag.src = "https://www.youtube.com/iframe_api";
			      var firstScriptTag = document.getElementsByTagName('script')[0];
			      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			      
			      var player;

				$window.onYouTubeIframeAPIReady = function() {

					player = new YT.Player(element.children()[0], {
						playerVars: {
							///controls: 0,
							disablekb: 0,
							showinfo: 0,
							rel: 0,
							iv_load_policy: 3,
							autoplay: 0
						},

						height: scope.height,
						width: scope.width,
						videoId: scope.videoid,
						events: {
							'onStateChange': function(event) {
								var message = {
									event: YT_event.STATUS_CHANGE,
									data: ''
								};

								switch (event.data) {
									case YT.PlayerState.PLAYING:
										message.data = 'PLAYING';
										break;
									case YT.PlayerState.ENDED:
										message.data = 'ENDED';
										break;
									case YT.PlayerState.UNSTARTED:
										message.data = 'NOT PLAYING';
										break;
									case YT.PlayerState.PAUSED:
										message.data = 'PAUSED"'
										break;
								}

								scope.$apply(function() {
									scope.$emit(message.event, message.data);
								});
							}
							
						}
					});
					scope.$apply(function() {
						scope.$emit(YT_event.STATUS_CHANGE, 'INIT');
					});
				};

				scope.$watch('videoid', function(newValue, oldValue) {
					if (player) {
						if (newValue === oldValue) {
							return;
						}
						player.loadVideoById(scope.videoid);
						player.playVideo();
						$("#currentlyPlaying").addClass('active');
						setTimeout(function() {
				            $("#currentlyPlaying").removeClass('active');
				        }, 60000);
					}else {
						return;
					}
				});

				scope.$watch('height + width', function(newValue, oldValue) {
					if (newValue === oldValue) {
						return;
					}

					player.setSize(scope.width, scope.height);

				});

				scope.$on(YT_event.STOP, function() {
					player.seekTo(0);
					player.stopVideo();
				});

				scope.$on(YT_event.PLAY, function() {
					player.playVideo();
				});

				scope.$on(YT_event.PAUSE, function() {
					player.pauseVideo();
				});

			}
		};
	});