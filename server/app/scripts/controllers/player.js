'use strict';
angular.module('MVPlayer').controller('PlayerCtrl', ['$scope', '$rootScope', '$location', '$localStorage', 'ngDialog', 'PubNub', 'Echonest', '$window', '$timeout', '$http', '$q', 'notify', 'lodash', function ($scope, $rootScope, $location, $localStorage, ngDialog, PubNub, Echonest, $window, $timeout, $http, $q, notify, lodash) {
	/*global $:false */
	/*global Parse*/
	/*global YT*/
	/*jshint camelcase: false */
	PubNub.init({
		publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',// jshint ignore:line
		subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'// jshint ignore:line
	});
	$rootScope.bodyClass = 'Player';
	$scope.isBox = ($location.path().indexOf('box') > -1) ? true : false;
	$scope.detonate = null;
	$scope.loading = false;
	$scope.$storage = $localStorage.$default({
		boxCode: null
	});
	$scope.player = {
		width: $(window).width(),
		height: $(window).height(),
		videoId: 'UpRssA0CQ0E',
		playerVars: {
			controls: 0,
			disablekb: 0,
			showinfo: 0,
			rel: 0,
			iv_load_policy: 3,// jshint ignore:line
			autoplay: 0
		}
	};
	notify.config({duration: 8000, position: 'right'});
	function pubNubFub() {
		PubNub.ngSubscribe({channel: $scope.box.id});
		$rootScope.$on(PubNub.ngMsgEv($scope.box.id), function(event, payload) {
			if (payload.message.type === 'player_update') {
				var Player = Parse.Object.extend('Player');
				var player = new Player();
				player.set('isSetup', true);
				player.save().then(function(obj) {
					$scope.box = obj;
					ngDialog.closeAll();
					initalizePlayer();
				}, function(error) {
					$window.alert('Failed to initalize new player, with error code: ' + error.message);
				});
			}else if (payload.message.type === 'song_added') {
				notify({messageTemplate:'<img ng-src="'+payload.message.image+'"><span class="content"><h3 class="header">'+payload.message.username+' just added a song</h3><p>'+payload.message.artist+' - '+payload.message.track+'</p></span>', classes: 'activity-modal' } );
			}else if (payload.message.type === 'chat_added') {
				//notify({messageTemplate:'<span><img ng-src="'+ payload.message.userimage+'""><p><strong>'+payload.message.username+':&nbsp;</stong>'+chat.get('text')+'</p></span>', position: 'right'} );
			}else if (payload.message.type === 'vote_added') {
				notify({messageTemplate:'<span><img ng-src="'+ payload.message.userimage+'""><p><strong>'+payload.message.username+':&nbsp;</stong>Likes this song!</p></span>', position: 'right'} );
				if (true) {//number of people in row vs number of downvotes
					activateSongChange();
				}
			}
		});
	}
	function activateSongChange() {

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
	function youtubeURL(url) {// jshint ignore:line
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
		$scope.box.relation('playerVideo').query().limit(1).ascending('createdAt').find({
			success: function(queue) {
				if (!lodash.isEmpty(queue)) {
					callback(queue[0]);
				} else {
					emptyQueue(function(randomTrack) {
						PubNub.ngPublish({
							channel: $scope.box.id,
							message: {'type': 'song_added', 'id': video.id, 'username': undefined, 'image': randomTrack.get('image'), 'artist': randomTrack.get('artistInfo'), 'track': randomTrack.get('trackInfo')}
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
			$scope.$apply();
			console.log($scope.track);
			if ($scope.track) {
				if (youtubeURL($scope.playerEvent.target.getVideoUrl()) !== $scope.track.get('youtubeId')) {
					$scope.playerEvent.target.loadVideoById($scope.track.get('youtubeId'));
					$scope.playerEvent.target.setPlaybackQuality('small');
					activateBar();
					$scope.loading = false;
					$scope.box.set('playingImg', $scope.track.get('image'))
					$scope.box.save();
				}
			}
		});
	}
	function deleteSong() {
		$scope.last_track = $scope.track;
		$scope.track.destroy();
	}
	function emptyQueue(emptycallback) {
		function saveTrack(imvdbTrack, callback) {
			$http.get(
				'http://imvdb.com/api/v1/video/' + String(imvdbTrack.id) + '?include=sources'
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
					}else {
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
					getSongInfo(results[Math.floor(Math.random()*results.length)], function(trackInfo) {
						callback(trackInfo);
					});
					$scope.$apply();
				}
			});
		}
		function getEchoNest(callback) {
			var artist = ($scope.last_track)?$scope.last_track.get('artistInfo') : 'Drake',
				promise = $q.all(null);
			Echonest.artists.get({
				name: artist,
			}).then(function(artist) {
				$http.get(
					'http://developer.echonest.com/api/v4/artist/similar?api_key=0NPSO7NBLICGX3CWQ&id='+artist.id+'&format=json&results=5&start=0'
				).success(function(data) {
					var similar = data.response.artists,
						found = false;
					angular.forEach(similar, function(video) {
						promise = promise.then(function(){
							if (!found) {
								var ran = Math.floor(Math.random()*similar.length);
								return $http.get(
									'http://imvdb.com/api/v1/search/videos?q=' + encodeURI(similar[ran].name)
								).success(function(data) {
									if (data.total_results !== 0) {
										var ran2 = Math.floor(Math.random()*data.results.length);
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
					promise.then(function(){
						if (!found) {
							console.log('not found');
							callback();
						}
					});
				});
			});
		}
		getEchoNest(function(track) {
			if (track) {
				emptycallback(track);
			}else {
				randomTopSong(function(track) {
					emptycallback(track);
				});
			}
		});
	}

	function activateBar() {
		setTimeout(function() {
			$('#currentlyPlaying').removeClass('active');
		}, 60000);
	}
	function songEnded() {
		$scope.loading = true;
		PubNub.ngPublish({
			channel: $scope.box.id,
			message: {type: 'song_delete', id: $scope.track.id}
		});
		deleteSong();
		initalizePlayer();
	}
	function detonate() {
		/*$timeout.cancel($scope.detonate);
		$scope.detonate = $timeout(function() {
			songEnded();
			detonate();
		}, 10000);*/
	}
	$scope.onError = function() {
		//Find Another Song
		songEnded();
	};
	$scope.onStateChange = function(event) {
		if (event.data === YT.PlayerState.ENDED) {
			songEnded();
			detonate();
		} else if (event.data === YT.PlayerState.PLAYING) {
			$('#currentlyPlaying').addClass('active');
			if ($scope.detonate !== null) {
				//$timeout.cancel($scope.detonate);
				//$scope.detonate = null;
			}
		}
	};
	$scope.onReady = function(event) {
		$scope.playerEvent = event;
		if($scope.isBox) {
			$scope.openPlayerSetupDialog();
		}
	};
	$scope.onApiLoadingFailure = function(controller) {
		controller.reload();
	};
	$scope.openPlayerSetupDialog = function() {
		if ($scope.$storage.boxCode === null) {
			getID();
		}else {
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
						}else {
							openModal();
						}
					}else {
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