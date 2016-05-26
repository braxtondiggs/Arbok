'use strict';
/*jshint latedef: false*/
/*global stepsForm*/

var PlayerCtrl = function($scope, $mdDialog, $timeout, $mdSidenav, $http, Auth, Idle, User, Player, Error, notify, Queue, History) {
    $scope.detonate = null;
    $scope.auth = Auth;
    $scope.auth.$onAuth(function(authData) {
        if (authData) {
            var user = (authData.provider === 'facebook') ? authData.facebook : authData.password;
            $scope.user = User.get(user.id).$loaded().then(function(data) {
                $scope.user = data;
                if (angular.isDefined($scope.user.player)) {
                    $scope.startPlayer($scope, Idle);
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
            controls: 1,
            disablekb: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            autoplay: 0
        },
        firebase: {
            queue: [],
            chat: []
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
    $scope.closeMenu = function() {
        $mdSidenav('left').close();
    };
    $scope.openMenu = function() {
        $mdSidenav('left').open();
    };

    $scope.startPlayer = function() {
        Idle.watch();
        Idle.setIdle(2);
        $scope.player.isActive = true;
    };
    $scope.getTrack = function() {
        $http.post('/api/tracks', {
            params: {
                pid: $scope.user.player,
                last: 'Drake' //replace
            }
        }).then(function(response) {
            if (response.status === 200) {
                detonate();
                $scope.queue.$add(response.data).then(function(res) {
                    console.log('added');
                    console.log(res);
                });
            }
        });
    };

    $scope.onReady = function(event) {
        $scope.playerEvent = event;
        $scope.queue = Queue.get($scope.user.player);
        $scope.history = History.get($scope.user.player);
        $scope.error = Error.get();
        $scope.queue.$loaded().then(function(queue) {
            $scope.queue = queue;
            play();
        });
    };
    $scope.onStateChange = function(event) {
        if (event.data === YT.PlayerState.ENDED) {
            songEnded();
        } else if (event.data === YT.PlayerState.PLAYING) {
            if ($scope.detonate !== null) {
                $timeout.cancel($scope.detonate);
                $scope.detonate = null;
            }
            $scope.$apply();
        }

    };
    $scope.onError = function() {
        notify({
            messageTemplate: '<span class="content"><h3 class="header">The was a small hiccup</h3><p>It seems we couldn\'t play this video</p></span>',
            classes: 'activity-modal'
        });
        $scope.error.$add($scope.queue[0]).then(function() {
            $scope.queue.$remove($scope.queue[0]).then(function() {
                play();
            });
        });
    };
    $scope.onApiLoadingFailure = function() {
        notify({
            messageTemplate: '<span class="content"><h3 class="header">The was a small hiccup</h3><p>It seems like  you have been disconnected from the internet</p></span>',
            classes: 'activity-modal'
        });
    };
    $(window).resize(function() {
        $scope.player.width = $(window).width();
        $scope.player.height = $(window).height();
        $scope.$apply();
    });
    function play() {
        if (angular.isDefined($scope.queue) || $scope.queue.length > 0) {
            $('#currentlyPlaying').addClass('active');
            $scope.playerEvent.target.loadVideoById($scope.queue[0].youtube[0]);
            $scope.playerEvent.target.setPlaybackQuality('small');
            $scope.loading = false;
            activateBar();
        }else {
            $scope.getTrack();
        }
    }
    function songEnded() {
        detonate();
        $scope.loading = true;
        $scope.history.$add($scope.queue[0]).then(function() {
            $scope.queue.$remove($scope.queue[0]).then(function() {
                play();
            })
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
var SetupCtrl = function($scope, $timeout, $http, $mdDialog, Error, Player, User, Idle) {
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
                                $scope.user.$save().then(function() {
                                    $mdDialog.hide();
                                    $scope.startPlayer($scope, Idle);
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