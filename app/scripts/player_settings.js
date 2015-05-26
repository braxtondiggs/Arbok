'use strict';
angular.module('Alma.controllers')
	.controller('PlayerSettingsCtrl', ['$scope', '$rootScope', '$ionicLoading', '$cordovaDialogs', '$ionicModal', '$localStorage', '$ionicListDelegate', '$cordovaInAppBrowser', 'PubNub', function($scope, $rootScope, $ionicLoading, $cordovaDialogs, $ionicModal, $localStorage, $ionicListDelegate, $cordovaInAppBrowser, PubNub) {
		$scope.$storage = $localStorage.$default({
			initConfig: false
		});
		$scope.players = null;
		$scope.playerSettings = {
			new: {
			},
			server: []
		};
		/*global Parse*/
		$ionicModal.fromTemplateUrl('templates/modal/player_detail.html', {
			scope: $scope,
			animation: 'slide-in-up',
			controller: 'PlayerSettingsDetailCtrl'
		}).then(function(modal) {
			$scope.modal = modal;
		});
		var user = $rootScope.currentUser;
		function refreshList() {
			if (user) {
				$scope.players = null;
				var relation = user.relation('userPlayer');
				var query = relation.query();
				query.equalTo('isSetup', true);
				query.equalTo('isBox', true);
				query.find({
					success:function(list) {
						$scope.players = list;
						$scope.$broadcast('scroll.refreshComplete');
						$scope.$apply();
					}
				});
			}
		}
		refreshList();
		$scope.addNewPlayer = function() {
			function showPrompt() {
				$cordovaDialogs.prompt('The 8 character string that is visable on the TV screen.', 'Enter Player ID', ['Save', 'Cancel']).then(function(res) {
					if (res.buttonIndex === 1 && res.input1 === '') {
						showPrompt();
					} else {
						if (res.buttonIndex === 1) {
							$ionicLoading.show();
							$scope.playerSettings.new.objID = res.input1;
							var Player = Parse.Object.extend('Player');
							var query = new Parse.Query(Player);
							query.equalTo('objectId', $scope.playerSettings.new.objID);
							query.equalTo('isSetup', false);
							query.equalTo('isBox', true);
							query.find({
								success: function(results) {
									$ionicLoading.hide();
									if (results.length) {
										var user = Parse.User.current();
										var relation = user.relation('userPlayer');
										relation.add(results);
										user.save();
										$scope.playerSettings.server = results[0];
										$scope.name = $scope.playerSettings.server.get('name');
										$scope.address = $scope.playerSettings.server.get('address');
										$scope.image = ($scope.playerSettings.server.get('image'))?$scope.playerSettings.server.get('image')._url: null;
										$scope.ssid = $scope.playerSettings.server.get('SSID');
										$scope.network = $scope.playerSettings.server.get('isWifi')?$scope.playerSettings.server.get('isWifi'):false;
										$scope.modal.show();
									}else {
										showPrompt();
									}
								}
							});
						}
					}
				});
			}
			showPrompt();
		};
		$scope.editPlayer = function(index) {
			delete $scope.network; //reset
			$scope.playerSettings.server = $scope.players[index];
			$scope.name = $scope.playerSettings.server.get('name');
			$scope.address = $scope.playerSettings.server.get('address');
			$scope.image = ($scope.playerSettings.server.get('image'))?$scope.playerSettings.server.get('image')._url: null;
			$scope.ssid = $scope.playerSettings.server.get('SSID');
			$scope.network = $scope.playerSettings.server.get('isWifi')?$scope.playerSettings.server.get('isWifi'):false;
			$scope.modal.show();
		};
		$scope.deletePlayer = function(index) {
			$cordovaDialogs.confirm('Are you sure you want to delete this player?', 'Alma', ['Delete','Cancel']).then(function(res) {
				if (res === 1) {
					PubNub.ngPublish({
						channel: $scope.players[index].id,
						message: {'player_delete': $scope.players[index].id}
					});
					$scope.players[index].destroy();
					$scope.players.splice(index, 1);
					$cordovaDialogs.alert('Delete Succesful', 'Alma');
				}
			});
			$ionicListDelegate.closeOptionButtons();
		};
		$scope.closePlayerEdit = function() {
			$scope.modal.hide();
			refreshList();
		};
		$scope.getStarted = function() {
			$scope.$storage.initConfig = true;
		};
		$scope.openBrowser = function(url) {
			$cordovaInAppBrowser.open(url, '_blank', {
				location: 'yes',
				clearcache: 'yes',
				toolbar: 'yes'
			});
		};
		$scope.doRefresh = function() {
			refreshList();
		};
	}]);