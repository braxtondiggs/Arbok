'use strict';
angular.module('Alma.controllers')
	.controller('PlayerSettingsDetailCtrl', ['$scope', '$cordovaCamera', '$ionicLoading', 'PubNub', 'lodash', function($scope, $cordovaCamera, $ionicLoading, PubNub, lodash) {
		/*global Parse*/
		$scope.psd = {
			hasErrors: false
		};
		$scope.submitForm = function(isValid, name, address) {
			if (isValid) {
				$scope.psd.hasErrors = false;
				$scope.psd.geoCode(address, function(geocode) {
					$scope.playerSettings.server.set('isSetup', true);
					$scope.playerSettings.server.set('userId', Parse.User.current());
					$scope.playerSettings.server.set('latlng', new Parse.GeoPoint({latitude: geocode.latitude, longitude: geocode.longitude}));
					$scope.playerSettings.server.save();
					$scope.modal.hide();
					$ionicLoading.show({
						template: 'Save was succesful...',
						duration: 2000
					});
					if (!lodash.isEmpty($scope.playerSettings.new)) {
						$scope.players.push($scope.playerSettings.server);
					}
					var id = (!lodash.isEmpty($scope.playerSettings.new))?$scope.playerSettings.new.objID:$scope.playerSettings.server.id;
					PubNub.ngPublish({
						channel: id,
						message: {'type': 'player_update', 'id': id}
					});
					$scope.playerSettings.server = null;
				});
			}else {
				$scope.psd.hasErrors = true;
			}
		};
		$scope.psd.geoCode = function(address, callback) {
			/*global GeocoderJS*/
			var googleGeocoder = new GeocoderJS.createGeocoder({'provider': 'google'});
			googleGeocoder.geocode(address, function(result) {
				callback(result[0]);
			});
		};
		$scope.inputChange = function(name, input) {
			$scope.playerSettings.server.set(name, input);
		};
		$scope.clearImage = function() {
			$scope.playerSettings.server.unset('image');
			$scope.playerSettings.server.save();
		};
		$scope.getImage = function() {
			/* global Camera*/
			var pickerOptions = {
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				quality: 50,
				EncodingType: Camera.EncodingType.PNG,
				MediaType: Camera.MediaType.PICTURE,
				targetWidth: 150,
				targetHeight: 150
			};
			$cordovaCamera.getPicture(pickerOptions).then(function(imageData) {
				var file = new Parse.File($scope.playerSettings.new.objID + '.png', {
					base64: imageData
				});
				$scope.playerSettings.server.set('image', file);
			}, function() {
				$ionicLoading.hide();
				$ionicLoading.show({
					template: 'Error, could not load photo...',
					duration: 2000
				});
			});
		};
	}]);