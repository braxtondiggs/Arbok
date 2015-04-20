'use strict';
angular.module('Quilava.controllers')
	.controller('SettingsCtrl', ['$scope', '$rootScope', '$state', '$ionicLoading', '$ionicPopup', '$ionicHistory', '$cordovaEmailComposer', '$localStorage', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $ionicHistory, $cordovaEmailComposer, $localStorage) {
		/*global Parse*/
		$scope.settingsForm = {};
		console.log(Parse.User.current());
		if (Parse.User.current()) {
			$scope.name = $rootScope.currentUser.get('name');
			$scope.gender = $rootScope.currentUser.get('gender');
			$scope.mobileNotifications = $rootScope.currentUser.get('mobileNotifications') || true;
			$scope.email = $rootScope.currentUser.getEmail();
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
			var user = $rootScope.currentUser;
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
			var user = $rootScope.currentUser;
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
			console.log(gender);
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
					$ionicPopup.alert({
						title: 'MVPlayer - Email Sent',
						template: 'Your email was succefully sent, we will get back to you with in 12-24 hours.'
					});
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
					$ionicPopup.alert({
						title: 'MVPlayer - Email Sent',
						template: 'Your email was succefully sent, we will get back to you with in 12-24 hours.'
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
			$ionicPopup.alert({
				title: 'MVPlayer',
				template: 'You have been successfully logged out'
			});
		};
		$scope.deleteAccount = function() {
			$ionicPopup.confirm({
				title: 'Delete Your Account',
				template: 'Deleting your account will also remove all of your library data. This is permanent and cannout be undone. Are your sure?',
				buttons: [{
					text: 'Cancel'
				}, {
					text: 'Yes',
					type: 'button-positive',
					onTap: function() {
						$ionicLoading.show();
						var user = $rootScope.currentUser;
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
				}]
			});
		};
	}]);