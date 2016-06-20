'use strict';
/*jshint latedef: false*/
/*global stepsForm*/

var PlayerCtrl = function($scope, $mdDialog, $timeout, $mdSidenav, $http, $mdToast, $interval, lodash, Auth, Idle, User, Player, History, Error, notify, Queue, Chat, Vote, Room) {
    $scope.detonate = null;
    $scope.numRoom = 0;
    $scope.auth = Auth;
    $scope.last = 'Drake';
    $scope.auth.$onAuth(function(authData) {
        if (authData) {
            var user = (authData.provider === 'facebook') ? authData.facebook : authData.password;
            $scope.user = User.get(user.id).$loaded().then(function(data) {
                $scope.user = data;
                if (angular.isDefined($scope.user.player)) {
                    init();
                } else {
                    showSetup($mdDialog, $scope);
                }
            });
        } else {
            showLogin($mdDialog, $timeout);
        }
    });

    $scope.player = {
        id: 'UpRssA0CQ0E',
        url: undefined,
        isActive: false,
        width: $(window).width(),
        height: $(window).height(),
        vars: {
            controls: 0,
            disablekb: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            autoplay: 1
        }
    };
    notify.config({
        duration: 8000,
        position: 'right'
    });
    $scope.isIdle = true;
    $scope.$on('IdleStart', function() {
        if (!$mdSidenav('left').isOpen()) {
            $scope.isIdle = false;
            $scope.$apply();
        }
    });
    $scope.$on('IdleEnd', function() {
        $scope.isIdle = true;
        $scope.$apply();
    });

    function init() {
        if (angular.isDefined($scope.user) && angular.isDefined($scope.user.player) && angular.isDefined($scope.playerEvent)) {
            $scope.startPlayer();
        }
    }
    $scope.closeMenu = function() {
        $mdSidenav('left').close();
    };
    $scope.openMenu = function() {
        $mdSidenav('left').open();
    };

    $scope.startPlayer = function() {
        Idle.watch();
        Idle.setIdle(2);
        if ($scope.user && $scope.user.player) {
            Player.get($scope.user.player).$loaded().then(function(player) {
                $scope.player.firebase = player;
                Player.ref($scope.user.player).child('active').set(true);
                Player.ref($scope.user.player).child('active').onDisconnect().set(false);
                $scope.queue = Queue.get($scope.user.player);
                $scope.room = Room.get($scope.user.player);
                $scope.error = Error.get();
                $scope.history = History.get($scope.user.player);
                Chat.get($scope.user.player).$loaded().then(function(chat) {
                    chat.$watch(function(event) {
                        if (event.event === 'child_added') {
                            Chat.getSingle($scope.user.player, event.key).$loaded().then(function(msg) {
                                notify({
                                    messageTemplate: '<img ng-src="' + msg.user.image + '" src="assets/images/logo_missing.png"><span class="content"><h3 class="header">' + msg.user.name + '</h3><p>' + msg.message + '</p></span>'
                                });
                            });
                        }
                    });
                });
                $scope.room.$loaded().then(function(room) {
                    room.$watch(function(event) {
                        if (event.event === 'child_added' || event.event === 'child_changed') {
                            Room.getSingle($scope.user.player, event.key).$loaded().then(function(msg) {
                                notify({
                                    messageTemplate: '<img ng-src="' + msg.image + '" src="assets/images/logo_missing.png"><span class="content"><h3 class="header">' + msg.name + '</h3><p>just joined the room!</p></span>'
                                });
                            });
                        }
                    });
                });
                $scope.queue.$loaded().then(function(queue) {
                    $scope.player.isActive = true;
                    $scope.queue = queue;
                    play();
                    queue.$watch(function(event) {
                        if (event.event === 'child_added') {
                            Queue.getSingle($scope.user.player, event.key).$loaded().then(function(track) {
                                var msg = (track.user) ? track.user.name + ' just added a song' : 'The queue was empty!',
                                    sub = (track.user) ? track.artists[0].name + ' - ' + track.song_title : 'So we picked a song for you.';
                                notify({
                                    messageTemplate: '<img ng-src="' + track.image.o + '" src="assets/images/logo_missing.png"><span class="content"><h3 class="header">' + msg + '</h3><p>' + sub + '</p></span>'
                                });
                                if ($scope.queue.length === 0) {
                                    play();
                                }
                            });
                        }
                    });
                });
                $interval(function() {
                    notify({
                        messageTemplate: '<img src="assets/images/logo_missing.png"><span class="content"><h3 class="header">Join in on the conversation!</h3><p>Visit http://app.alma.life for more info</p></span>'
                    });
                }, 600000); //10mins

            });
        }
    };
    $scope.getTrack = function() {
        $http.post('/api/tracks', {
            params: {
                pid: $scope.user.player,
                last: $scope.last,
                lastId: $scope.lastId
            }
        }).then(function(response) {
            if (response.status === 200) {
                detonate();
                response.data.priority = 0;
                $scope.queue.$add(response.data).then(function() {
                    play();
                });
            }
        });
    };

    $scope.onReady = function(event) {
        $scope.playerEvent = event;
        init();
    };
    $scope.onStateChange = function(event) {
        if (event.data === YT.PlayerState.ENDED) {
            songEnded();
        } else if (event.data === YT.PlayerState.PLAYING) {
            $scope.loading = false;
            $('#currentlyPlaying').addClass('active');
            activateBar();
            if ($scope.detonate !== null) {
                $timeout.cancel($scope.detonate);
                $scope.detonate = null;
            }
            $scope.$apply();
        }

    };
    $scope.onError = function() {
        $scope.loading = true;
        var src = lodash.filter($scope.activeQueueFB.sources, ['source', 'youtube']);
        if (src.length > 0) {
            delete $scope.activeQueueFB.sources[0];
            play();
        } else {
            notify({
                messageTemplate: '<span class="content"><h3 class="header">The was a small hiccup</h3><p>It seems we couldn\'t play this video</p></span>'
            });
            $scope.error.$add($scope.activeQueueFB).then(function() {
                $scope.queue.$remove($scope.activeQueueFB).then(function() {
                    play();
                });
            });
        }

    };
    $scope.onApiLoadingFailure = function() {
        notify({
            messageTemplate: '<span class="content"><h3 class="header">The was a small hiccup</h3><p>It seems like  you have been disconnected from the internet</p></span>'
        });
        $scope.onError();
    };
    $(window).resize(function() {
        $scope.player.width = $(window).width();
        $scope.player.height = $(window).height();
        $scope.$apply();
    });

    function play() {
        if (angular.isDefined($scope.queue) && $scope.queue.length > 0) {
            if ($scope.playerEvent) {
                $scope.activeQueue = lodash.orderBy($scope.queue, ['active', 'priority'], ['asc', 'desc']);
                $scope.activeQueueFB = $scope.queue[$scope.queue.$indexFor($scope.activeQueue[0].$id)];
                var src = lodash.filter($scope.activeQueueFB.sources, ['source', 'youtube']);
                if (src.length > 0) {
                    $scope.playerEvent.target.loadVideoById(src[0].source_data);
                    $scope.player.firebase.nowPlaying = $scope.activeQueueFB;
                    $scope.player.firebase.$save();
                    $scope.activeQueueFB.active = true;
                    $scope.queue.$save($scope.activeQueueFB);
                    $scope.last = $scope.activeQueueFB.artists[0].name;
                    $scope.lastId = $scope.activeQueueFB.id;
                    Vote.get($scope.user.player, $scope.activeQueueFB.$id).$loaded().then(function(vote) {
                        vote.$watch(function(event) {
                            if (event.event === 'child_added' || event.event === 'child_changed') {
                                Vote.getSingle($scope.user.player, $scope.activeQueueFB.$id, event.key).$loaded().then(function(msg) {
                                    notify({
                                        messageTemplate: '<img ng-src="' + msg.user.image + '" src="assets/images/logo_missing.png"><span class="content"><h3 class="header">' + msg.user.name + '</h3><p>' + ((msg.status) ? 'Liked' : 'Disliked') + ' this song!</p></span>',
                                    });
                                    var activeUsers = $scope.room.length;
                                    var negs = lodash.filter(vote, ['status', false]);
                                    if (negs.length > 0) {
                                        if (negs.length / activeUsers > 0.5) {
                                            activateSongChange();
                                        }
                                    }
                                });
                            }
                        });
                    });
                } else {
                    $scope.onError();
                }
            }
        } else {
            $scope.getTrack();
        }
    }

    function activateSongChange() {
        $scope.counter = 10;
        $scope.skip = true;
        var counter = $interval(function() {
            $scope.counter--;
            if ($scope.counter === 0) {
                $interval.cancel(counter);
                $timeout(function() {
                    $scope.skip = false;
                    songEnded();
                }, 1000);
            }
        }, 1000, 10);
    }

    function songEnded() {
        detonate();
        $scope.loading = true;
        if ($scope.history.length > 10) {
            lodash.forEachRight($scope.history, function(history, key) {
                if (key > 10) {
                    $scope.history.$remove($scope.history[key]);
                }
            });
        }
        $scope.history.$add($scope.activeQueueFB).then(function() {
            $scope.queue.$remove($scope.activeQueueFB).then(function() {
                play();
            });
        });
    }

    function detonate() {
        if ($scope.detonate !== null) {
            $timeout.cancel($scope.detonate);
        }
        $scope.detonate = $timeout(function() {
            songEnded();
        }, 10000);
    }

    function activateBar() {
        $timeout(function() {
            $('#currentlyPlaying').removeClass('active');
        }, 60000);
    }
};
PlayerCtrl.$inject = ['$scope', '$mdDialog', '$timeout', '$mdSidenav', '$http', '$mdToast', '$interval', 'lodash', 'Auth', 'Idle', 'User', 'Player', 'History', 'Error', 'notify', 'Queue', 'Chat', 'Vote', 'Room'];
var SetupCtrl = function($scope, $timeout, $http, $mdDialog, Error, Player, User) {
    $scope.intro = true;
    $scope.playerForm = {};
    $timeout(function() {
        var theForm = document.getElementById('theForm');
        new stepsForm(theForm, {
            onSubmit: function() {
                if ($scope.playerForm.$valid) {
                    classie.addClass(theForm.querySelector('.simform-inner'), 'hide');
                    $http.get('http://nominatim.openstreetmap.org/search', {
                        params: {
                            q: $scope.playerForm.q2.$viewValue,
                            format: 'json',
                            addressdetails: 1
                        }
                    }).then(function(response) {
                        if (response.data[0]) {
                            var obj = {
                                name: $scope.playerForm.q1.$viewValue,
                                location: response.data[0],
                                createdBy: $scope.user.id
                            };

                            Player.create(obj).then(function(player) {
                                $scope.user.player = player.key();
                                var geoFire = Player.location();
                                geoFire.set(player.key(), [parseFloat(response.data[0].lat), parseFloat(response.data[0].lon)]);
                                $scope.user.$save().then(function() {
                                    $mdDialog.hide();
                                    $scope.startPlayer();
                                });
                            }).catch(function(err) {
                                Error.system('Something went very wrong, please try to refresh the page!');
                            });
                        }
                    });
                }
            }
        });
    }, 500);
    $scope.startForm = function() {
        $scope.intro = false;
    };
};
SetupCtrl.$inject = ['$scope', '$timeout', '$http', '$mdDialog', 'Error', 'Player', 'User'];
var AuthCtrl = function($scope, $mdDialog, $timeout, Auth, User, Error) {
    $scope.hide = function(modal) {
        $mdDialog.hide();
        $timeout(function() {
            if (modal === 'login') {
                showSignUp($mdDialog, $timeout);
            } else {
                showLogin($mdDialog, $timeout);
            }
        }, 750);
    };
    $scope.loginForm = {};
    $scope.logInSubmit = function() {
        if ($scope.loginForm.$valid) {
            Auth.$authWithPassword({
                email: $scope.loginForm.email.$viewValue,
                password: $scope.loginForm.password.$viewValue
            }).then(function(userData) {
                User.update(userData.password).then(function() {
                    $mdDialog.hide();
                }).catch(function() {
                    Error.system('Something went very wrong, please try to refresh the page!');
                });
            }).catch(function(error) {
                Error.system(error);
            });
        }
    };
    $scope.facebookLogin = function() {
        function createFacebook(authData) {
            authData.facebook.provider = 'facebook';
            User.update(authData.facebook).then(function() {
                $mdDialog.hide();
            }).catch(function() {
                Error.system('Something went very wrong, please try to refresh the page!');
            });
        }
        Auth.$authWithOAuthPopup('facebook', { scope: 'public_profile, email, user_friends, user_birthday' }).then(function(userData) {
            createFacebook(userData);
        }).catch(function(error) {
            if (error.code === 'TRANSPORT_UNAVAILABLE') {
                Auth.$authWithOAuthPopup('facebook', { scope: 'public_profile, email, user_friends, user_birthday' }).then(function(userData) {
                    createFacebook(userData);
                });
            } else {
                Error.system('Something went very wrong, We were unable to log you in!');
            }
        });
    };
    $scope.signupForm = {};
    $scope.signUpSubmit = function() {
        if ($scope.signupForm.$valid) {
            Auth.$createUser({
                email: $scope.signupForm.email.$viewValue,
                password: $scope.signupForm.password.$viewValue
            }).then(function() {
                Auth.$authWithPassword({
                    email: $scope.signupForm.email.$viewValue,
                    password: $scope.signupForm.password.$viewValue
                }).then(function(userData) {
                    userData.password.id = userData.uid;
                    userData.password.accessToken = userData.token;
                    userData.password.displayName = $scope.signupForm.name.$viewValue;
                    userData.password.provider = 'Password';
                    User.update(userData.password).then(function() {
                        $mdDialog.hide();
                    }).catch(function() {
                        Error.system('Something went very wrong, please try to refresh the page!');
                    });
                }).catch(function(error) {
                    Error.system(error);
                });
            }).catch(function(error) {
                Error.system(error);
            });
        }
    };
};
AuthCtrl.$inject = ['$scope', '$mdDialog', '$timeout', 'Auth', 'User', 'Error'];

function showSetup(mdDialog, $scope) {
    mdDialog.show({
        templateUrl: 'components/modals/player.tmpl.html',
        controller: SetupCtrl,
        clickOutsideToClose: false,
        escapeToClose: false,
        hasBackdrop: false,
        preserveScope: true,
        scope: $scope
    });
}

function showSignUp(mdDialog, timeout) {
    mdDialog.show({
        templateUrl: 'components/modals/signup.tmpl.html',
        controller: AuthCtrl,
        clickOutsideToClose: false,
        escapeToClose: false,
        hasBackdrop: false,
        onRemoving: function(element) {
            element.find('md-dialog').addClass('bounceOutDown');
        },
        onShowing: function(scope, element) {
            element.find('md-dialog').addClass('animated bounceInDown');
            timeout(function() {
                element.find('md-dialog').removeClass('bounceInDown');
            }, 1000);
        }
    });
}

function showLogin(mdDialog, timeout) {
    mdDialog.show({
        templateUrl: 'components/modals/login.tmpl.html',
        controller: AuthCtrl,
        clickOutsideToClose: false,
        escapeToClose: false,
        hasBackdrop: false,
        onRemoving: function(element) {
            element.find('md-dialog').addClass('bounceOutDown');
        },
        onShowing: function(scope, element) {
            element.find('md-dialog').addClass('animated bounceInDown');
            timeout(function() {
                element.find('md-dialog').removeClass('bounceInDown');
            }, 750);
        }
    });
}

angular.module('arbokApp').controller('PlayerCtrl', PlayerCtrl);