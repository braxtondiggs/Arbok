'use strict';

angular.module('Alma.controllers', [])
	.controller('AppCtrl', ['$scope', '$rootScope', '$cordovaInAppBrowser', '$ionicLoading', '$cordovaNetwork', '$cordovaAppVersion', '$cordovaFileTransfer', '$cordovaFileOpener2', '$timeout', 'PubNub', function($scope, $rootScope, $cordovaInAppBrowser, $ionicLoading, $cordovaNetwork, $cordovaAppVersion, $cordovaFileTransfer, $cordovaFileOpener2, $timeout, PubNub) {
		/*global WifiWizard*/
		/*global Parse*/
		/*global AndroidFullScreen*/
		/*jshint camelcase: false */
		var options = {
			location: 'no',
			clearcache: 'yes',
			zoom: 'no'
		};
		PubNub.init({
			publish_key:'pub-c-4f48d6d6-c09d-4297-82a5-cc6f659e4aa2',
			subscribe_key:'sub-c-351bb442-e24f-11e4-a12f-02ee2ddab7fe'
		});
		document.addEventListener('deviceready', function() {
			if (AndroidFullScreen) {
				AndroidFullScreen.immersiveMode();
			}
			//$rootScope.$on('$cordovaNetwork:online', function(event, networkState){
			//	var onlineState = networkState;
			//	console.log(onlineState);
				$cordovaInAppBrowser.open('http://quilava.herokuapp.com/#/player/box', '_blank', options).then(function() {
					console.log('money');
				}).catch(function(event) {
					window.alert('error', event);
				});
				$cordovaAppVersion.getAppVersion().then(function (version) {
					console.log('version');
					var Server = Parse.Object.extend('Server');
					var query = new Parse.Query(Server);
					query.find({
						success: function(serverInfo) {
							console.log('parse');
							if (serverInfo[0].get('version') !== version) {
								console.log(serverInfo[0].get('url'));
								if (serverInfo[0].get('url')) {
									console.log(cordova.file);
									$cordovaFileTransfer.download(serverInfo[0].get('url'), "file:///storage/sdcard0/Download/Alma.apk", {}, true).then(function(result) {
										console.log(result);
										console.log(result.nativeURL);
										$cordovaFileOpener2.open(result.nativeURL, 'application/vnd.android.package-archive').then(function() {
											//window.location.reload();
										}, function(err) {
											console.log(err);
										}, function() {
											$timeout(function (progress) {
					                            var downloadProgress = (progress.loaded / progress.total) * 100;
					                            $ionicLoading.show({
					                                template: "Downloading：" + Math.floor(downloadProgress) + "%"
					                            });
					                            if (downloadProgress > 99) {
					                                $ionicLoading.hide();
					                            }
					                        });
										});
									});
								}
							}
						}
					});
				});

			//});
			$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
			  var offlineState = networkState;
			  //$cordovaInAppBrowser.close();
			});
		}, false);
		$rootScope.$on('$cordovaInAppBrowser:loadstop', function(e, event) {
			function WifiSetup(payload) {
				WifiWizard.isWifiEnabled(function(status) {
					if (status) {
						var wifi = WifiWizard.formatWifiConfig(payload.message.ssid, payload.message.password, 'WPA');
						WifiWizard.addNetwork(wifi, function() {
							WifiWizard.connectNetwork(payload.message.ssid, function() {
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
						}, function(){
							console.log('error');
						});
					}else {
						WifiWizard.setWifiEnabled(true, WifiSetup(payload));
					}
				});
			}
			$timeout(function() {
				$cordovaInAppBrowser.executeScript({
					code: "localStorage.getItem('ngStorage-boxCode');"
				}).then(function(value) {
					if (value) {
						$rootScope.boxCode = value[0].replace(/"/g, "");
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
			}, 10000);
		});
	}]);