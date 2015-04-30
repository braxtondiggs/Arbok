'use strict';
angular.module('MVPlayer').controller('PlayerCtrl', ['$scope', '$rootScope', '$location', '$localStorage', 'ngDialog', 'PubNub', '$window', function ($scope, $rootScope, $location, $localStorage, ngDialog, PubNub, $window) {
	/*global $:false */
	/*global Parse*/
	/*jshint camelcase: false */
	PubNub.init({
		publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',// jshint ignore:line
		subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'// jshint ignore:line
	});
	$rootScope.bodyClass = 'Player';
	$scope.isBox = ($location.path().indexOf('box') > -1) ? true : false;
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
			}
		});
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
		$scope.box.relation('playerVideo').query().limit(1).find({
			success: function(queue) {
				callback(queue[0]);
				$scope.$apply();
			}
		});
	}
	function initalizePlayer() {
		getSong(function(track) {
			$scope.track = track;
			if (youtubeURL($scope.playerEvent.target.getVideoUrl()) !== $scope.track.get('youtubeId')) {
				$scope.playerEvent.target.loadVideoById($scope.track.get('youtubeId'));
				$scope.playerEvent.target.setPlaybackQuality('small');
				activateBar();
			}
		});
	}

	function activateBar() {
		setTimeout(function() {
			$('#currentlyPlaying').removeClass('active');
		}, 60000);
	}
	$scope.onError = function() {
		//Find Another Song
    };
	$scope.onReady = function(event) {
        $scope.playerEvent = event;
        initalizePlayer();
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
							//initalizePlayer();
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
	if($scope.isBox) {
		$scope.openPlayerSetupDialog();
	}
}]);
