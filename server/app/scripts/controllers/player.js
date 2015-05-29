'use strict';
angular.module('MVPlayer').controller('PlayerCtrl', ['$scope', '$rootScope', '$location', '$localStorage', 'ngDialog', 'PubNub', 'Echonest', '$window', '$timeout', '$interval', '$http', '$q', 'notify', 'lodash', function($scope, $rootScope, $location, $localStorage, ngDialog, PubNub, Echonest, $window, $timeout, $interval, $http, $q, notify, lodash) {
	/*global $:false */
	/*global Parse*/
	/*global YT*/
	/*global moment*/
	/*jshint camelcase: false */
	PubNub.init({
		publish_key: 'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2', // jshint ignore:line
		subscribe_key: 'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe' // jshint ignore:line
	});
	$rootScope.bodyClass = 'Player';
	$scope.isBox = ($location.path().indexOf('box') > -1) ? true : false;
	$scope.detonate = null;
	$scope.loading = false;
	$scope.$storage = $localStorage.$default({
		boxCode: null
	});
	$scope.vote = {
		upvote: 0,
		downvote: 0,
		total: 0,
		status: false,
		counter: 10
	};
	$scope.player = {
		width: $(window).width(),
		height: $(window).height(),
		videoId: 'UpRssA0CQ0E',
		playerVars: {
			controls: 0,
			disablekb: 0,
			showinfo: 0,
			rel: 0,
			iv_load_policy: 3, // jshint ignore:line
			autoplay: 0
		}
	};
	notify.config({
		duration: 8000,
		position: 'right'
	});

	function pubNubFub() {
		PubNub.ngSubscribe({
			channel: $scope.box.id
		});
		PubNub.ngHereNow({
			channel: $scope.box.id
		});
		$rootScope.$on(PubNub.ngMsgEv($scope.box.id), function(event, payload) {
			if (payload.message.type === 'player_update') {
				var Player = Parse.Object.extend('Player');
				var player = new Player();
				player.set('isSetup', true);
				player.save().then(function(obj) {
					$scope.box = obj;
					ngDialog.closeAll();
					pubNubFub();
					initalizePlayer();
				}, function(error) {
					$window.alert('Failed to initalize new player, with error code: ' + error.message);
				});
			} else if (payload.message.type === 'song_added') {
				var msg = (payload.message.username) ? payload.message.username + ' just added a song' : 'The queue was empty!',
					submsg = (payload.message.username) ? payload.message.artist + ' - ' + payload.message.track : 'So we picked a song for you.';
				notify({
					messageTemplate: '<img ng-src="' + payload.message.image + '"><span class="content"><h3 class="header">' + msg + '</h3><p>' + submsg + '</p></span>',
					classes: 'activity-modal'
				});
			} else if (payload.message.type === 'chat_msg') {
				notify({
					messageTemplate: '<img ng-src="' + payload.message.image + '"><span class="content"><h3 class="header">' + payload.message.username + '</h3><p>' + payload.message.msg + '</p></span>',
					classes: 'activity-modal'
				});
			} else if (payload.message.type === 'vote' && payload.message.id === $scope.track.id) {
				notify({
					messageTemplate: '<img ng-src="' + payload.message.image + '""><span class="content"><h3 class="header">' + payload.message.username + '</h3><p>' + ((payload.message.vote) ? 'Liked' : 'Disliked') + ' this song!</p></span>',
					classes: 'activity-modal'
				});
				var Vote = Parse.Object.extend('Vote');
				var query = new Parse.Query(Vote);
				query.equalTo('videoId', {
					__type: 'Pointer',
					className: 'Videos',
					objectId: $scope.track.id
				});
				query.equalTo('vote', false);
				query.find({
					success: function(vote) {
						var activeUsers = parseInt(PubNub.ngListPresence($scope.box.id).length, 10) - 1; //Minus Player
						if (vote.length / activeUsers > 0.5) {
							activateSongChange();
						}
					}
				});
			} else if (payload.message.type === 'vote' && payload.message.id !== $scope.track.id) {
				//Vote off in Queue
			}
		});
	}

	function activateSongChange() {
		$scope.vote.status = true;
		var counter = $interval(function() {
			$scope.vote.counter--;
			if ($scope.vote.counter === 0) {
				$scope.vote.status = false;
				$interval.cancel(counter);
				$timeout(function() {
					songEnded();
				}, 1000);
			}
		}, 1000, 10);
	}

	function openModal() {
		ngDialog.open({
			template: 'boxSetupTmpl',
			className: 'ngdialog-boxSetup ngdialog-theme-default',
			showClose: false,
			closeByEscape: false,
			closeByDocument: false,
			scope: $scope
		});
		pubNubFub();
	}

	function getID() {
		var Player = Parse.Object.extend('Player');
		var player = new Player();
		player.set('isBox', true);
		player.set('isSetup', false);
		player.save(null, {
			success: function(obj) {
				$scope.$storage.boxCode = obj.id;
				$scope.box = obj;
				openModal();
			},
			error: function(playerObj, error) {
				$window.alert('Failed to initalize new player, with error code: ' + error.message);
			}
		});
	}

	function youtubeURL(url) { // jshint ignore:line
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

	function getSong(callback) {
		$scope.box.relation('playerVideo').query().ascending('createdAt').find({
			success: function(queue) {
				if (!lodash.isEmpty(queue)) {
					for (var i = 0; i < queue.length; i++) {
						queue[i].counter = parseInt(queue[i].get('upVotes'), 10) - parseInt(queue[i].get('downVotes'), 10);
					}
					callback(lodash.sortByOrder(queue, ['counter'], false)[0]);
				} else {
					emptyQueue(function(randomTrack) {
						PubNub.ngPublish({
							channel: $scope.box.id,
							message: {
								'type': 'song_added',
								'id': randomTrack.id,
								'username': undefined,
								'image': randomTrack.get('image'),
								'artist': randomTrack.get('artistInfo'),
								'track': randomTrack.get('trackInfo')
							}
						});
						callback(randomTrack);
					});
				}
			}
		});
	}

	function initalizePlayer() {
		getSong(function(track) {
			$scope.track = track;
			if ($scope.track) {
				if (youtubeURL($scope.playerEvent.target.getVideoUrl()) !== $scope.track.get('youtubeId')) {
					$scope.playerEvent.target.loadVideoById($scope.track.get('youtubeId'));
					$scope.playerEvent.target.setPlaybackQuality('small');
					activateBar();
					$scope.box.set('playingImg', $scope.track.get('image'));
					$scope.box.save();
					$scope.track.set('isActive', true);
					$scope.track.save();
					$scope.$apply();
				}
			}
		});
	}

	function deleteSong(callback) {
		$scope.last_track = $scope.track;
		$scope.track.destroy({
			success: function() {
				callback();
			},
			error: function() {
				callback();
			}
		});
	}

	function emptyQueue(emptycallback) {
		function saveTrack(imvdbTrack, callback) {
			$http.get(
				'http://imvdb.com/api/v1/video/' + String(imvdbTrack.id) + '?include=sources'
			).success(function(data) {
				var sources = data.sources,
					youtubeKey = null,
					youtubeKey2 = null;
				for (var key in sources) {
					if (sources[key].source === 'youtube' && youtubeKey === null) {
						youtubeKey = sources[key].source_data;
					}
					if (sources[key].source === 'youtube' && youtubeKey !== null && youtubeKey !== sources[key].source_data) {
						youtubeKey2 = sources[key].source_data;
						break;
					}
				}
				if (key !== null) {
					var Videos = Parse.Object.extend('Videos');
					var video = new Videos();
					var relation = $scope.box.relation('playerVideo');
					video.set('image', imvdbTrack.image.l);
					video.set('IMVDBtrackId', String(imvdbTrack.id));
					video.set('artistInfo', imvdbTrack.artists[0].name);
					video.set('IMVDBartistId', imvdbTrack.artists[0].slug);
					video.set('playerId', $scope.box);
					video.set('trackInfo', imvdbTrack.song_title);
					video.set('year', parseInt(imvdbTrack.year, 10));
					video.set('youtubeId', youtubeKey);
					if (youtubeKey2 !== null) {
						video.set('youtubeBackupId', youtubeKey2);
					}
					video.set('upVotes', 0);
					video.set('downVotes', 0);
					video.save(null, {
						success: function() {
							relation.add(video);
							$scope.box.save();
							callback(video);
							$scope.$apply();
						}
					});
				}
			});
		}

		function getSongInfo(parseTrack, callback) {
			$http.get(
				'http://imvdb.com/api/v1/search/videos?q=' + parseTrack.get('artistTitle')
			).success(function(data) {
				var failed = true;
				if (data.results.length) {
					for (var i = 0; i < data.results.length; i++) {
						if (data.results[i].song_title === parseTrack.get('artistTitle') && data.results[i].artists[0].slug === parseTrack.get('artistSlug')) {
							failed = false;
							break;
						}
					}
					if (failed) {
						randomTopSong(function(track) {
							console.log('failed');
							callback(track);
						});
					} else {
						saveTrack(data.results[i], function(savedTrack) {
							callback(savedTrack);
						});
					}
				}
			});
		}

		function randomTopSong(callback) {
			var Browse = Parse.Object.extend('Browse');
			var query = new Parse.Query(Browse);
			query.equalTo('section', 1);
			query.ascending('artistOrder');
			query.find({
				success: function(results) {
					getSongInfo(results[Math.floor(Math.random() * results.length)], function(trackInfo) {
						callback(trackInfo);
					});
					$scope.$apply();
				}
			});
		}

		function getAsFeatured(callback) {
			$http.get(
				'http://imvdb.com/api/v1/search/entities?q=' + $scope.last_track.get('IMVDBartistId')
			).success(function(data) {
				if (data.results.length) {
					for (var i = 0; i < data.results.length; i++) {
						if (data.results[i].slug === $scope.last_track.get('IMVDBartistId')) {
							return $http.get(
								'http://imvdb.com/api/v1/entity/' + data.results[i].id + '?include=featured_videos'
							).success(function(data) {
								if (data.featured_artist_videos) {
									if (data.featured_artist_videos.videos) {
										var ran = Math.floor(Math.random() * data.featured_artist_videos.videos.length);
										saveTrack(data.featured_artist_videos.videos[ran], function(track) {
											callback(track);
										});
									} else {
										callback();
									}
								} else {
									callback();
								}
							});
						}
					}
				} else {
					callback();
				}
			});
		}

		function getEchoNest(callback) {
			var artist = ($scope.last_track) ? $scope.last_track.get('artistInfo') : 'Drake',
				promise = $q.all(null);
			Echonest.artists.get({
				name: artist,
			}).then(function(artist) {
				$http.get(
					'http://developer.echonest.com/api/v4/artist/similar?api_key=0NPSO7NBLICGX3CWQ&id=' + artist.id + '&format=json&results=5&start=0'
				).success(function(data) {
					var similar = data.response.artists,
						found = false;
					angular.forEach(similar, function() {
						promise = promise.then(function() {
							if (!found) {
								var ran = Math.floor(Math.random() * similar.length);
								return $http.get(
									'http://imvdb.com/api/v1/search/videos?q=' + encodeURI(similar[ran].name)
								).success(function(data) {
									if (data.total_results !== 0) {
										var ran2 = Math.floor(Math.random() * data.results.length);
										for (var i = 0; i < data.results.length; i++) {
											if (data.results[ran2].artists[0].name.toLowerCase() === similar[ran].name.toLowerCase()) {
												saveTrack(data.results[ran2], function(track) {
													callback(track);
												});
												found = true;
												break;
											}
										}
									}
								});
							}
						});
					});
					promise.then(function() {
						if (!found) {
							console.log('not found');
							callback();
						}
					});
				}).error(function() {
					callback();
				});
			});
		}
		getEchoNest(function(track) {
			if (track) {
				emptycallback(track);
			} else {
				getAsFeatured(function(track) {
					if (track) {
						emptycallback(track);
					} else {
						randomTopSong(function(track) {
							emptycallback(track);
						});
					}
				});
			}
		});
	}

	function activateBar() {
		$timeout(function() {
			$('#currentlyPlaying').removeClass('active');
		}, 60000);
	}

	function songEnded() {
		$scope.loading = true;
		$scope.vote = {
			upvote: 0,
			downvote: 0,
			total: 0,
			status: false,
			counter: 10
		};
		PubNub.ngPublish({
			channel: $scope.box.id,
			message: {
				type: 'song_delete',
				id: $scope.track.id
			}
		});
		deleteSong(function() {
			initalizePlayer();
		});
	}

	function detonate() {
		if ($scope.detonate !== null) {
			$timeout.cancel($scope.detonate);
		}
		$scope.detonate = $timeout(function() {
			songEnded();
			detonate();
		}, 10000);
	}

	function distance(lat1, lon1, lat2, lon2, unit) {
		var radlat1 = Math.PI * lat1 / 180,
			radlat2 = Math.PI * lat2 / 180,
			theta = lon1 - lon2,
			radtheta = Math.PI * theta / 180,
			dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit === 'K') {
			dist = dist * 1.609344;
		}
		if (unit === 'N') {
			dist = dist * 0.8684;
		}
		return dist;
	}

	function watchVideo() {
		var isConcert = true;
		if ($scope.videoInterval) {
			$interval.cancel($scope.videoInterval);
			isConcert = true;
		}
		var duration = parseInt($scope.playerEvent.target.getDuration(), 10);
		$scope.videoInterval = $interval(function() {
			var time = parseInt($scope.playerEvent.target.getCurrentTime(), 10);
			if (time >= (duration - 5)) {
				$scope.loading = true;
			}
			if (time >= 6 && isConcert) {
				isConcert = false;
				window.artistSearch = function(data) {
					var artistObj = data.resultsPage.results.artist;
					for (var i = 0; i < artistObj.length; i++) {
						if (artistObj[i].displayName.toLowerCase() === $scope.track.get('artistInfo').toLowerCase()) {
							var id = artistObj[i].id;
							window.artistEventSearch = function(data) {
								if (!lodash.isEmpty(data.resultsPage.results)) {
									var eventObj = data.resultsPage.results.event;
									for (var i = 0; i < eventObj.length; i++) {
										if (distance(eventObj[i].location.lat, eventObj[i].location.lng, $scope.box.get('latlng').latitude, $scope.box.get('latlng').longitude, 'M') <= 50) {
											console.log(eventObj[i].start.date + ' ' + eventObj[i].start.time);
											notify({
												messageTemplate: '<img ng-src="/images/songkick-logo.png"><span class="content"><h3 class="header">' + $scope.track.get('artistInfo') + ' is coming to your area!</h3><p>' + eventObj[i].venue.displayName + '</p><p>' + eventObj[i].venue.metroArea.displayName + ', ' + eventObj[i].venue.metroArea.state.displayName + ' ' + eventObj[i].venue.metroArea.country.displayName + '</p><p>' + moment(eventObj[i].start.date + ' ' + eventObj[i].start.time).format('dddd, MMMM Do YYYY, h:mm a') + '</p></span>',
												classes: 'activity-modal',
												duration: 25000,
												position: 'left'
											});
											break;
										}
									}
								}
							};
							$http.jsonp('http://api.songkick.com/api/3.0/artists/' + id + '/calendar.json?jsoncallback=artistEventSearch&apikey=LFxJG3ohVpIBASF5');
						}
					}
				};
				$http.jsonp('http://api.songkick.com/api/3.0/search/artists.json?jsoncallback=artistSearch&apikey=LFxJG3ohVpIBASF5&query=' + $scope.track.get('artistInfo'));
			}
		}, 1000);
	}
	$scope.onError = function() {
		if (youtubeURL($scope.playerEvent.target.getVideoUrl()) !== $scope.track.get('youtubeBackupId')) {
			$scope.playerEvent.target.loadVideoById($scope.track.get('youtubeBackupId'));
			$scope.playerEvent.target.setPlaybackQuality('small');
		} else {
			//Find Another Song
			songEnded();
			notify({
				messageTemplate: '<span class="content"><h3 class="header">The was a small hiccup</h3><p>It seems we couldn\'t play this video</p></span>',
				classes: 'activity-modal'
			});
		}
	};
	$scope.onStateChange = function(event) {
		if (event.data === YT.PlayerState.ENDED) {
			songEnded();
			detonate();
		} else if (event.data === YT.PlayerState.PLAYING) {
			$('#currentlyPlaying').addClass('active');
			$scope.loading = false;
			if ($scope.detonate !== null) {
				$timeout.cancel($scope.detonate);
				$scope.detonate = null;
			}
			watchVideo();
			$scope.$apply();
		}
	};
	$scope.onReady = function(event) {
		$scope.playerEvent = event;
		if ($scope.isBox) {
			$scope.openPlayerSetupDialog();
		}
	};
	$scope.onApiLoadingFailure = function(controller) {
		controller.reload();
	};
	$scope.openPlayerSetupDialog = function() {
		if ($scope.$storage.boxCode === null) {
			getID();
		} else {
			var Player = Parse.Object.extend('Player');
			var query = new Parse.Query(Player);
			query.equalTo('objectId', $scope.$storage.boxCode);
			query.limit(1);
			query.first({
				success: function(obj) {
					if (obj !== undefined) {
						$scope.box = obj;
						if ($scope.box.get('isSetup')) {
							pubNubFub();
							initalizePlayer();
						} else {
							openModal();
						}
					} else {
						getID();
					}
				},
				error: function(gameScore, error) {
					$window.alert('Failed to initalize new player, with error code: ' + error.message);
				}
			});
		}
	};
}]);