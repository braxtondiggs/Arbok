'use strict';
Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');

angular.module('Quilava.controllers', [])
    .controller('AppCtrl', function($scope, $ionicModal, socket, $http, $ionicPopup, UserService, ENV, $ionicSideMenuDelegate) {
        $scope.domain = ENV.apiEndpoint;
        $scope.isSearch = false;
        $scope.loginData = {};
        $scope.search = {};
        $scope.vote = {};
        $scope.chats = [];
        $scope.currentUser = Parse.User.current() || null;
        $scope.room = window.localStorage['room'] || null;
        $scope.hasVoted = window.localStorage['hasVoted'] || false;
        $scope.vote.voteId = window.localStorage['voteId'] || null;
        $scope.vote.selectedIndex = window.localStorage['voteselectedIndex'] || null;
        $scope.$watch('hasVoted', function() {
            window.localStorage['hasVoted'] = $scope.hasVoted;
        });
        $scope.$watch('vote.voteId', function() {
            window.localStorage['voteId'] = $scope.vote.voteId;
        });
        $scope.$watch('vote.selectedIndex', function() {
            window.localStorage['voteselectedIndex'] = $scope.vote.selectedIndex;
        });
        $scope.setSearchBar = function(val) {
            $scope.isSearch = val;
            if (val) {
                setTimeout(function() {
                    document.getElementById('search').focus();
                }, 500);
            }
        };
        $scope.checkImage = function(img) {
            return UserService.checkImage(img);
        };
        $scope.convertSlug = function(name, slug) {
            return UserService.convertSlug(name, slug);
        };
        $scope.voteClicked = function(index) {
            if ($scope.vote.selectedIndex !== index) {
                $scope.vote.selectedIndex = index;
                socket.emit('vote:client', {
                    server_id: $scope.room,
                    track_id: $scope.queue_list[0].objectId,
                    upVote: ($scope.vote.selectedIndex === 2) ? true : false,
                    downVote: ($scope.vote.selectedIndex === 1) ? true : false,
                    userId: $scope.currentUser.id,
                    userName: $scope.currentUser._serverData.username,
                    hasVoted: $scope.hasVoted,
                    voteId: $scope.vote.voteId
                });
                $scope.hasVoted = true;
            }
        }
        $scope.findSong = function(artist, title, image) {
            $http.get(
                $scope.domain + 'music/search?v=' + artist + ' ' + title
            ).success(function(data) {
                $scope.addSong(data.results[0].id, artist, title, image);
            });
        };
        $scope.addSong = function(id, name, title, image) {
            if ($scope.currentUser && $scope.room) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'MVPlayer',
                    template: 'Are you sure you want add this song?'
                });
                confirmPopup.then(function(res) {
                    if (res) {
                        var found = false;
                        for (var i = 0; i < $scope.queue_list.length; i++) {
                            if ($scope.queue_list[i].IMVDBtrackId === id) {
                                found = true;
                            }
                        }
                        if (!found) {
                            socket.emit('song:new', {
                                server_id: $scope.room,
                                track_id: id,
                                userId: $scope.currentUser.id,
                                userName: $scope.currentUser._serverData.username,
                                trackTitle: title,
                                artistName: name,
                                artistImage: image
                            }, function(confirm) {
                                if (confirm.status === 1) {
                                    $ionicPopup.alert({
                                        title: 'MVPlayer',
                                        template: "Your song is now in the queue! Sit back and jam."
                                    });
                                } else {
                                    $ionicPopup.alert({
                                        title: 'MVPlayer',
                                        template: "A Serious Error Occured, Sorry Bro!"
                                    });
                                }
                            });
                        } else {
                            $ionicPopup.alert({
                                title: 'MVPlayer - Error',
                                template: 'Looks like this song is already in the Queue.'
                            });
                        }
                    }
                });
            } else {
                var body = ($scope.currentUser) ? 'You have not connected to a MVPlayer yet.' : 'You need to be logged inorder to suggest a song',
                    location = ($scope.currentUser) ? '#/app/player' : '#/app/login';
                $ionicPopup.alert({
                    title: 'MVPlayer - Error',
                    template: body
                }).then(function(res) {
                    window.location = location;
                });
            }
        }
        $scope.doSearch = function(term) {
            $scope.search.loaded = true;
            if (term) {
                $scope.search.loaded = false;
                $http.get(
                    $scope.domain + 'music/search?v=' + term
                ).success(function(data) {
                    $scope.search.tracks = {};
                    $scope.search.tracks = data.results;
                });
                $http.get(
                    $scope.domain + 'music/search?e=' + term
                ).success(function(data) {
                    $scope.search.artists = {};
                    $scope.search.artists = data.results;
                    $scope.search.loaded = true;
                });
                window.location = '#/app/search';
            }
        };
        $scope.joinServer = function(id) {
            $scope.queue_list = {};
            socket.emit('user:init', {
                room: id
            }, function(confirm) {
                window.localStorage['room'] = id;
                $scope.room = id;
                $scope.queue_list = confirm;
                $scope.vote.upvote = confirm[0].upvoteNum;
                $scope.vote.downvote = confirm[0].downvoteNum;
                $ionicPopup.alert({
                    title: 'MVPlayer',
                    template: 'You are now joined to this player!'
                }).then(function(res) {
                    window.location = '#/app/browse';
                });
            });
            socket.emit('chat:init', {
                room: id
            }, function(confirm) {
                $scope.chats = confirm;
            });
        };
        socket.on('connect', function() {
            if ($scope.room) {
                socket.emit('user:init', {
                    room: $scope.room
                }, function(confirm) {
                    $scope.queue_list = confirm;
                    $scope.vote.upvote = confirm[0].upvoteNum;
                    $scope.vote.downvote = confirm[0].downvoteNum;
                });
                socket.emit('chat:init', {
                    room: $scope.room
                }, function(confirm) {
                    $scope.chats = confirm;
                });
            }
        });
        socket.on('playlist:playingImg', function(data) {
            //$scope.player.attributes.playingImg = data;//not going to work needs to update per player
        });
        socket.on('playlist:change', function(data) {
            if (data[0].objectId !== $scope.queue_list[0].objectId) {$scope.hasVoted = false;$scope.vote.selectedIndex = 0;$scope.vote.upvote = 0;$scope.vote.downvote=0;}
            $scope.queue_list = data;
        });
        socket.on('vote:change', function(data) {
            $scope.vote.upvote = data.upvote;
            $scope.vote.downvote = data.downvote;
            $scope.vote.voteId = data.voteId;
        });

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
                $scope.modal.hide();
            },

            // Open the login modal
            $scope.login = function() {
                $scope.modal.show();
            };

        // Perform the login action when the user submits the login form
        $scope.logout = function() {
            $ionicPopup.confirm({
                title: 'MVPlayer',
                template: 'Are you sure you want to logout?'
            }).then(function(res) {
                if (res) {
                    if ($ionicSideMenuDelegate.isOpenLeft() == true) $ionicSideMenuDelegate.toggleLeft();
                    Parse.User.logOut();
                    $scope.currentUser = null;
                    $scope.loginData = {};
                    $scope.vote.selectedIndex = 0;
                }
            });
        };
        $scope.doLogin = function(isValid) {
            if (isValid) {
                var user = new Parse.User();
                var loginData = $scope.loginData;
                user.set('username', loginData.username); // in my app, email==username
                user.set('password', loginData.password);
                if (loginData.type === 'signup') {
                    user.signUp(null, {
                        success: function(user) {
                            $scope.currentUser = user;
                            $scope.$apply(); // Notify AngularJS to sync currentUser
                            $scope.closeLogin();
                        },
                        error: function(user, error) {
                            alert('Unable to sign up:  ' + error.code + ' ' + error.message);
                        }
                    });
                } else {
                    var user = new Parse.User({
                        username: loginData.username,
                        password: loginData.password
                    });
                    user.logIn({
                        success: function(user) {
                            $scope.currentUser = user;
                            $scope.$apply();
                            $scope.closeLogin();
                        },
                        error: function(user, error) {
                            alert('Unable to log in: ' + error.code + ' ' + error.message);
                        }
                    });
                }
            }
        };
    })
    .controller('BrowseCtrl', function($scope, $stateParams, LoadingService) {
        $scope.browse = {};
        $scope.browse.id = $stateParams.browseId;
        $scope.browse.loaded = false;
        $scope.browse.sections = [{
            title: 'Best New Music Video'
        }, {
            title: 'Top Music Video of The Week'
        }, {
            title: 'Top Music Video of The Month'
        }, {
            title: 'Top Music Video of All Time'
        }];
        if ($stateParams.browseId) {
            LoadingService.showLoading();
            var Browse = Parse.Object.extend("Browse");
            var query = new Parse.Query(Browse);
            query.equalTo("section", parseInt($stateParams.browseId, 10));
            query.ascending("artistOrder");
            query.find({
                success: function(results) {
                    $scope.browse.music = results;
                    $scope.browse.loaded = true;
                    LoadingService.hideLoading();
                }
            });
        }
    })
    .controller('ArtistCtrl', function($scope, $stateParams, $http, $ionicPopup, socket, UserService) {
        $scope.artist = {};
        $scope.artist.loaded = false;
        function getArtistInfo(id) {
            $http.get(
                $scope.domain + 'music/artist?e=' + id
            ).success(function(data) {
                $scope.artist.loaded = true;
                $scope.artist.name = data.name;
                $scope.artist.slug = data.slug;
                $scope.artist.img = data.image;
                $scope.artist.videography = data.artist_videos.videos;
                $scope.artist.featured = data.featured_artist_videos.videos;
            });
        }
        var param = $stateParams;
        if (param && param.artistId && param.action) {
            if (param.action === 'id') {
                getArtistInfo(param.artistId);
            } else if (param.action === 'slug') {
                $http.get(
                    $scope.domain + 'music/search?e=' + param.artistId
                ).success(function(data) {
                    getArtistInfo(data.results[0].id);
                });
            }
        }
        $scope.checkImage = function(img) {
            return UserService.checkImage(img);
        };
        $scope.convertSlug = function(name, slug) {
            return UserService.convertSlug(name, slug);
        };
    })
    .controller('QueueCtrl', function($scope) {})
    .controller('PlayerCtrl', function($scope, socket, $ionicPopup, LoadingService) {
        LoadingService.showLoading();
        $scope.lnglat = {
            lat: 39.935080,
            lng: -78.0216020
        };
        $scope.loaded = false;
        navigator.geolocation.getCurrentPosition(onSuccess, onError);

        function onSuccess(position) {
            $scope.lnglat = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        }

        function onError(error) {
            console.log(error);
        }
        var Player = Parse.Object.extend("Player");
        var query = new Parse.Query(Player);
        var point = new Parse.GeoPoint($scope.lnglat.lat, $scope.lnglat.lng);
        query.withinMiles("latlng", point, 25);
        query.find({
            success: function(playerObjects) {
                $scope.players = playerObjects;
                $scope.$apply();
                LoadingService.hideLoading();
                $scope.loaded = true;

            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
        $scope.getDistance = function(lat1, lon1, lat2, lon2, unit) {
            var radlat1 = Math.PI * lat1 / 180
            var radlat2 = Math.PI * lat2 / 180
            var radlon1 = Math.PI * lon1 / 180
            var radlon2 = Math.PI * lon2 / 180
            var theta = lon1 - lon2
            var radtheta = Math.PI * theta / 180
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist)
            dist = dist * 180 / Math.PI
            dist = dist * 60 * 1.1515
            if (unit == "K") {
                dist = dist * 1.609344
            }
            if (unit == "N") {
                dist = dist * 0.8684
            }
            return Math.round(dist * 100) / 100;
        };
    })
    .controller('ChatCtrl', function($scope, $ionicScrollDelegate, socket, $ionicPopup, LoadingService) {
        var Chat = Parse.Object.extend("Chat");
        var query = new Parse.Query(Chat);
        LoadingService.showLoading();
        query.equalTo("room", $scope.room);
        query.ascending("createdAt");
        $scope.loaded = false;
        query.find({
            success: function(results) {
                var result = [];
                for (var i = 0; i < results.length; i++) {
                    results[i]._serverData.self = ($scope.currentUser !== null && results[i]._serverData.userId === $scope.currentUser.id) ? true : false;
                    results[i]._serverData.createdAt = moment(results[i].createdAt).format("dddd, MMMM Do YYYY, h:mm:ss a");
                    result.push(results[i]._serverData);
                }
                $scope.chats = result;
                $ionicScrollDelegate.scrollBottom();
                LoadingService.hideLoading();
                $scope.loaded = true;
            }
        });
        $scope.sendChat = function(msg) {
            var title = 'MVPlayer - Error',
                body = null;
            if (msg.chatMsg !== "") {
                if ($scope.room) {
                    if ($scope.currentUser) {
                        var img = ($scope.currentUser._serverData.image) ? $scope.currentUser._serverData.image._url : null;
                        document.getElementById('chat-input').value = '';
                        socket.emit('chat', {
                            'room': $scope.room,
                            'from': $scope.currentUser._serverData.username,
                            'userId': $scope.currentUser.id,
                            'img': img,
                            'body': msg.chatMsg
                        });
                    } else {
                        body = 'You have not connected to a MVPlayer yet.';
                        location = '#/app/player';
                    }
                } else {
                    body = 'You need to be logged inorder to suggest a song';
                    location = '#/app/login';
                }
                if (body !== null) {
                    $ionicPopup.alert({
                        title: title,
                        template: body
                    }).then(function(res) {
                        window.location = location;
                    });
                }
            }
        }

        socket.on('chat:new', function(data) {
            data.self = (data.userId === $scope.currentUser.id) ? true : false;
            data.createdAt = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
            $scope.chats.push(data);
            $ionicScrollDelegate.scrollBottom();
        });
        $scope.scrollBottom = function() {
            $ionicScrollDelegate.scrollBottom();
        };
    });