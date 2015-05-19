'use strict';

angular.module('Alma.controllers', [])
	.controller('AppCtrl', ['$scope', '$rootScope', '$cordovaInAppBrowser', '$cordovaNetwork', '$cordovaAppVersion', '$cordovaFileTransfer', '$cordovaFileOpener2', 'PubNub', function($scope, $rootScope, $cordovaInAppBrowser, $cordovaNetwork, $cordovaAppVersion, $cordovaFileTransfer, $cordovaFileOpener2, PubNub) {
		/*global WifiWizard*/
		/*global Parse*/
		/*global AndroidFullScreen*/
		/*jshint camelcase: false */
		var options = {
			location: 'no',
			clearcache: 'no',
			zoom: 'no'
		};
		PubNub.init({
			publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',
			subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'
		});
		document.addEventListener('deviceready', function () {
			if (AndroidFullScreen) {
				AndroidFullScreen.immersiveMode();
			}
		}, false);
		document.addEventListener('deviceready', function() {
			$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
				var onlineState = networkState;
				$cordovaInAppBrowser.open('http://quilava.herokuapp.com/#/player/box', '_blank', options).then(function() {

				}).catch(function(event) {
					window.alert('error', event);
				});
				/*$cordovaAppVersion.getAppVersion().then(function (version) {
					var Server = Parse.Object.extend('Server');
					var query = new Parse.Query(Server);
					query.find({
						success: function(serverInfo) {
							console.log(serverInfo.get('version') +"!=="+ version);
							if (serverInfo.get('version') !== version) {
								if (serverInfo.get('url')) {
									$cordovaFileTransfer.download(serverInfo.get('url'), cordova.file.documentsDirectory + 'Alma.apk', {}, true).then(function(result) {
										console.log(result);
										$cordovaFileOpener2.open(cordova.file.documentsDirectory + 'Alma.apk', 'application/vnd.android.package-archive').then(function() {
											window.location.reload();
										});
									});
								}
							}
						}
					});
				});*/

			});
			$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
			  var offlineState = networkState;
			  $cordovaInAppBrowser.close();
			});
		}, false);
		$rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event) {
			function WifiSetup(payload) {
				WifiWizard.isWifiEnabled(function(status) {
					if (status) {
						var wifi = WifiWizard.formatWifiConfig(payload.message.ssid, payload.message.password, 'WPA');
						WifiWizard.addNetwork(wifi, function() {
							PubNub.ngPublish({
								channel: $rootScope.boxCode + 'WiFi',
								message: {'type': 'setWifiConfirm', 'status': true}
							});
						}, function() {
							PubNub.ngPublish({
								channel: $rootScope.boxCode + 'WiFi',
								message: {'type': 'setWifiConfirm', 'status': false}
							});
						});
					}else {
						WifiWizard.setWifiEnabled(true, WifiSetup(payload));
					}
				});
			}
			$cordovaInAppBrowser.executeScript({
				code: "localStorage.getItem('ngStorage-boxCode');"
			}).then(function(value) {
				if (value) {
					$rootScope.boxCode = value[0].replace(/"/g, "");
					console.log($rootScope.boxCode);
					if ($rootScope.boxCode) {
						PubNub.ngSubscribe({channel: $rootScope.boxCode+'WiFi'});
						$rootScope.$on(PubNub.ngMsgEv($rootScope.boxCode+'WiFi'), function(event, payload) {
							if (payload.message.type === 'setWifi') {
								if (WifiWizard) {
									WifiSetup(payload);
								}
							}else if (payload.message.type === 'setEthernet') {
								if (WifiWizard) {
									WifiWizard.isWifiEnabled(function(status) {
										if (status) {
											WifiWizard.setWifiEnabled(false);
										}
									});
								}
							}
						});
					}
				}
			});
		});
	}]);