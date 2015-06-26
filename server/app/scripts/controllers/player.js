'use strict';
angular.module('Alma').controller('PlayerCtrl', ['$scope', '$rootScope', '$location', '$localStorage', 'ngDialog', 'PubNub', 'Echonest', '$window', '$timeout', '$interval', '$http', '$q', 'notify', 'lodash', '$mdDialog', '$mdSidenav', 'Idle', function($scope, $rootScope, $location, $localStorage, ngDialog, PubNub, Echonest, $window, $timeout, $interval, $http, $q, notify, lodash, $mdDialog, $mdSidenav, Idle) {
	/*global $:false */
	/*global Parse*/
	/*global YT*/
	/*global moment*/
	/*jshint camelcase: false */

	/*$mdDialog.show({
      controller: 'LoginCtrl',
      templateUrl: 'views/modals/login.tmpl.html',
      parent: angular.element(document.body),
      escapeToClose: false

    })*/

	$scope.isActive = true;
	Idle.watch();
	Idle.setIdle(2);
	$scope.$on('IdleStart', function() {
        if (!$mdSidenav('left').isOpen()) {
	    	$scope.isActive = false;
	    	$scope.$apply();
	    }
    });
    $scope.$on('IdleEnd', function() {
    	$scope.isActive = true;
    	$scope.$apply();
    });
  	$scope.closeMenu = function () {
      $mdSidenav('left').close();
    };
    $scope.openMenu = function () {
      $mdSidenav('left').open();
    };















































	PubNub.init({
		publish_key: 'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2', // jshint ignore:line
		subscribe_key: 'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe' // jshint ignore:line
	});
	$rootScope.bodyClass = 'Player';
	$scope.isBox = ($location.path().indexOf('box') > -1) ? true : false;
	$scope.detonate = null;
	$scope.loading = false;
	$scope.isLoadingPlayer1 = true;
	$scope.isLoadingPlayer2 = true;
	$scope.init = 2;
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
			controls: 1,
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
					messageTemplate: '<img ng-src="' + payload.message.image + '" err-src="images/logo_missing.png"><span class="content"><h3 class="header">' + msg + '</h3><p>' + submsg + '</p></span>',
					classes: 'activity-modal'
				});
			} else if (payload.message.type === 'chat_msg') {
				notify({
					messageTemplate: '<img ng-src="' + payload.message.image + '" err-src="images/logo_missing.png"><span class="content"><h3 class="header">' + payload.message.username + '</h3><p>' + payload.message.msg + '</p></span>',
					classes: 'activity-modal'
				});
			} else if (payload.message.type === 'vote' && payload.message.id === $scope.track.id) {
				notify({
					messageTemplate: '<img ng-src="' + payload.message.image + '" err-src="images/logo_missing.png"><span class="content"><h3 class="header">' + payload.message.username + '</h3><p>' + ((payload.message.vote) ? 'Liked' : 'Disliked') + ' this song!</p></span>',
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
						}, true);
						callback(randomTrack);
					});
				}
			}
		});
	}
	function bufferNext(player) {
		$scope.last_track = $scope.track;
		emptyQueue(function(randomTrack) {
			if (youtubeURL(player.target.getVideoUrl()) !== randomTrack.get('youtube')[0]) {
				console.log('track buffer:');
				console.log(randomTrack);
				$scope.buffer = randomTrack;
				player.target.loadVideoById(randomTrack.get('youtube')[0]);
				player.target.setPlaybackQuality('small');
				player.target.playVideo();
				player.target.pauseVideo();
			}
		}, false);
	}
	function initalizePlayer() {
		$scope.partyMode = true;
		$scope.alphaPlayer = ($scope.playerEvent2.target.getPlayerState() === YT.PlayerState.ENDED || $scope.playerEvent.target.getPlayerState() === YT.PlayerState.CUED)?$scope.playerEvent:$scope.playerEvent2;
		$scope.betaPlayer = ($scope.playerEvent.target.getPlayerState() === YT.PlayerState.ENDED || $scope.playerEvent.target.getPlayerState() === YT.PlayerState.CUED || $scope.partyMode)?$scope.playerEvent2:$scope.playerEvent;
		console.log($scope.alphaPlayer);
		console.log($scope.betaPlayer);
		if ($scope.alphaPlayer.target.getPlayerState() === YT.PlayerState.PAUSED) {
			$scope.alphaPlayer.target.playVideo();
			activateBar();
			$scope.buffer.set('isActive', true);
			$scope.buffer.save(null, {
				success: function() {
					var relation = $scope.box.relation('playerVideo');
					relation.add($scope.buffer);
					$scope.box.set('playingImg', $scope.buffer.get('image'));
					$scope.box.save();
					$scope.$apply();
				}
			});
			bufferNext($scope.betaPlayer);
		}else {
			getSong(function(track) {
				$scope.track = track;
				if ($scope.track) {
					if (youtubeURL($scope.alphaPlayer.target.getVideoUrl()) !== $scope.track.get('youtube')[0]) {
						$scope.alphaPlayer.target.loadVideoById($scope.track.get('youtube')[0]);
						$scope.alphaPlayer.target.setPlaybackQuality('small');
						activateBar();
						$scope.box.set('playingImg', $scope.track.get('image'));
						$scope.box.save();
						$scope.track.set('isActive', true);
						$scope.track.save();
						$scope.isLoadingPlayer1 = ($scope.alphaPlayer.id === 'player1')?true:false;
						$scope.isLoadingPlayer2 = ($scope.alphaPlayer.id === 'player2')?true:false;
						if ($scope.partyMode) {
							bufferNext($scope.betaPlayer);
						}
					}
				}
			});
		}
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

	function emptyQueue(emptycallback, save) {
		function saveTrack(imvdbTrack, callback, saved) {
			$http.get(
				'http://imvdb.com/api/v1/video/' + String(imvdbTrack.id) + '?include=sources,featured',
				{
					timeout: 8000
				}
			).success(function(data) {
				var sources = data.sources,
					youtubeKey = [];
				for (var key in sources) {
					if (sources[key].source === 'youtube') {
						youtubeKey.push(sources[key].source_data);
					}
				}
				if (key !== null && youtubeKey.length > 0) {
					var Videos = Parse.Object.extend('Videos');
					var video = new Videos();
					var relation = $scope.box.relation('playerVideo');
					video.set('image', imvdbTrack.image.l);
					video.set('IMVDBtrackId', String(imvdbTrack.id));
					video.set('artistInfo', imvdbTrack.artists[0].name);
					var featuredArtist = [imvdbTrack.artists[0].name];
					for (var i = 0; i < data.featured_artists.length; i++) {
						featuredArtist.push(data.featured_artists[i].name);
					}
					video.set('featuredArtist', featuredArtist);
					video.set('IMVDBartistId', imvdbTrack.artists[0].slug);
					video.set('playerId', $scope.box);
					video.set('trackInfo', imvdbTrack.song_title);
					video.set('year', parseInt(imvdbTrack.year, 10));
					video.set('youtube', youtubeKey);
					video.set('upVotes', 0);
					video.set('downVotes', 0);
					if (saved) {
						video.save(null, {
							success: function() {
								relation.add(video);
								$scope.box.save();
								callback(video);
								$scope.$apply();
							}
						});
					}else {
						callback(video);
					}
				}else {
					callback();
				}
			}).error(function() {
				initalizePlayer();
			});
		}

		function getSongInfo(parseTrack, callback, saved) {
			$http.get(
				'http://imvdb.com/api/v1/search/videos?q=' + parseTrack.get('artistTitle'), 
				{
					timeout: 8000
				}
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
						}, saved);
					} else {
						saveTrack(data.results[i], function(savedTrack) {
							callback(savedTrack);
						}, saved);
					}
				}
			}).error(function() {
				initalizePlayer();
			});
		}

		function randomTopSong(callback, saved) {
			var Browse = Parse.Object.extend('Browse');
			var query = new Parse.Query(Browse);
			query.equalTo('section', 1);
			query.ascending('artistOrder');
			query.find({
				success: function(results) {
					getSongInfo(results[Math.floor(Math.random() * results.length)], function(trackInfo) {
						callback(trackInfo);
					}, saved);
					$scope.$apply();
				}, error:function() {
					initalizePlayer();
				}
			});
		}

		function getAsFeatured(callback, saved) {
			$http.get(
				'http://imvdb.com/api/v1/search/entities?q=' + $scope.last_track.get('IMVDBartistId'), 
				{
					timeout: 8000
				}
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
										}, saved);
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
			}).error(function() {
				callback();
			});
		}

		function getEchoNest(callback, saved) {
			var artist = ($scope.last_track) ? $scope.last_track.get('artistInfo') : 'Drake',
				promise = $q.all(null);
			Echonest.artists.get({
				name: artist,
			}).then(function(artist) {
				$http.get(
					'http://developer.echonest.com/api/v4/artist/similar?api_key=0NPSO7NBLICGX3CWQ&id=' + artist.id + '&format=json&results=5&start=0', 
					{
						timeout: 8000
					}
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
												}, saved);
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
						}, save);
					}
				}, save);
			}
		}, save);
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
		var duration = parseInt($scope.alphaPlayer.target.getDuration(), 10),
			multipler = 0;
		$scope.videoInterval = $interval(function() {
			var time = parseInt($scope.alphaPlayer.target.getCurrentTime(), 10);
			if ($scope.alphaPlayer.target.getPlayerState() === YT.PlayerState.PLAYING) {
				if (time >= (duration - 3)) {
					$scope.loading = true;
				}
			}
			if ($scope.track.get('featuredArtist')) {
				if (Math.ceil(time) === (30 * (multipler + 1)) && $scope.track.get('featuredArtist').length > multipler) {
					window.artistSearch = function(data) {
						var artistObj = data.resultsPage.results.artist;
						for (var i = 0; i < artistObj.length; i++) {
							if (artistObj[i].displayName.toLowerCase() === $scope.track.get('featuredArtist')[multipler].toLowerCase()) {
								var id = artistObj[i].id;
								window.artistEventSearch = function(data) {
									if (!lodash.isEmpty(data.resultsPage.results)) {
										var eventObj = data.resultsPage.results.event;
										for (var i = 0; i < eventObj.length; i++) {
											if (distance(eventObj[i].location.lat, eventObj[i].location.lng, $scope.box.get('latlng').latitude, $scope.box.get('latlng').longitude, 'M') <= 50) {
												notify({
													messageTemplate: '<img ng-src="/images/songkick-logo.png"><span class="content"><h3 class="header">' + eventObj[i].performance[0].artist.displayName + ' is coming to your area!</h3><p>' + eventObj[i].venue.displayName + '</p><p>' + eventObj[i].venue.metroArea.displayName + ', ' + eventObj[i].venue.metroArea.state.displayName + ' ' + eventObj[i].venue.metroArea.country.displayName + '</p><p>' + moment(eventObj[i].start.date + ' ' + eventObj[i].start.time).format('dddd, MMMM Do YYYY, h:mm a') + '</p></span>',
													classes: 'activity-modal',
													duration: 25000,
													position: 'left'
												});
												PubNub.ngPublish({
													channel: $scope.box.id,
													message: {
														'type': 'concert',
														'title': eventObj[i].performance[0].artist.displayName + ' is coming to your area!',
														'msg': eventObj[i].venue.displayName + '\n' + eventObj[i].venue.metroArea.displayName + ', ' + eventObj[i].venue.metroArea.state.displayName + ' ' + eventObj[i].venue.metroArea.country.displayName + '\n' + moment(eventObj[i].start.date + ' ' + eventObj[i].start.time).format('dddd, MMMM Do YYYY, h:mm a'),
														'image': $location.protocol() + $location.host() + '/images/songkick-logo.png'
													}
												});
												break;
											}
										}
									}
								};
								$http.jsonp('http://api.songkick.com/api/3.0/artists/' + id + '/calendar.json?jsoncallback=artistEventSearch&apikey=LFxJG3ohVpIBASF5');
							}
						}
						multipler++;
					};
					$http.jsonp('http://api.songkick.com/api/3.0/search/artists.json?jsoncallback=artistSearch&apikey=LFxJG3ohVpIBASF5&query=' + $scope.track.get('featuredArtist')[multipler]);
				}
			}
		}, 1000);
	}
	$scope.onError = function() {//Needs to be reconfigured, should be watching Beta not Alpha
		$scope.track.get('youtube').splice(0, 1);
		$scope.track.save();
		if ($scope.track.get('youtube')) {
			$scope.playerEvent.target.loadVideoById($scope.track.get('youtube')[0]);
			$scope.playerEvent.target.setPlaybackQuality('small');
		} else {
			//Find Another Song
			songEnded();
			notify({
				messageTemplate: '<span class="content"><h3 class="header">The was a small hiccup</h3><p>It seems we couldn\'t play this video</p></span>',
				classes: 'activity-modal'
			});
			var VideoErrors = Parse.Object.extend('VideoErrors');
			var videoErrors = new VideoErrors();

			videoErrors.set('IMVDBartistId', $scope.track.get('IMVDBartistId'));
			videoErrors.set('IMVDBtrackId', $scope.track.get('IMVDBtrackId'));
			videoErrors.set('playerId', $scope.track.get('playerId'));
			videoErrors.set('trackInfo', $scope.track.get('trackInfo'));
			videoErrors.set('userId', $scope.track.get('userId'));
			videoErrors.set('youtube', $scope.track.get('youtube'));

			videoErrors.save();
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
		event.id = 'player1';
		$scope.playerEvent = event;
		isReady();
		
	};
	$scope.onReady2 = function(event) {
		event.id = 'player2';
		$scope.playerEvent2 = event;
		isReady();
	};
	function isReady() {
		console.log($scope.init);
		if ($scope.init <= 1) {
			if ($scope.isBox) {
				$scope.openPlayerSetupDialog();
			}
		}else {
			$scope.init--;
			console.log($scope.init);
		}
	}
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
							$scope.box.set('isActive', true);
							$scope.box.save();
							pubNubFub();
							initalizePlayer();
						} else {
							openModal();
						}
						document.cookie='boxCode='+ $scope.$storage.boxCode +'; expires=Thu, 18 Dec 2020 12:00:00 UTC';
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