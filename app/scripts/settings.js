'use strict';
angular.module('Alma.controllers')
	.controller('SettingsCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', '$cordovaDialogs', '$ionicHistory', '$cordovaEmailComposer', '$cordovaAppVersion', '$localStorage', function($scope, $rootScope, $state, $ionicLoading, $cordovaDialogs, $ionicHistory, $cordovaEmailComposer, $cordovaAppVersion, $localStorage) {
		/*global Parse*/
		/*global device*/
		/*global ionic*/
		$scope.settingsForm = {};
		if (typeof device !== 'undefined') {
			$scope.devicePlatform = device.platform;
		}
		if (Parse.User.current()) {
			var user = Parse.User.current();
			$scope.name = user.get('name');
			$scope.gender = user.get('gender');
			$scope.mobileNotifications = user.get('mobileNotifications') || true;
			$scope.email = user.getEmail();
			$scope.showEmail = false;
			$scope.settings = {
				error: null,
				hasErrors: false,
				success: null,
				showPositive: false
			};
		} else {
			$state.transitionTo('app.dashboard');
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
		}
		document.addEventListener('deviceready', function () {
			if ((ionic.Platform.device().version.substring(0, 2) !== '8.' && ionic.Platform.device().platform === 'iOS') || ionic.Platform.device().platform !== 'iOS') {
				$scope.showEmail = true;
				$scope.$apply();
			}
		}, false);
		function initChanged() {
			$scope.isChanged = {
				name: false,
				gender: false,
				email: false,
				password: false,
				confirmPassword: false
			};
		}
		initChanged();
		$scope.saveInput = function(name, input) {
			$ionicLoading.show();
			var user = Parse.User.current();
			user.set(name, input);
			user.save(null, {
				success: function() {
					$ionicLoading.hide();
				},
				error: function() {
					$ionicLoading.show({
						template: 'Error connecting to server...',
						duration: 2000
					});
				}
			});
		};
		$scope.submitForm = function(isValid, name, email, gender, password, confirmPassword) {
			function parseSave(user) {
				user.save(null, {
					success: function() {
						$scope.settings = {
							showPositive: true,
							success: 'Information successfully stored',
							hasErrors: false
						};
						$ionicLoading.hide();
					},
					error: function(error) {
						$ionicLoading.hide();
						if (error.code === 202) {
							$scope.settings = {
								hasErrors: true,
								error: 'That email is already taken.'
							};
						} else {
							$ionicLoading.show({
								template: 'Error connecting to server...',
								duration: 2000
							});
						}
					}
				});
			}
			if (isValid) {
				var user = Parse.User.current();
				$ionicLoading.show();
				if ($scope.isChanged.email) {
					if (email.$valid) {
						user.set('email', email.$viewValue);
						user.set('username', email.$viewValue);
						parseSave(user);
					} else {
						$scope.settings.hasErrors = true;
					}
				}
				if ($scope.isChanged.name) {
					if (name.$valid) {
						user.set('name', name.$viewValue);
						parseSave(user);
					} else {
						$scope.settings.hasErrors = true;
					}
				}
				if ($scope.isChanged.gender) {
					if (gender.$valid) {
						user.set('gender', gender.$viewValue);
						parseSave(user);
					} else {
						$scope.settings.hasErrors = true;
					}
				}
				if ($scope.isChanged.password || $scope.isChanged.confirmPassword) {
					if (password.$valid && confirmPassword.$valid) {
						user.set('password', password.$viewValue);
						parseSave(user);
					} else {
						$scope.settings.hasErrors = true;
					}

				}
				$ionicLoading.hide();
				initChanged();
			}else {
				$scope.settings.hasErrors = true;
			}
		};
		$scope.featureRequest = function() {
			$cordovaAppVersion.getAppVersion().then(function (version) {
				var deviceInfo = ionic.Platform.device();
				var email = {
					to: 'admin@cymbit.com',
					subject:  deviceInfo.platform + ' Feature Request',
					body: '<br /><br /><br /><p>Alma Version: ' + version + '</p><p>' + deviceInfo.platform + ' OS: ' + deviceInfo.version + '</p><p>Phone Model: ' + deviceInfo.model + '</p>',
					isHtml: true
				};
				$cordovaEmailComposer.isAvailable().then(function() {
					$cordovaEmailComposer.open(email).then(function() {
						$cordovaDialogs.alert('Your email was succefully sent, we will get back to you with in 12-24 hours.', 'Alma - Email Sent');
					});
				});
			});
		};
		$scope.bugReport = function() {
			$cordovaAppVersion.getAppVersion().then(function (version) {
				var deviceInfo = ionic.Platform.device();
				var email = {
					to: 'admin@cymbit.com',
					subject: deviceInfo.platform + ' Bug Report',
					body: '<br /><br /><br /><p>Alma Version: ' + version + '</p><p>' + deviceInfo.platform + ' OS: ' + deviceInfo.version + '</p><p>Phone Model: ' + deviceInfo.model + '</p>',
					isHtml: true
				};
				$cordovaEmailComposer.isAvailable().then(function() {
					$cordovaEmailComposer.open(email).then(function() {
						$cordovaDialogs.alert('Your email was succefully sent, we will get back to you with in 12-24 hours.', 'Alma - Email Sent');
					});
				});
			});
		};
		$scope.logout = function() {
			Parse.User.logOut();
			$localStorage.$reset();
			$state.transitionTo('app.dashboard');
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
			$rootScope.currentUser = {};
			$cordovaDialogs.alert('You have been successfully logged out', 'Alma');
		};
		$scope.deleteAccount = function() {
			$cordovaDialogs.confirm('Deleting your account will also remove all of your library data. This is permanent and cannout be undone. Are your sure?', 'Delete Your Account', ['Yes', 'Cancel']).then(function(res) {
				if (res === 1) {
					$ionicLoading.show();
					var user = Parse.User.current();
					user.destroy({
						success: function() {
							$localStorage.$reset();
							$state.transitionTo('app.dashboard');
							$ionicHistory.clearHistory();
						},
						error: function() {
							$ionicLoading.show({
								template: 'Error connecting to server...',
								duration: 2000
							});
						}
					});
				}
			});
		};
	}]);