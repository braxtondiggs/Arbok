'use strict';
Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');
var domain = 'http://localhost:5000/';
angular.module('Quilava.controllers', [])
    .controller('AppCtrl', function($scope, $ionicModal, socket, $http, $ionicPopup) {
        $scope.isSearch = false;
        $scope.loginData = {};
        $scope.search = {};
        $scope.currentUser = Parse.User.current() || null;
        $scope.room = window.localStorage['room'] || null;
        $scope.setSearchBar = function(val) {
            $scope.isSearch = val;
        };
        $scope.checkImage = function(img) {
            return (img.slice(-3) === "jpg") ? img : "http://placehold.it/125x70";
        }
        $scope.convertSlug = function(name, slug) {
            if (name !== null) {
                return name;
            } else {
                return slug.replace("-", " ").replace("-", " ").replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }
        }
        $scope.addSong = function(id) {
            if ($scope.currentUser && $scope.room) {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'MVPlayer',
                    template: 'Are you sure you want add this song?'
                });
                confirmPopup.then(function(res) {
                    if(res) {
                        socket.emit('song:new', {
                            server_id: $scope.room,
                            track_id: id
                        }, function(confirm) {
                            console.log('confirmed');
                        });
                    }
                });
            }else {
                var body = ($scope.currentUser)?'You have not connected to a MVPlayer yet.':'You need to be logged inorder to suggest a song',
                    location = ($scope.currentUser)?'#/app/player':'#/app/login';
                $ionicPopup.alert({
                    title: 'MVPlayer - Error',
                    template: body
                }).then(function(res) {
                    window.location = location;
                });    
            }
        }
        $scope.doSearch = function(term) {
            if (term) {
                $http.get(
                    domain + 'music/search?v=' + term
                ).success(function(data) {
                    $scope.search.tracks = {};
                    $scope.search.tracks = data.results;
                });
                $http.get(
                    domain + 'music/search?e=' + term
                ).success(function(data) {
                    $scope.search.artists = {};
                    $scope.search.artists = data.results;
                    console.log($scope.search);
                });
                window.location = '#/app/search';
            }
        };

        socket.on('user:init', function(data) {
            $scope.queue_list = data.playlist;
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
            Parse.User.logOut();
            $scope.currentUser = null;
        };
        $scope.doLogin = function(isValid) {
            if (isValid) {
                console.log('Doing login', $scope.loginData);
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
                            //console.log(user);
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
    .controller('ArtistCtrl', function($scope, $stateParams, $http) {
        console.log($stateParams);
        $http.get(
            domain + 'music/artist?e=' + $stateParams.artistId
        ).success(function(data) {
            $scope.artist = {};
            $scope.artist.name = data.slug; //Needs Functions
            $scope.artist.img = data.image; //Needs Functions
            $scope.artist.videography = data.artist_videos.videos;
            $scope.artist.featured = data.featured_artist_videos.videos;
        });
    })
    .controller('QueueCtrl', function($scope) {
        $scope.queue_list = [{
            id: 1,
            album_img: 'http://ionicframework.com/img/docs/blue-album.jpg',
            artist: 'Weezer',
            title: 'Blue Album'
        }, {
            id: 2,
            album_img: 'http://ionicframework.com/img/docs/siamese-dream.jpg',
            artist: 'Smashing Pumpkins',
            title: 'Siamese Dream'
        }, {
            id: 3,
            album_img: 'http://ionicframework.com/img/docs/nevermind.jpg',
            artist: 'Nirvana',
            title: 'Nevermind'
        }];
    })
    .controller('PlayerCtrl', function($scope, socket, $ionicPopup) {
        $scope.lnglat = {lat: 39.935080, lng: -78.0216020};
        var Player = Parse.Object.extend("Player");
        var query = new Parse.Query(Player);
        var point = new Parse.GeoPoint($scope.lnglat.lat, $scope.lnglat.lng);
        query.withinMiles("latlng", point, 25);
        query.find({
            success: function(playerObjects) {
                console.log(playerObjects);
                $scope.players = playerObjects;
                $scope.$apply();
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
        $scope.joinServer = function(id) {
            socket.emit('user:init', {
                room: id
            }, function(confirm) {
                window.localStorage['room'] = id;
                $scope.room = id;
                $ionicPopup.alert({
                    title: 'MVPlayer',
                    template: 'You are now joined to this player!'
                }).then(function(res) {
                    window.location = '#/app/browse';
                });
            });
        };

    })
    .controller('ChatCtrl', function($scope, $ionicScrollDelegate) {
        $scope.msg = [{
            from: 'JODY HiGHROLLER',
            body: 'Yeah, neato. I beat up the block like Steven Seagal',
            self: true,
            img: 'http://blogs.villagevoice.com/music/assets_c/2014/01/RiffRaffTweets-thumb-560x439.jpg',
            timestamp: 'Today 7:26PM'
        }, {
            from: 'Andy Milonakis',
            body: 'What\'s up, sonny? Que pasa mijo,  Chillin\' with Rihanna out in Puerto Rico',
            img: 'http://gagorder.me/wp-content/uploads/2013/02/Three-Loco-ft.-Diplo-We-Are-Farmers-Andy-milonakis.jpeg',
            timestamp: 'Today 7:29PM'
        }, {
            from: 'Andy Milonakis',
            body: 'She ate my coconut, cause she thought it was a Zico',
            img: 'http://gagorder.me/wp-content/uploads/2013/02/Three-Loco-ft.-Diplo-We-Are-Farmers-Andy-milonakis.jpeg',
            timestamp: 'Today 7:46PM'
        }, {
            from: 'Dirty Nasty',
            body: 'Neato, still whip it like Devo Cause my dick short and fat like Danny DeVito',
            img: 'http://i.ytimg.com/vi/b01Bnr1aXt8/maxresdefault.jpg',
            timestamp: 'Today 7:47PM'
        }, {
            from: 'Andy Milonakis',
            body: 'I keep it underground, you\'re commercial like Vevo',
            img: 'http://gagorder.me/wp-content/uploads/2013/02/Three-Loco-ft.-Diplo-We-Are-Farmers-Andy-milonakis.jpeg',
            timestamp: 'Today 7:52PM'
        }, {
            from: 'JODY HiGHROLLER',
            body: 'You got a low self-esteem? You can rent my ego',
            self: true,
            img: 'http://blogs.villagevoice.com/music/assets_c/2014/01/RiffRaffTweets-thumb-560x439.jpg',
            timestamp: 'Today 7:59PM'
        }];
        $scope.scrollBottom = function() {
            $ionicScrollDelegate.scrollBottom();
        };
    });