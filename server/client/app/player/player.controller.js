'use strict';

var serverApp = angular.module('serverApp');
serverApp.controller('PlayerCtrl', function($scope, socket, ngDialog, $location, $cookies) {
        Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');
        $scope.currentUser = Parse.User.current() || null;
        $scope.room = ($location.path().indexOf('debug') > -1) ? 'n0qTfjo7eN' : $cookies.room;
        $scope.isDebug = ($location.path().indexOf('debug') > -1) ? true : false;
        $scope.isBox = ($location.path().indexOf('box') > -1) ? true : false;
        $scope.isCode = ($location.path().indexOf('code') > -1) ? true : false;
        $scope.boxCode = genID(6);
        $scope.domain = window.location.hostname;
        $scope.event = {};
        $scope.voteoff = {};
        $scope.voteoff.bannerLocation = 'bottom';
        $scope.detonate = null;
        $scope.onReady = function(event) {
            var player = event.target;
            $scope.event = event;
            if (!$scope.currentUser && !$scope.isBox && !$scope.isDebug) {
                ngDialog.open({
                    template: 'loginTmpl',
                    controller: 'UserCtrl',
                    className: 'ngdialog-theme-login ngdialog-theme-default',
                    showClose: false,
                    closeByEscape: false,
                    closeByDocument: false,
                    scope: $scope
                });
            }
            if ($scope.room !== null && $scope.room !== undefined && !$scope.isCode && ($scope.currentUser || $scope.isDebug)) {
                initPlayer(player);
            } else {
                if (!$scope.isBox) {
                    if ($scope.currentUser) {
                        openPlayerSetupDialog(ngDialog);
                    }
                } else {
                    ngDialog.open({
                        template: 'boxSetupTmpl',
                        showClose: false,
                        closeByEscape: false,
                        closeByDocument: false,
                        scope: $scope
                    });
                }
            }
        };
        $scope.onStateChange = function(event) {
            function songEnded() {
                socket.emit('song:ended', {
                    room: $scope.room,
                    trackId: $scope.queueList[0].objectId,
                    artistInfo: $scope.queueList[0].artistInfo
                });
            }

            function detonate() {
                window.clearTimeout($scope.detonate);
                $scope.detonate = setTimeout(function() {
                    songEnded();
                    detonate();
                }, 10000);
            }
            if (event.data === YT.PlayerState.ENDED) {
                songEnded();
                detonate();
            } else if (event.data === YT.PlayerState.PLAYING) {
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

        };
        $scope.onApiLoadingFailure = function(controller) {
            controller.reload(); // try load youtube api again
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
                iv_load_policy: 3,
                autoplay: 0
            }
        };
        socket.on('connect', function() {
            socket.on('playlist:change', function(msg) {
                var player = $scope.event.target,
                    event = $scope.event;
                $scope.queueList = msg;
                if (youtubeURL(player.getVideoUrl()) !== $scope.queueList[0].youtubeId) {
                    player.loadVideoById($scope.queueList[0].youtubeId);
                    $('#currentlyPlaying').addClass('active');
                    activateBar();
                } else {
                    if (event.data === YT.PlayerState.ENDED || event.data === YT.PlayerState.PAUSED) {
                        player.setPlaybackQuality('small');
                        player.playVideo();
                    }
                }
            });
            socket.on('player:init', function(msg) {
                var player = $scope.event.target;
                if (msg.room === $cookies.room || ($scope.isBox && $scope.boxCode === msg.boxCode)) {
                    $cookies.room = msg.room;
                    $scope.room = $cookies.room;
                    if (!$scope.isCode) {
                        initPlayer(player);
                        ngDialog.closeAll();
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
                    title: String(msg.userName) + ' ' + ((String(msg.voteChoice) === 'upvote') ? 'liked' : 'disliked') + ' this song!',
                    image: '/assets/images/thumbs-' + ((String(msg.voteChoice) === 'upvote') ? 'up' : 'down') + '.png'
                });
                if (downvote / voteNum >= 0.53 && voteNum >= 2) {
                    $scope.voteoff = {};
                    $scope.voteoff.count = 10;
                    $scope.voteoff.bannerLocation = 'active center';
                    console.log('vote off');
                    var countdown = setInterval(function() {
                        $scope.voteoff.count = $scope.voteoff.count--;
                    }, 1000);
                    setTimeout(function() {
                        $scope.voteoff.bannerLocation = 'active top';
                        clearInterval(countdown);
                        setTimeout(function() {
                            $scope.voteoff.bannerLocation = 'bottom';
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

        function initPlayer(player) {
            if (!$scope.isCode) {
                socket.emit('server:init', {
                    room: $scope.room
                }, function(confirm) {
                    $scope.queueList = confirm;
                    if (youtubeURL(player.getVideoUrl()) !== $scope.queueList[0].youtubeId) {
                        player.loadVideoById($scope.queueList[0].youtubeId);
                        player.setPlaybackQuality('small');
                        activateBar();
                    }
                });
            }
        }

        function activateBar() {
            setTimeout(function() {
                $('#currentlyPlaying').removeClass('active');
            }, 60000);
        }

    }).controller('SetupCtrl', function($scope, ngDialog) {
        $scope.startPlayer = function() {
            ngDialog.close();
        };
    })
    .controller('UserCtrl', function($scope, ngDialog) {
        $scope.doLogin = function(isValid) {
            isValid = true;
            if (isValid) {
                var user = new Parse.User({
                    username: $('.login-form').find('#login-username').val(),
                    password: $('.login-form').find('#login-pass').val()
                });
                user.logIn({
                    success: function(user) {
                        $scope.currentUser = user;
                        $scope.$apply();
                        ngDialog.closeAll();
                        if (!$scope.isBox) {
                            openPlayerSetupDialog(ngDialog);
                        }
                    },
                    error: function(user, error) {
                        alert('Unable to log in: ' + error.code + ' ' + error.message);
                    }
                });
            }
        };
        $scope.doSignup = function(isValid) {
            isValid = true;
            if (isValid) {
                var user = new Parse.User();
                user.set('username', $('.signup-form').find('#signup-username').val()); // in my app, email==username
                user.set('password', $('.signup-form').find('#signup-pass').val());
                user.signUp(null, {
                    success: function(user) {
                        $scope.currentUser = user;
                        $scope.$apply(); // Notify AngularJS to sync currentUser
                        ngDialog.closeAll();
                        if (!$scope.isBox) {
                            openPlayerSetupDialog(ngDialog);
                        }
                    },
                    error: function(user, error) {
                        alert('Unable to sign up:  ' + error.code + ' ' + error.message);
                    }
                });
            }
        };
        $scope.switchModal = function(modal) {
            $('.'+modal).addClass('active').siblings().removeClass('active');
        };
    })


function genID(length) {
    var text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function openPlayerSetupDialog(ngDialog) {
    ngDialog.open({
        template: 'playerSetupTmpl',
        controller: 'SetupCtrl',
        showClose: false,
        closeByEscape: false,
        closeByDocument: false,
        className: 'ngdialog-theme-player ngdialog-theme-default'
    });
}