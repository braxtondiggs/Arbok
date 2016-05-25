'use strict';

var PlayerCtrl = function($scope, $mdDialog, $timeout, Auth, Player, Idle, $mdSidenav) {
    $scope.auth = Auth;
    $scope.auth.$onAuth(function(authData) {
        if (authData) {
            if (angular.isDefined(authData.players)) {
                //$scope.startPlayer();
            } else {
                showSetup($mdDialog);
            }
        } else {
            showLogin($mdDialog, $timeout);
        }
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
    };
};
var SetupCtrl = function($scope, $timeout, $http) {
    $scope.intro = true;
    $scope.playerLoading = false;
    $scope.playerForm = {};
    $timeout(function() {
        var theForm = document.getElementById('theForm');
        new stepsForm(theForm, {
            onSubmit: function(form) {
                classie.addClass(theForm.querySelector('.simform-inner'), 'hide');
                $scope.playerLoading = true;
                console.log($scope.user.$id);
                $http.post('/player/create', {
                    data: {
                        uid: $scope.user.$id,
                        name: $scope.playerForm.q1.$viewValue,
                        address: $scope.playerForm.q2.$viewValue
                    }
                }).then(function() {

                });
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
                User.create(userData.password).then(function() {
                    $mdDialog.hide();
                    showSetup($mdDialog);
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
            User.create(authData.facebook).then(function() {
                $mdDialog.hide();
                showSetup($mdDialog);
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
            }).then(function(userData) {
                Auth.$authWithPassword({
                    email: $scope.signupForm.email.$viewValue,
                    password: $scope.signupForm.password.$viewValue
                }).then(function(userData) {
                    userData.password.id = userData.uid;
                    userData.password.accessToken = userData.token;
                    userData.password.displayName = $scope.signupForm.name.$viewValue;
                    userData.password.provider = 'Password';
                    User.create(userData.password).then(function() {
                        $mdDialog.hide();
                        showSetup($mdDialog);
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

function showSetup(mdDialog) {
    mdDialog.show({
        templateUrl: 'components/modals/player.tmpl.html',
        controller: SetupCtrl,
        clickOutsideToClose: false,
        escapeToClose: false,
        hasBackdrop: false,
        preserveScope: true
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