'use strict';
Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');

angular.module('Quilava.controllers', [])
    .controller('BodyCtrl', function($scope, $rootScope) {
      $scope.$on('$stateChangeStart', function(event, toState){
        $rootScope.controllerClass = toState.className;
      });
    })
    .controller('AppCtrl', function($scope, $ionicModal, socket, $http, $ionicPopup, UserService, ENV, $ionicSideMenuDelegate, $ionicHistory, $localStorage, $timeout, $ionicSlideBoxDelegate, $window) {
        $scope.domain = ENV.apiEndpoint;
        $scope.isSearch = false;
        $scope.loginData = {};
        $scope.signupData = {};
        $scope.search = {};
        $scope.vote = {};
        $scope.chats = [];
        $scope.currentUser = Parse.User.current() || null;
        $scope.room = window.localStorage['room'] || null;
        $scope.hasVoted = window.localStorage['hasVoted'] || false;
        $scope.vote.voteId = window.localStorage['voteId'] || null;
        $scope.vote.selectedIndex = window.localStorage['voteselectedIndex'] || null;
        $scope.$storage = $localStorage.$default({
            'searchHistory': []
        });
        $scope.searchHistory = $scope.$storage.searchHistory;
        $scope.$watch('hasVoted', function() {
            window.localStorage['hasVoted'] = $scope.hasVoted;
        });
        $scope.$watch('vote.voteId', function() {
            window.localStorage['voteId'] = $scope.vote.voteId;
        });
        $scope.$watch('vote.selectedIndex', function() {
            window.localStorage['voteselectedIndex'] = $scope.vote.selectedIndex;
        });
        $scope.$watch('searchHistory', function() {
            $scope.$storage.searchHistory = $scope.searchHistory;
        });
        $scope.setSearchBar = function(val) {
            $scope.isSearch = val;
            if (val) {
                $timeout(function() {
                    document.getElementById('search').focus();
                }, 500);
            }
        };
        $scope.goBack = function() {
            $ionicHistory.goBack(-1);
        }
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
                    userName: $scope.currentUser._serverData.name,
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
        $scope.firstLetters = function(str) {
            return ((str)?str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase()}):'');
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
                                userName: $scope.currentUser._serverData.name,
                                trackTitle: title,
                                artistName: name,
                                artistImage: image
                            }, function(confirm) {
                                if (confirm.status === 1) {
                                    $ionicPopup.alert({
                                        title: 'MVPlayer',
                                        template: "Your song is now in the queue! Sit back and be the <span class=\"special\">MVP</span> you are."
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
                    location = ($scope.currentUser) ? '#/app/player' : null;
                $ionicPopup.alert({
                    title: 'MVPlayer - Error',
                    template: body
                }).then(function(res) {
                    if (location !== null) {
                        window.location = location;
                    }else {
                        $scope.login();
                    }
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
                if ($scope.searchHistory.indexOf(term) === -1) {
                    $scope.searchHistory.unshift(term);
                    if ($scope.searchHistory.length >= 5) {
                        $scope.searchHistory = $scope.searchHistory.slice(0, 5);
                    }
                }
                $window.location = '#/app/search/'+term+'/';
            }
        };
        $scope.joinServer = function(id) {
            $scope.queue_list = {};
            socket.emit('user:init', {
                room: id
            }, function(confirm) {
                window.localStorage['room'] = id;
                $scope.room = id;
                if (confirm.length > 0) {
                    $scope.queue_list = confirm;
                    $scope.vote.upvote = confirm[0].upvoteNum;
                    $scope.vote.downvote = confirm[0].downvoteNum;
                }
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
                    if (confirm.length > 0) {
                        $scope.queue_list = confirm;
                        $scope.vote.upvote = confirm[0].upvoteNum;
                        $scope.vote.downvote = confirm[0].downvoteNum;
                    }
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
            $timeout(function() {
                $scope.queue_list = data;
            }, 100);
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
        $scope.closeLogin = function(alert) {
                $scope.modal.hide().then( function(){
                    if (alert) {
                        $ionicPopup.alert({
                            title: 'MVPlayer',
                            template: 'Welcome, you are currently logged in! You can now chat and suggest songs!'
                        });
                    }
                });
            },

            // Open the login modal
            $scope.login = function() {
                $scope.modal.show();
                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.enableSlide(false);
                $scope.login.title = 'MVPlayer';
            },
            $scope.loginPage = function() {
                $scope.login.title = 'Login';
                $ionicSlideBoxDelegate.slide(2);
            },
            $scope.signupPage = function() {
                $scope.login.title = 'Signup';
                $ionicSlideBoxDelegate.slide(0);
            },
            $scope.homePage = function() {
                $scope.login.title = 'MVPlayer';
                $ionicSlideBoxDelegate.slide(1);
                return false;
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
                    $scope.signupData = {};
                    $scope.vote.selectedIndex = 0;
                    $ionicPopup.alert({
                        title: 'MVPlayer',
                        template: 'You have been successfully logged out'
                    })
                }
            });
        };
        $scope.doLogin = function(isValid) {
            if (isValid) {
                var user = new Parse.User();
                var loginData = $scope.loginData;
                user.set('username', loginData.email); // in my app, email==username
                user.set('password', loginData.password);
                var user = new Parse.User({
                    username: loginData.email,
                    password: loginData.password
                });
                user.logIn({
                    success: function(user) {
                        $scope.currentUser = user;
                        $scope.$apply();
                        $scope.closeLogin(true);
                    },
                    error: function(user, error) {
                        alert('Unable to log in: ' + error.code + ' ' + error.message);
                    }
                });
            }
        };
        $scope.doSignup = function(isValid) {
            if (isValid) {
                var user = new Parse.User();
                var signupData = $scope.signupData;
                user.set('name', signupData.name); // in my app, email==username
                user.set('email', signupData.email); // in my app, email==username
                user.set('username', signupData.email);
                user.set('password', signupData.password);
                user.signUp(null, {
                    success: function(user) {
                        $scope.currentUser = user;
                        $scope.$apply(); // Notify AngularJS to sync currentUser
                        $scope.closeLogin(true);
                    },
                    error: function(user, error) {
                        alert('Unable to sign up:  ' + error.code + ' ' + error.message);
                    }
                });
            }
        };
        $scope.deleteSong = function(item) {
            $ionicPopup.confirm({
                title: 'MVPlayer',
                template: 'Are you sure you want to delete this song from the queue?'
            }).then(function(res) {
                if (res) {
                    socket.emit('song:delete', {
                        'track_id': item.objectId,
                        'player_id': item.playerId
                    });
                }
            });
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
    .controller('SearchCtrl', function($scope, $stateParams, LoadingService) {
        if ($stateParams.searchId) {
            $scope.search.term = $stateParams.searchId;
            $scope.doSearch($scope.search.term);
        }else{
            $scope.search = {};
        }
    })
    .controller('ArtistCtrl', function($scope, $rootScope, $stateParams, $http, $ionicPopup, socket, UserService, Echonest) {
        if (!$rootScope.artist) {
            $rootScope.artist = {};
        }
        function getArtistInfo(id) {
            $http.get(
                $scope.domain + 'music/artist?e=' + id
            ).success(function(data) {
                $rootScope.artist.loaded = true;
                $rootScope.artist.name = data.name;
                $rootScope.artist.slug = data.slug;
                $rootScope.artist.img = data.image;
                $rootScope.artist.convertedSlug = $scope.convertSlug(data.name, data.slug);
                $rootScope.artist.videography = data.artist_videos.videos;
                $rootScope.artist.featured = data.featured_artist_videos.videos;
                Echonest.artists.get({
                  name: $rootScope.artist.convertedSlug
                }).then(function(artist) {
                  return artist.getBiographies();
                }).then(function(artist) {
                    for (var i = 0; i < artist.biographies.length; i++) {
                        if (!artist.biographies[i].truncated) {
                            $rootScope.artist.biographies = artist.biographies[i].text;
                            break;
                        }
                    }
                });
            });
        }
        var param = $stateParams;
        if (param && param.artistId && param.action && $rootScope.artist.id !== param.artistId) {
            $rootScope.artist.id = param.artistId;
            $rootScope.artist.loaded = false;
            if (param.action === 'id') {
                getArtistInfo(param.artistId);
            } else if (param.action === 'slug') {
                $http.get(
                    $scope.domain + 'music/search?e=' + param.artistId
                ).success(function(data) {
                    if (data.results.length) {
                        getArtistInfo(data.results[0].id);
                    }else {
                        $rootScope.artist.loaded = true;
                        $rootScope.artist.convertedSlug = $scope.convertSlug(null, param.artistId);
                    }
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
    .controller('QueueCtrl', function() {
        
    })
    .controller('PlayerCtrl', function($scope, socket, $ionicPopup, LoadingService, $cordovaGeolocation, cfpLoadingBar, $ionicScrollDelegate) {
        LoadingService.showLoading();
        cfpLoadingBar.start();
        cfpLoadingBar.inc();
        $scope.loaded = false;
        $scope.lnglat = {
            lat: null,
            lng: null,
            err: false
        };
        var posOptions = {timeout: 10000, enableHighAccuracy: false};
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {
                $scope.lnglat = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    err: false
                };
        }, function(err) {
            $scope.loaded = true;
            $scope.lnglat.err = true;
            LoadingService.hideLoading();
            cfpLoadingBar.complete();
            $scope.loaded = true;
        });
        $scope.resetLocation = function() {
            $scope.lnglat.err = true;
            $ionicScrollDelegate.scrollBottom(true);
        };
        $scope.$watch('lnglat', function() {
            if($scope.lnglat.lat !== null && $scope.lnglat.err !== true) {
                var Player = Parse.Object.extend("Player");
                var query = new Parse.Query(Player);
                var point = new Parse.GeoPoint($scope.lnglat.lat, $scope.lnglat.lng);
                query.withinMiles("latlng", point, 50);
                query.find({
                    success: function(playerObjects) {
                        $scope.players = playerObjects;
                        LoadingService.hideLoading();
                        cfpLoadingBar.complete();
                        $scope.loaded = true;
                        $scope.$apply();
                    },
                    error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
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
    .controller('ChatCtrl', function($scope, $ionicScrollDelegate, socket, $ionicPopup, LoadingService, $window) {
        if ($scope.room !== null) {
            $scope.chats = null;
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
        } else {
            $ionicPopup.alert({
                title: 'MVPlayer',
                template: 'You need to be connect to player first to see chat messages! Click \'OK\' to goto player setup!'
            }).then(function(res) {
                if (res) {
                    $window.location = '#/app/player'
                }
            });
        }
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
                            'from': $scope.currentUser._serverData.name,
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
                    location = null;
                }
                if (body !== null) {
                    $ionicPopup.alert({
                        title: title,
                        template: body
                    }).then(function(res) {
                        if (location !== null){
                            window.location = location;
                        }else {
                            $scope.login();
                        }
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