'use strict';
angular.module('Alma.controllers')
	.controller('LoginCtrl', ['$scope', '$rootScope', '$cordovaDialogs', '$cordovaOauth', '$ionicLoading', '$localStorage', '$http', '$cordovaKeyboard', function($scope, $rootScope, $cordovaDialogs, $cordovaOauth, $ionicLoading, $localStorage, $http, $cordovaKeyboard) {
		/*global Parse*/
		$scope.login = {
			hasErrors: false,
			error: null,
			success: null,
			showPositive: false
		};
		$scope.signup = $scope.login;
		/*if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.disableScroll(false);
		}*/
		$scope.doLogin = function(isValid, email, password) {
			if (isValid) {
				$ionicLoading.show();
				var user = new Parse.User();
				user.set('username', email);
				user.set('password', password);
				user = new Parse.User({
					username: email,
					password: password
				});
				user.logIn({
					success: function(userData) {
						$rootScope.currentUser = userData;
						$rootScope.currentUser.image = (userData.get('image'))?userData.get('image')._url:'';
						$scope.loginData = {};
						$scope.signupData = {};
						$scope.login.hasErrors = false;
						$scope.closeLogin(true);
						$ionicLoading.hide();
						$scope.$apply();
					},
					error: function() {
						$scope.login = {
							hasErrors: true,
							error: 'Invalid login credentials. Please try again.'
						};
						$ionicLoading.hide();
						$scope.$apply();
					}
				});
			} else {
				$scope.login.hasErrors = true;
			}
		};
		$scope.doSignup = function(isValid, name, email, gender, password, image, accessToken) {
			if (isValid) {
				$ionicLoading.show();
				var user = new Parse.User();
				user.set('name', name);
				user.set('email', email);
				user.set('username', email);
				user.set('password', password);
				user.set('mobileNotifications', true);
				if (gender) {
					user.set('gender', gender);
				}
				if (accessToken) {
					user.set('accessToken', accessToken);
				}
				user.signUp(null, {
					success: function(userData) {
						$rootScope.currentUser = userData;
						$rootScope.currentUser.image = image;
						$scope.loginData = {};
						$scope.signupData = {};
						$scope.signup.hasErrors = false;
						$scope.closeLogin(true);
						$ionicLoading.hide();
						$scope.$apply();
					},
					error: function() {
						$scope.signup = {
							hasErrors: true,
							error: 'That email has already been taken'
						};
						$ionicLoading.hide();
						$scope.$apply();
					}
				});
			} else {
				$scope.signup.hasErrors = true;
			}
		};
		$scope.forgotMyPassword = function(email) {
			if (!email.$invalid) {
				$cordovaDialogs.confirm('Did you forget your password?', 'Alma', ['Yes', 'Cancel']).then(function(res) {
					if (res === 1) {
						$ionicLoading.show();
						Parse.User.requestPasswordReset(email.$viewValue, {
							success: function() {
								$scope.login = {
									hasErrors: false,
									showPositive: true,
									error: null,
									success: 'Please check your email, a new password has been sent there.'
								};
								$ionicLoading.hide();
								$scope.$apply();
							},
							error: function() {
								$scope.login = {
									hasErrors: true,
									error: 'That email address is not is our system.',
									success: null 
								};
								$ionicLoading.hide();
								$scope.$apply();
							}
						});
					}
				});
			} else {
				$scope.login = {
					hasErrors: true,
					error: 'Please enter a valid email.'
				};
			}
		};
		$scope.facebookLogin = function() {
			$cordovaOauth.facebook('575282862608789', ['email']).then(function(result) {
				/*jshint camelcase: false */
				$localStorage.accessToken = result.access_token;
				if ($localStorage.hasOwnProperty('accessToken') === true) {
					$http.get('https://graph.facebook.com/v2.2/me', {
						params: {
							access_token: $localStorage.accessToken,
							fields: 'id,email,name,gender,picture',
							format: 'json'
						}
					}).then(function(result) {
						var query = new Parse.Query(Parse.User);
						query.equalTo('accessToken', result.data.id);
						query.find({
							success: function(user) {
								if (user.length) {
									$scope.doLogin(true, result.data.email, result.data.id);
								} else {
									//result.data.picture.data.url;
									/*var c = document.getElementById('myCanvas');
									var ctx = c.getContext("2d");
									var img = document.getElementById('preview');
									ctx.drawImage(img, 10, 10);
									var image = c.toDataURL();*/
									$scope.doSignup(true, result.data.name, result.data.email, result.data.gender, result.data.id, null, result.data.id);
								}
							},
							error: function() {
								$ionicLoading.show({
									template: 'Error connecting to server...',
									duration: 2000
								});
							}
						});
					});
				}
			}, function(error) {
				console.log(error);
			});
		};
		$scope.twitterLogin = function() {
			console.log('twitter');
			$cordovaOauth.twitter('ooP4LLRRJ51r454e3j7bVHc04', '6YBjrkeOSiEbCiqGe9H9POpxcMGdfyXfYlJvB1CUrjm8lv1Ayo').then(function(result) {
				console.log('Response Object -> ' + JSON.stringify(result));
			}, function(error) {
				console.log(error);
			});
		};
	}]);