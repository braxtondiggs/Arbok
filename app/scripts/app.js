'use strict';
angular.module('Alma', ['ionic', 'ngCordova', 'config', 'filter', 'Alma.controllers', 'angular-loading-bar', 'cfp.loadingBar', 'angular-echonest', 'ngStorage', 'ngTextTruncate', 'ngCordovaOauth', 'ngLodash', 'pubnub.angular.service', 'monospaced.elastic'])
.run(function($ionicPlatform, $cordovaSplashscreen) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
		if (window.cordova && window.navigator.splashscreen) {
			$cordovaSplashscreen.hide();
		}
	});
	/*global Parse*/
	Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');
})
.factory('UserService', function() {
	return {
		checkImage: function(img) {
			if (img) {
				return (img.slice(-3) === 'jpg') ? ((img.indexOf('http://imvdb.com/') > -1)?img.substr(17):img): 'images/logo_missing.png';
			} else {
				return;
			}
		},
		convertSlug: function(name, slug) {
			if (name !== null && name !== undefined && name !== '') {
				return name;
			} else if (slug !== null && slug !== undefined && slug !== '') {
				if (isNaN(slug)) {
					return slug.replace('-', ' ').replace('-', ' ').replace(/\w\S*/g, function(txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
				} else {
					return slug;
				}
			} else {
				return '';
			}
		}
	};
})
.factory('LoadingService', function(cfpLoadingBar, $ionicLoading) {
	return {
		showLoading: function() {
			cfpLoadingBar.start();
			cfpLoadingBar.inc();
			$ionicLoading.show({
				animation: 'fade-in',
				hideOnStateChange: true,
				showBackdrop: false
			});
		},
		hideLoading: function() {
			$ionicLoading.hide();
			cfpLoadingBar.complete();
		}
	};
})
.factory('MusicService', function($rootScope, $state, $ionicScrollDelegate, $ionicHistory, $cordovaDialogs, $http, $ionicLoading, PubNub, lodash) {
	return {
		storeDB: function(artistInfo) {
			/*jshint camelcase: false */
			/*global Parse*/
			/*global moment*/
			var user = Parse.User.current(),
				that = this;
			if (!lodash.isEmpty(user)) {
				if(user.get('connectedPlayer')) {
					$cordovaDialogs.confirm('Are you sure you want add this song?', 'Alma').then(function(res) {
						if (res === 1) {
							that.inTrackQueue(String(artistInfo.id), function(found) {
								if (!found) {
									$ionicLoading.show();
									$http.get(
										'http://imvdb.com/api/v1/video/' + String(artistInfo.id) + '?include=sources'
									).success(function(data) {
										var sources = data.sources,
											youtubeKey = null;
										for (var key in sources) {
											if (sources[key].source === 'youtube') {
												youtubeKey = sources[key].source_data;
												break;
											}
										}
										if (key !== null) {
											var player = user.get('connectedPlayer');
											var Videos = Parse.Object.extend('Videos');
											var video = new Videos();
											var relation = player.relation('playerVideo');
											video.set('userId', user);
											video.set('image', artistInfo.image.l);
											video.set('IMVDBtrackId', String(artistInfo.id));
											if (artistInfo.convertedSlug) {
												video.set('artistInfo', artistInfo.convertedSlug);
											}else {
												video.set('artistInfo', artistInfo.artists[0].name);
											}
											if (artistInfo.slug) {
												video.set('IMVDBartistId', artistInfo.slug);
											}else {
												video.set('IMVDBartistId', artistInfo.artists[0].slug);
											}
											video.set('playerId', user.get('connectedPlayer'));
											video.set('trackInfo', artistInfo.song_title);
											video.set('year', artistInfo.year);
											video.set('youtubeId', youtubeKey);
											video.set('upVotes', 0);
											video.set('downVotes', 0);
											video.save(null, {
												success: function() {
													relation.add(video);
													player.save();
													$cordovaDialogs.alert('Your song is now in the queue!', 'Alma');
													that.pubNub(video);
													$ionicLoading.hide();
													that.inQueue(video.id, function(found) {
														if (!found) {
															$rootScope.queue.push(video);
															that.getActiveSong();
															that.videoDashboard(user.id, user.get('name'), user.get('image')._url, video);
														}
													});
												},
												error: function() {
													$ionicLoading.hide();
												}
											});
										}else {
											$cordovaDialogs.alert('A Serious Error Occured, Sorry Bro!' ,'Alma').then(function() {
												//Need An Error to Save Errors
												$ionicLoading.hide();
											});
										}
									});
								}else {
									$cordovaDialogs.alert('Looks like this song is already in the Queue.', 'Alma - Error');
								}
							});
						}else {
							$ionicLoading.hide();
						}
					});
				}else{
					$cordovaDialogs.alert('You have not connected to an Alma yet.', 'Alma - Error').then(function() {
						$state.transitionTo('app.player');
						$ionicLoading.hide();
					});
				}
			} else {
				$cordovaDialogs.alert('You need to be logged inorder to suggest a song', 'Alma - Error').then(function() {
					//$scope.login();
					$ionicLoading.hide();
				});
			}
		},
		pubNub: function(video) {
			var user = Parse.User.current();
			PubNub.ngPublish({
				channel: video.get('playerId').id,
				message: {'type': 'song_added', 'id': video.id, 'username': user.get('name'), 'image': video.get('image'), 'artist': video.get('artistInfo'), 'track': video.get('trackInfo')}
			});
		},
		inQueue: function(id, callback) {
			var queue = $rootScope.queue,
				found = false;
			for (var i = 0;i < queue.length; i++) {
				if (queue[i].id === id) {
					found = true;
					break;
				}
			}
			callback(found);
		},
		getActiveSong: function() {
			for (var i = 0; i < $rootScope.queue.length; i++) {
				if ($rootScope.queue[i].get('isActive') === true) {
					$rootScope.firstQueue = $rootScope.queue[i];
					$rootScope.firstQueue.index = i;
					break;
				}
			}
		},
		videoDashboard: function(id, name, image, video) {
			var user = Parse.User.current();
			var obj = {
				self: (id === user.id) ? true : false,
				type: 'video',
				videoId: video.id,
				image: image,
				videoImage: video.get('image'),
				username: name + ' added:',
				msg: video.get('artistInfo') + ' - ' + video.get('trackInfo'),
				createdAt: moment().format('dddd, MMMM Do YYYY, h:mma')
			};
			if (!$rootScope.chats) {
				$rootScope.chats = [];
				$rootScope.dashboard = {
					count: 0
				};
			}
			$rootScope.chats.push(obj);
		},
		inTrackQueue: function(id, callback) {
			var queue = $rootScope.queue,
				found = false;
			for (var i = 0;i < queue.length; i++) {
				if (queue[i].get('IMVDBtrackId') === id) {
					found = true;
					break;
				}
			}
			callback(found);
		},
		addChat: function(id, msg, name, image) {
			var user = Parse.User.current();
			if (!$rootScope.chats) {
				$rootScope.chats = [];
				$rootScope.dashboard = {
					count: 0
				};
			}
			var obj = {
				self: (id === user.id) ? true : false,
				type: 'chat',
				createdAt: moment().format('dddd, MMMM Do YYYY, h:mma'),
				msg: msg,
				username: name,
				image: image
			};
			var found = false;
			for (var i = 0;i < $rootScope.chats.length; i++) {
				if ($rootScope.chats[i].createdAt === obj.createdAt && $rootScope.chats[i].id === obj.id && $rootScope.chats[i].msg === obj.msg) {
					found = true;
					break;
				}
			}
			if (!found) {
				$rootScope.chats.push(obj);
				$ionicScrollDelegate.scrollBottom(true);
			}
		},
		updateVideo: function(player) {
			player.relation('playerVideo').query().ascending('createdAt').find({
				success: function(queue) {
					$rootScope.queue = queue;
					$rootScope.$apply();
				}
			});
		},
		subscribeToPlayer: function(connectedPlayer) {
			var user = Parse.User.current(),
				that = this;
			function getVideos(player, payload) {
				player.relation('playerVideo').query().ascending('createdAt').find({
					success: function(queue) {
						$rootScope.queue = queue;
						var obj = {
							self: (payload.message.id === user.id) ? true : false,
							type: 'vote',
							image: payload.message.image,
							username: payload.message.username + ' ' + ((payload.message.vote)?'Liked':'Disliked'),
							msg: payload.message.selectedTrack,
							createdAt: moment().format('dddd, MMMM Do YYYY, h:mma')
						};
						if (!$rootScope.chats) {
							$rootScope.chats = [];
							$rootScope.dashboard = {
								count: 0
							};
						}
						$rootScope.chats.push(obj);
						var current = $ionicHistory.currentView();
						if (current.stateName === 'app.dashboard') {
							$ionicScrollDelegate.scrollBottom(true);
						}
						if (queue.length) {
							for (var i = 0;i < queue.length;i++) {
								$rootScope.queue[i].counter = parseInt(queue[i].get('upVotes'), 10) - parseInt(queue[i].get('downVotes'), 10);
							}
						}
						$rootScope.$apply();
					}
				});
			}
			PubNub.ngSubscribe({channel: connectedPlayer});
			$rootScope.$on(PubNub.ngMsgEv(connectedPlayer), function(event, payload) {
				if (payload.message.type === 'song_added') {
					that.inQueue(payload.message.id, function(found) {
						if (!found) {
							var Videos = Parse.Object.extend('Videos');
							var query = new Parse.Query(Videos);
							query.equalTo('objectId', payload.message.id);
							query.limit(1);
							query.find({
								success: function(video) {
									$rootScope.queue.push(video[0]);
									that.getActiveSong();
									that.videoDashboard(payload.message.id, (payload.message.username)?payload.message.username:'Alma Player', (payload.message.image)?payload.message.image:undefined, video[0]);
									var current = $ionicHistory.currentView();
									if (current.stateName === 'app.dashboard') {
										$ionicScrollDelegate.scrollBottom(true);
									}
									$rootScope.$apply();
								}
							});
						}
					});
				}
				if (payload.message.type === 'song_delete') {
					for (var i = 0; i < $rootScope.queue.length; i++) {
						if ($rootScope.queue[i].id === payload.message.id) {
							$rootScope.queue.splice(i, 1);
							if ($rootScope.queue.length) {
								$rootScope.queue[0].set('isActive', true);
								that.getActiveSong();
							}
							for(var ii = 0; ii < $rootScope.chats; ii++) {
								if ($rootScope.chats[ii].type === 'video') {
									if ($rootScope.chats[ii].videoId) {
										if ($rootScope.chats[ii].videoId === payload.message.id) {
											$rootScope.chats.splice(ii, 1);
										}
									}
								}
							}
							$rootScope.$apply();
						}
					}
				}
				if (payload.message.type === 'vote') {
					if (connectedPlayer) {
						if (!$rootScope.queue.length) {
							var Player = Parse.Object.extend('Player'),
								query = new Parse.Query(Player),
								myPlayer;
							query.get(connectedPlayer, {
								success: function(player) {
									myPlayer = player;
								}
							}).then(function(player) {
								getVideos(player, payload);
							});
						}
					}
				}
				if (payload.message.type === 'chat_msg') {
					var obj = payload.message;
					that.addChat(obj.id, obj.msg, obj.username, obj.image);
					var current = $ionicHistory.currentView();
					if (current.stateName !== 'app.dashboard') {
						$rootScope.dashboard.count++;
					}else {
						$ionicScrollDelegate.scrollBottom(true);
					}
					$rootScope.$apply();
				}
			});
		}
	};
})
.directive('watchMenu', function($timeout, $ionicSideMenuDelegate) {
	return {
		restrict: 'A',
		link: function($scope) {
			// Run in the next scope digest
			$timeout(function() {
				// Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is
				$scope.$watch(function() {
						return $ionicSideMenuDelegate.getOpenRatio();
					},
					function(ratio) {
						$scope.data = ratio;
						if (ratio >= 0.5) {
							$scope.ratio = true;
						} else {
							$scope.ratio = false;
						}
					});
			});
		}
	};
})
.directive('errSrc', function() {
	return {
	  	link: function(scope, element, attrs) {
	    	element.bind('error', function() {
	      		if (attrs.src !== attrs.errSrc) {
	        		attrs.$set('src', attrs.errSrc);
	        		attrs.$set('class', 'missingImage');
	      		}
	    	});
	  	}
	};
})
.config(['EchonestProvider', function(EchonestProvider) {
	EchonestProvider.setApiKey('0NPSO7NBLICGX3CWQ');
}])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	$stateProvider

		.state('app', {
		url: '/app',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'AppCtrl'
	})

	.state('app.dashboard', {
		url: '/dashboard',
		views: {
			'menuContent': {
				templateUrl: 'templates/dashboard.html',
				controller: 'DashboardCtrl',
			}
		}
	})
	.state('app.search', {
		url: '/search/{searchId}/',
		params: {
			searchId: {
				value: null,
				squash: true
			}
		},
		views: {
			'menuContent': {
				templateUrl: 'templates/search.html',
				controller: 'SearchCtrl',
			}
		}
	})
	.state('app.discover', {
		url: '/discover',
		views: {
			'menuContent': {
				templateUrl: 'templates/discover.html',
				controller: 'DiscoverCtrl'
			}
		}
	})
	.state('app.artist', {
		url: '/artist/:action/:artistId',
		views: {
			'menuContent': {
				templateUrl: 'templates/artist.html',
				controller: 'ArtistCtrl'
			}
		}
	})
	.state('app.queue', {
		url: '/queue',
		views: {
			'menuContent': {
				templateUrl: 'templates/queue.html',
				controller: 'QueueCtrl'
			}
		}
	})
	.state('app.profile', {
		url: '/profile',
		views: {
			'menuContent': {
				templateUrl: 'templates/profile.html',
				controller: 'ProfileCtrl'
			}
		}
	})
	.state('app.playlist', {
		url: '/playlist',
		views: {
			'menuContent': {
				templateUrl: 'templates/playlist.html',
				controller: 'PlaylistCtrl'
			}
		}
	})
	.state('app.player', {
		url: '/player',
		views: {
			'menuContent': {
				templateUrl: 'templates/player.html',
				controller: 'PlayerCtrl'
			}
		}
	})
	.state('app.music', {
		url: '/music',
		views: {
			'menuContent': {
				templateUrl: 'templates/music.html',
				controller: 'MusicCtrl'
			}
		}
	})
	.state('app.settings', {
		url: '/settings',
		views: {
			'menuContent': {
				templateUrl: 'templates/settings.html',
				controller: 'SettingsCtrl'
			}
		}
	})
	.state('app.settings-player', {
		url: '/settings/player',
		views: {
			'menuContent': {
				templateUrl: 'templates/player_settings.html',
				controller: 'PlayerSettingsCtrl'
			}
		}
	});
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/app/dashboard');
	$ionicConfigProvider.tabs.position('top');
	$ionicConfigProvider.views.swipeBackEnabled(true);
});