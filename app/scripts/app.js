'use strict';
angular.module('Quilava', ['ionic', 'ngCordova', 'config', 'filter', 'Quilava.controllers', 'angular-loading-bar', 'cfp.loadingBar', 'angular-echonest', 'ngStorage', 'ngTextTruncate', 'ngCordovaOauth', 'ngLodash', 'pubnub.angular.service', 'tabSlideBox'])
.run(function($ionicPlatform) {
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
	});
	/*global Parse*/
	Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');
})
.factory('UserService', function() {
	return {
		checkImage: function(img) {
			if (img) {
				return (img.slice(-3) === 'jpg') ? ((img.indexOf('http://imvdb.com/') > -1)?img.substr(17):img): 'http://placehold.it/125x80';
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
				showBackdrop: false
			});
		},
		hideLoading: function() {
			$ionicLoading.hide();
			cfpLoadingBar.complete();
		}
	};
})
.factory('MusicService', function($state, $cordovaDialogs, $http, $ionicLoading, PubNub, lodash) {
	return {
		storeDB: function(artistInfo) {
			/*jshint camelcase: false */
			/*global Parse*/
			var user = Parse.User.current(),
				that = this;
			if (!lodash.isEmpty(user)) {
				if(user.get('connectedPlayer')) {
					$cordovaDialogs.confirm('Are you sure you want add this song?', 'MVPlayer').then(function(res) {
						if (res === 1) {
							//Do Queue Stuff
							/*
							for (var i = 0; i < $scope.queue_list.length; i++) {
								if ($scope.queue_list[i].IMVDBtrackId === id) {
									found = true;
								}
							}

							$ionicPopup.alert({
								title: 'MVPlayer - Error',
								template: 'Looks like this song is already in the Queue.'
							});*/
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
									video.save(null, {
										success: function() {
											relation.add(video);
											player.save();
											$cordovaDialogs.alert('Your song is now in the queue! Sit back and be the MVP you are.', 'MVPlayer');
											that.pubNub(video);
											$ionicLoading.hide();
										},
										error: function() {
											$ionicLoading.hide();
										}
									});
								}else {
									$cordovaDialogs.alert('A Serious Error Occured, Sorry Bro!' ,'MVPlayer');
									//Need An Error to Save Errors
								}
							});
						}
					});
				}else{
					$cordovaDialogs.alert('You have not connected to a MVPlayer yet.', 'MVPlayer - Error').then(function() {
						$state.transitionTo('app.player');
					});
				}
			} else {
				$cordovaDialogs.alert('You need to be logged inorder to suggest a song', 'MVPlayer - Error').then(function() {
					//$scope.login();
				});
			}
		},
		pubNub: function(video) {
			var user = Parse.User.current();
			PubNub.ngPublish({
				channel: video.get('playerId').id,
				message: {'type': 'song_added', 'id': video.id, 'username': user.get('name'), 'image': video.get('image'), 'artist': video.get('artistInfo'), 'track': video.get('trackInfo')}
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
						if (ratio === 1) {
							$scope.ratio = true;
						} else {
							$scope.ratio = false;
						}
					});
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