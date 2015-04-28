'use strict';
angular.module('Quilava.controllers')
	.controller('PlayerSettingsDetailCtrl', ['$scope', '$cordovaCamera', '$ionicLoading', 'PubNub', function($scope, $cordovaCamera, $ionicLoading, PubNub) {
		/*global Parse*/
		$scope.psd = {};
		$scope.submitForm = function() {
			$scope.psd.geoCode($scope.address, function(geocode) {
				$scope.playerSettings.server.set('isSetup', true);
				$scope.playerSettings.server.set('userId', Parse.User.current());
				$scope.playerSettings.server.set('latlng', new Parse.GeoPoint({latitude: geocode.latitude, longitude: geocode.longitude}));
				$scope.playerSettings.server.save();
				$scope.modal.hide();
				$ionicLoading.show({
					template: 'Save was succesful...',
					duration: 2000
				});
				PubNub.ngPublish({
					channel: $scope.playerSettings.new.objID,
					message: {'player_update': $scope.playerSettings.server}
				});
			});
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
			$scope.image = null;
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
				$scope.image = file;
			}, function() {
				$ionicLoading.hide();
				$ionicLoading.show({
					template: 'Error, could not load photo...',
					duration: 2000
				});
			});
		};
	}]);