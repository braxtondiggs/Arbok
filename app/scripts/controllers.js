'use strict';

angular.module('Alma.controllers', [])
	.controller('AppCtrl', ['$scope', '$rootScope', '$state', '$ionicModal', '$ionicSlideBoxDelegate', '$ionicSideMenuDelegate', '$ionicScrollDelegate', '$cordovaDialogs', '$cordovaVibration', '$cordovaKeyboard', '$cordovaToast', '$ionicLoading', '$ionicHistory', '$localStorage', '$timeout', 'lodash', 'PubNub', 'MusicService', function($scope, $rootScope, $state, $ionicModal, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicScrollDelegate, $cordovaDialogs, $cordovaVibration, $cordovaKeyboard, $cordovaToast, $ionicLoading, $ionicHistory, $localStorage, $timeout, lodash, PubNub, MusicService) {
		/*global Parse*/
		/*global ionic*/
		/* global DollarRecognizer */
		/* global Point */
		/*jshint camelcase: false */
		$rootScope.currentUser = Parse.User.current();
		$scope.vote = {
			panel:false,
			track: null
		};
		$scope.canvas = {
			isMOuseDown: false,
			threshold: 3
		};
		$scope.$storage = $localStorage.$default({
			'connectedPlayer': null
		});
		var user = $rootScope.currentUser;
		if (user.get('connectedPlayer')) {
			$scope.$storage.connectedPlayer = user.get('connectedPlayer').id;
		}
		var _r = new DollarRecognizer();
		var _points = [];
		var canvas;
		var ctx;
		PubNub.init({
			publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',
			subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'
		});
		function onResume() {
			if ($scope.$storage.connectedPlayer) {
				PubNub.ngSubscribe({channel: $scope.$storage.connectedPlayer});
			}
		}
		/*function onPause() {
			if ($scope.$storage.connectedPlayer) {
				PubNub.ngUnsubscribe({channel: $scope.$storage.connectedPlayer});
			}
		}*/
		$scope.activateVote = function(videoObj) {
			var user = $rootScope.currentUser;
			var index = 0;
			for (var i = 0; i < $scope.queue.length; i++) {
				if ($scope.queue[i].id === videoObj.id) {
					index = i;
					break;
				}
			}
			if (!lodash.isEmpty(user)) {
				if (ionic.Platform.isWebView()) {
					$cordovaVibration.vibrate(100);
				}
				if ($ionicSideMenuDelegate.isOpenRight() === true) {
					$ionicSideMenuDelegate.toggleRight();
				}
				var Vote = Parse.Object.extend('Vote');
				var query = new Parse.Query(Vote);
				query.equalTo('userId', user);
				query.equalTo('videoId', $scope.queue[index]);
				query.limit(1);
				query.find({
					success: function(vote) {
						if ($scope.queue[index]) {
							if (!lodash.isEmpty(vote)) {
								$scope.queue[index].vote = vote[0].get('vote');
							}
							var track = $scope.queue[index];
							var action = (track.vote === true || track.vote === false)?track.vote:null;
							$scope.vote = {
								panel: true,
								track: track,
								action: action,
								isSet: (track.vote === true || track.vote === false)?true:false,
								index: index,
								isChanged: (track.vote === true || track.vote === false)?true:false
							};
							$scope.$apply();
						}
						$ionicSideMenuDelegate.canDragContent(false);
					}
				});
			}else {
				$cordovaDialogs.alert('You need to be logged inorder to vote for this song!', 'Alma - Error');
			}
		};
		$scope.voteAction = function(action) {
			$scope.vote.action = action;
			$scope.vote.isChanged = false;
			var Vote = Parse.Object.extend('Vote');
			var vote = new Vote();
			//var relation = $scope.vote.track.relation('trackVotes');
			//var relation2 = user.get('connectedPlayer').relation('playerVotes');
			function closeVote(voteFn, trackId) {
				PubNub.ngPublish({
					channel: $scope.$storage.connectedPlayer,
					message: {'type': 'vote', 'id': trackId, 'username': user.get('name'), 'image': (user.get('image'))?user.get('image')._url:'/images/missingPerson.jpg', 'vote': action, 'selectedTrack': vote.get('artistName') + ' - ' + vote.get('trackTitle')}
				});
				if (ionic.Platform.isWebView()) {
					$cordovaVibration.vibrate(100);
					$timeout(function() {
						$cordovaToast.show('Vote successful', 'short', 'bottom');
					}, 3000);
				}else {
					console.log('Vote: '  + String(action));
				}
			}
			if (!$scope.vote.isSet) {
				vote.set('userId', user);
				vote.set('playerId', user.get('connectedPlayer'));
				vote.set('videoId', $scope.vote.track);
				vote.set('image', $scope.vote.track.get('image'));
				vote.set('artistName', $scope.vote.track.get('artistInfo'));
				vote.set('trackTitle', $scope.vote.track.get('trackInfo'));
				vote.set('trackId', $scope.vote.track.get('IMVDBtrackId'));
				vote.set('artistSlug', $scope.vote.track.get('IMVDBartistId'));
				vote.set('vote', action);
				vote.save(null, {
					success: function() {
						//relation.add(vote);
						//relation2.add(vote);
						var name = (action)?'upVotes':'downVotes';
						$scope.vote.track.set(name, (parseInt($scope.vote.track.get(name), 10))?parseInt($scope.vote.track.get(name), 10) + 1:1);
						$scope.vote.track.save();
						closeVote(vote, $scope.vote.track.id);
					}
				});
			}else {
				if (action !== $scope.queue[$scope.vote.index].vote) {
					var query = new Parse.Query(Vote);
					query.equalTo('userId', user);
					query.equalTo('videoId', $scope.vote.track);
					query.limit(1);
					query.find({
						success: function(vote) {
							vote[0].set('vote', action);
							vote[0].save(null, {
								success: function() {
									var name = (action)?'upVotes':'downVotes',
										name2 = (action)?'downVotes':'upVotes';
									$scope.vote.track.set(name, parseInt($scope.vote.track.get(name), 10) + 1);
									$scope.vote.track.set(name2, parseInt($scope.vote.track.get(name2), 10) - 1);
									$scope.vote.track.save();
									closeVote(vote[0]);
								}
							});
						}
					});
				}
			}
			$scope.queue[$scope.vote.index].vote = action;
			$timeout(function() {
				$ionicSideMenuDelegate.canDragContent(true);
				$scope.vote = {
					panel:false,
					track: null
				};
			}, 3000);
		};
		$scope.canvas.init = function() {
			canvas = document.getElementById('canvas');
			ctx = canvas.getContext('2d');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		$scope.canvas.touchstart = function(e) {
			e.preventDefault();
			_points = [];
			ctx.beginPath();
			ctx.strokeStyle = '#bae1ff';
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.lineWidth = 6;
			$scope.canvas.oldX = e.gesture.center.pageX;
			$scope.canvas.oldY = e.gesture.center.pageY;
		};
		
		$scope.canvas.touchmove = function(e) {
			if ($scope.canvas.oldX - e.gesture.center.pageX < 3 && $scope.canvas.oldX - e.gesture.center.pageX > -3) {
				return;
			}
			if ($scope.canvas.oldY - e.gesture.center.pageY < 3 && $scope.canvas.oldY - e.gesture.center.pageY > -3) {
				return;
			}
			ctx.moveTo($scope.canvas.oldX, $scope.canvas.oldY);
			$scope.canvas.oldX = e.gesture.center.pageX;
			$scope.canvas.oldY = e.gesture.center.pageY;
			ctx.lineTo($scope.canvas.oldX, $scope.canvas.oldY);
			ctx.stroke();
			ctx.shadowColor = 'rgba(169,236,255,0.25)';
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 10;
			_points[_points.length] = new Point($scope.canvas.oldX, $scope.canvas.oldY);
		};
		// MOUSE BINDS FOR THE HELL OF IT
		$scope.canvas.mousedown =  function(e) {
			$scope.canvas.isMouseDown = true;
			e.preventDefault();
			_points = [];
			ctx.beginPath();
			ctx.strokeStyle = '#bae1ff';
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.lineWidth = 6;
			ctx.shadowColor = 'rgba(169,236,255,0.1)';
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 10;
			$scope.canvas.oldX = e.offsetX;
			$scope.canvas.oldY = e.offsetY;
		};
		
		$scope.canvas.mousemove = function(e) {
			if (!$scope.canvas.isMouseDown) {
				return;
			}
			if ($scope.canvas.oldX - e.offsetX < 3 && $scope.canvas.oldX - e.offsetX > -3) {
				return;
			}
			if ($scope.canvas.oldY - e.offsetY < 3 && $scope.canvas.oldY - e.offsetY > -3) {
				return;
			}
			ctx.moveTo($scope.canvas.oldX, $scope.canvas.oldY);
			$scope.canvas.oldX = e.offsetX;
			$scope.canvas.oldY = e.offsetY;
			ctx.lineTo($scope.canvas.oldX, $scope.canvas.oldY);
			ctx.stroke();
			_points[_points.length] = new Point($scope.canvas.oldX, $scope.canvas.oldY);
		};
		
		$scope.canvas.gestureEnd = function(isMouse) {
			if (isMouse) {
				$scope.canvas.isMouseDown = false;
			}
			
			function gestureErr() {
				if (ionic.Platform.isWebView()) {
					$cordovaVibration.vibrate(100);
					$cordovaToast.show('We could not not recognize your gesture, please make a check or cross geasture to vote ', 'short', 'bottom');
				}else {
					console.log('Gesture Error');
				}
			}
			ctx.closePath();
			if (_points.length >= 10) {
				var result = _r.Recognize(_points);
				if (Math.round(result.Score*100) >= 50) {
					var name = result.Name.toLowerCase();
					if(name === 'check' || name === 'v') {
						$scope.voteAction(true);
					}else if(name === 'delete' || name === 'x' || name === 'pigtail') {
						$scope.voteAction(false);
					}else {
						gestureErr();
					}
				}else {
					gestureErr();
				}
			}
			_points = [];
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		};
		//Login
		$rootScope.login = function() {
			if (window.cordova && window.cordova.plugins.Keyboard) {
				$cordovaKeyboard.disableScroll(true);
			}
			$scope.modal.show();
			$ionicSlideBoxDelegate.enableSlide(false);
			$scope.login.title = 'Login';
		};
		$scope.signupPage = function() {
			$scope.login.title = 'Signup';
			$ionicSlideBoxDelegate.slide(0);
		};
		$scope.loginPage = function() {
			$scope.login.title = 'Login';
			$ionicSlideBoxDelegate.slide(1);
		};
		$scope.closeLogin = function(alert) {
			$scope.modal.hide().then(function() {
				if (window.cordova && window.cordova.plugins.Keyboard) {
					$cordovaKeyboard.disableScroll(false);
				}
				if (alert) {
					$cordovaDialogs.alert('Welcome, you are currently logged in! You can now chat and suggest songs!', 'Alma');
				}
			});
		};
		$scope.logout = function() {
			$cordovaDialogs.confirm('Are you sure you want to logout?', 'Alma').then(function(res) {
				if (res === 1) {
					if ($ionicSideMenuDelegate.isOpenLeft() === true) {
						$ionicSideMenuDelegate.toggleLeft();
					}
					Parse.User.logOut();
					$localStorage.$reset();
					$ionicHistory.nextViewOptions({
						historyRoot: true
					});
					delete $rootScope.currentUser;
					var current = $ionicHistory.currentView();
					if (current.stateName === 'app.settings'  || current.stateName === 'app.profile') {
						$state.transitionTo('app.dashboard');
						$ionicHistory.nextViewOptions({
							historyRoot: true
						});
					}
					$cordovaDialogs.alert('You have been successfully logged out', 'Alma');
				}
			});
		};
		$ionicModal.fromTemplateUrl('templates/modal/login.html', {
			scope: $scope,
			controller: 'LoginCtrl'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		if ($scope.$storage.connectedPlayer) {
			MusicService.subscribeToPlayer($scope.$storage.connectedPlayer);
		}
		$rootScope.$watch('queue', function() {
			for (var i = 0; i < $rootScope.queue.length; i++) {
				if ($rootScope.queue[i].get('isActive') === true) {
					$rootScope.firstQueue = $rootScope.queue[i];
					$rootScope.firstQueue.index = i;
					break;
				}
			}
	   	});
		document.addEventListener('resume', onResume, false);
		//document.addEventListener('pause', onPause, false);
	}]);