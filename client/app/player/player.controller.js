'use strict';

angular.module('arbokApp')
    .controller('PlayerCtrl', function($scope, $mdDialog, $timeout, Auth, UserService, PlayerService, Idle, $mdSidenav) {
        $scope.auth = Auth;
        $scope.auth.$onAuth(function(authData) {
            $scope.authData = authData;
            if ($scope.authData) {
                UserService($scope.authData.uid).$loaded().then(function(data) {
                    $scope.user = data;
                    if (angular.isDefined($scope.user.players)) {
                        $scope.startPlayer();
                    } else {
                        showPlayerModal();
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            } else {
                showLogin();
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

        function showPlayerModal() {
            $mdDialog.show({
                templateUrl: 'components/modals/player.tmpl.html',
                controller: function DialogController($scope, $timeout, $http) {
                    $scope.intro = true;
                    $scope.playerLoading = false;
                    $scope.playerForm = {};
                    $timeout(function() {
                        var theForm = document.getElementById('theForm');
                        console.log($scope.user.$id);
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
                },
                clickOutsideToClose: false,
                escapeToClose: false,
                hasBackdrop: false,
                preserveScope: true,
                scope: $scope
            });
        }

        function showLogin() {
            $scope.login = $mdDialog.show({
                templateUrl: 'components/modals/login.tmpl.html',
                controller: function DialogController($scope, $mdDialog, $timeout, Auth) {
                    $scope.hide = function() {
                        $mdDialog.hide();
                        $timeout(function() {
                            showSignUp();
                        }, 750);
                    };
                    $scope.loginForm = {};
                    $scope.logInSubmit = function() {
                        if ($scope.loginForm.$valid) {

                            Auth.$authWithPassword({
                                email: $scope.loginForm.email.$viewValue,
                                password: $scope.loginForm.password.$viewValue
                            }).then(function(userData) {
                                console.log('Authenticated successfully with payload:', userData);
                                $mdDialog.hide();
                            }).catch(function(error) {
                                console.log('Error logging user in:', error);
                            });
                        }
                    };
                    $scope.facebookLogin = function() {
                        console.log('facebook');
                        Auth.$authWithOAuthPopup('facebook', { scope: 'email' }).then(function(userData) {
                            console.log('Authenticated successfully with payload:', userData);
                            $mdDialog.hide();
                        }).catch(function(error) {
                            console.log('Error logging user in:', error);
                        });
                    };
                },
                clickOutsideToClose: false,
                escapeToClose: false,
                hasBackdrop: false,
                scope: $scope,
                onRemoving: function(element, event) {
                    element.find('md-dialog').addClass('bounceOutDown');
                },
                onShowing: function(scope, element) {
                    element.find('md-dialog').addClass('animated bounceInDown');
                    $timeout(function() {
                        element.find('md-dialog').removeClass('bounceInDown');
                    }, 750);
                }
            });
        }

        function showSignUp() {
            $mdDialog.show({
                templateUrl: 'components/modals/signup.tmpl.html',
                controller: function DialogController($scope, $mdDialog, $timeout, Auth) {
                    $scope.hide = function() {
                        $mdDialog.hide();
                        $timeout(function() {
                            showLogin();
                        }, 500);
                    };
                    $scope.signupForm = {};
                    $scope.signUpSubmit = function() {
                        if ($scope.signupForm.$valid) {
                            Auth.$createUser({
                                email: $scope.signupForm.email.$viewValue,
                                password: $scope.signupForm.password.$viewValue
                            }).then(function(userData) {
                                var userRef = new Firebase('https://arbok.firebaseio.com/Users/' + userData.uid);
                                var obj = {
                                    firstName: $scope.signupForm.name.$viewValue.split(' ')[0],
                                    lastName: $scope.signupForm.name.$viewValue.split(' ')[1],
                                    provider: 'Email'
                                };
                                userRef.set(obj).then(function() {
                                    Auth.$authWithPassword({
                                        email: $scope.signupForm.email.$viewValue,
                                        password: $scope.signupForm.password.$viewValue
                                    }).then(function(userData) {
                                        $mdDialog.hide();
                                    }).catch(function(error) {
                                        console.log('Error logging user in:', error);
                                    });
                                });
                            }).catch(function(error) {
                                console.log('Error logging user in:', error);
                            });
                        }
                    };
                },
                clickOutsideToClose: false,
                escapeToClose: false,
                hasBackdrop: false,
                onRemoving: function(element, event) {
                    element.find('md-dialog').addClass('bounceOutDown');
                },
                onShowing: function(scope, element) {
                    element.find('md-dialog').addClass('animated bounceInDown');
                    $timeout(function() {
                        element.find('md-dialog').removeClass('bounceInDown');
                    }, 1000);
                }
            });
        }

    });