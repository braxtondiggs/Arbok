'use strict';
angular.module('Quilava.controllers')
	.controller('PlayerSettingsCtrl', ['$scope', '$ionicLoading', '$ionicPopup', '$ionicModal', '$localStorage', '$cordovaInAppBrowser', function($scope, $ionicLoading, $ionicPopup, $ionicModal, $localStorage, $cordovaInAppBrowser) {
		$scope.$storage = $localStorage.$default({
			initConfig: false
		});
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
		var user = Parse.User.current();
		var relation = user.relation('userPlayer');
		var query = relation.query();
		query.equalTo('isSetup', true);
		query.equalTo('isBox', true);
		query.find({
			success:function(list) {
				$scope.players = list;
				$scope.$apply();
			}
		});
		$scope.addNewPlayer = function() {
			function showPrompt() {
				$ionicPopup.show({
					template: '<div class="input"><input type="text" class="input__field" ng-model="playerSettings.new.objID"></div>',
					title: 'Enter Player ID',
					subTitle: 'The 8 character string that is visable on the TV screen.',
					scope: $scope,
					buttons: [
						{ text: 'Cancel' },
						{
							text: '<b>Save</b>',
							type: 'button-positive',
							onTap: function(e) {
								if (!$scope.playerSettings.new.objID) {
									e.preventDefault();
								} else {
									$ionicLoading.show();
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
												$scope.modal.show();
											}else {
												showPrompt();
											}
										}
									});
								}
							}
						}
					]
				});
			}
			showPrompt();
		};
		$scope.editPlayer = function(index) {
			$scope.playerSettings.server = $scope.players[index];
			$scope.name = $scope.playerSettings.server.get('name');
			$scope.address = $scope.playerSettings.server.get('address');
			$scope.image = ($scope.playerSettings.server.get('image'))?$scope.playerSettings.server.get('image')._url: null;
			$scope.modal.show();
		};
		$scope.deletePlayer = function(index) {
			PubNub.ngPublish({
				channel: $scope.player[index].id,
				message: {'player_delete': $scope.player[index].id}
			});
			$scope.player[index].destroy();
		};
		$scope.closePlayerEdit = function() {
			$scope.modal.hide();
		};
		$scope.getStarted = function() {
			$scope.$storage.initConfig = true;
		};
		$scope.openBrowser = function(url) {
			$cordovaInAppBrowser.open(url, '_blank', {
				location: 'yes',
				clearcache: 'yes',
				toolbar: 'no'
			});
		};
	}]);