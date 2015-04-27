'use strict';
angular.module('Quilava.controllers')
	.controller('SettingsCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', '$cordovaDialogs', '$ionicHistory', '$cordovaEmailComposer', '$localStorage', function($scope, $rootScope, $state, $ionicLoading, $cordovaDialogs, $ionicHistory, $cordovaEmailComposer, $localStorage) {
		/*global Parse*/
		$scope.settingsForm = {};
		if (Parse.User.current()) {
			var user = Parse.User.current();
			$scope.name = user.get('name');
			$scope.gender = user.get('gender');
			$scope.mobileNotifications = user.get('mobileNotifications') || true;
			$scope.email = user.getEmail();
			$scope.settings = {
				error: null,
				hasErrors: false
			};
		} else {
			$state.transitionTo('app.dashboard');
			$ionicHistory.nextViewOptions({
				historyRoot: true
			});
		}

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
		$scope.submitForm = function(name, email, gender, password, confirmPassword) {
			var user = Parse.User.current();
			$ionicLoading.show();

			function parseSave(user, txt) {
				function changeComplete(showTxt) {
					console.log(showTxt);//Needs to be finished
					$ionicLoading.hide();
				}
				user.save(null, {
					success: function() {
						changeComplete(txt);
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
			if ($scope.isChanged.email) {
				if (email.$valid) {
					user.set('email', email.$viewValue);
					user.set('username', email.$viewValue);
					parseSave(user, 'Email');
				} else {
					$scope.settings.hasErrors = true;
				}
			}
			if ($scope.isChanged.name) {
				if (name.$valid) {
					user.set('name', name.$viewValue);
					parseSave(user, 'Name');
				} else {
					$scope.settings.hasErrors = true;
				}
			}
			if ($scope.isChanged.gender) {
				if (gender.$valid) {
					user.set('gender', gender.$viewValue);
					parseSave(user, 'Gender');
				} else {
					$scope.settings.hasErrors = true;
				}
			}
			if ($scope.isChanged.password || $scope.isChanged.confirmPassword) {
				if (password.$valid && confirmPassword.$valid) {
					user.set('password', password.$viewValue);
					parseSave(user, 'Password');
				} else {
					$scope.settings.hasErrors = true;
				}

			}
			$ionicLoading.hide();
			initChanged();
		};
		$scope.featureRequest = function() {
			var email = {
				to: 'admin@cymbit.com',
				/*global ionic*/
				subject: ionic.Platform.device() + ': ' + ionic.Platform.platform() + '-' + ionic.Platform.version() + ' Feature Request',
				app: 'gmail'
			};
			$cordovaEmailComposer.isAvailable().then(function() {
				$cordovaEmailComposer.addAlias('gmail', 'com.google.android.gm');
				$cordovaEmailComposer.open(email).then(function() {
					$cordovaDialogs.alert('Your email was succefully sent, we will get back to you with in 12-24 hours.', 'MVPlayer - Email Sent');
				});
			});
		};
		$scope.bugReport = function() {
			var email = {
				to: 'admin@cymbit.com',
				subject: ionic.Platform.device() + ': ' + ionic.Platform.platform() + '-' + ionic.Platform.version() + ' Bug Report',
				app: 'gmail'
			};
			$cordovaEmailComposer.isAvailable().then(function() {
				$cordovaEmailComposer.addAlias('gmail', 'com.google.android.gm');
				$cordovaEmailComposer.open(email).then(function() {
					$cordovaDialogs.alert('Your email was succefully sent, we will get back to you with in 12-24 hours.', 'MVPlayer - Email Sent');
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
			$cordovaDialogs.alert('You have been successfully logged out', 'MVPlayer');
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