'use strict';
angular.module('Quilava.controllers')
	.controller('ProfileCtrl', ['$scope', '$ionicActionSheet', '$ionicLoading', '$cordovaCamera', function($scope, $ionicActionSheet, $ionicLoading,$cordovaCamera) {
		/*global Parse*/
		$scope.updateImage = function() {
			var hideSheet = $ionicActionSheet.show({
				buttons: [{
					text: 'Choose Image'
				}, {
					text: 'Take Photo'
				}],
				titleText: 'Photo Upload',
				cancelText: 'Cancel',
				buttonClicked: function(index) {
					$ionicLoading.show();

					function uploadPhoto(image) {
						function loadComplete() {
							hideSheet();
							$ionicLoading.hide();
						}
						var user = Parse.User.current();
						var file = new Parse.File(user.id + '.png', {
							base64: image
						});
						user.set('image', file);
						user.save(null, {
							success: function() {
								loadComplete();
							},
							error: function() {
								loadComplete();
								$ionicLoading.show({
									template: 'Error, we could not upload your photo...',
									duration: 2000
								});
							}
						});
					}

					function imageError() {
						hideSheet();
						$ionicLoading.hide();
						$ionicLoading.show({
							template: 'Error, could not load photo...',
							duration: 2000
						});
					}
					if (index === 0) {
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
							uploadPhoto(imageData);
						}, function() {
							imageError();
						});
					} else if (index === 1) {
						var cameraOptions = {
							quality: 50,
							destinationType: Camera.DestinationType.DATA_URL,
							sourceType: Camera.PictureSourceType.CAMERA,
							encodingType: Camera.EncodingType.PNG,
							correctOrientation: true,
							targetWidth: 150,
							allowEdit: true
						};
						$cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
							uploadPhoto(imageData);
						}, function() {
							imageError();
						});
					}
				}
			});
		};
	}]);