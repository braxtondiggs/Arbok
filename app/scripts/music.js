'use strict';
angular.module('Alma.controllers')
	.controller('MusicCtrl', ['$scope', '$cordovaDialogs', '$ionicLoading', '$ionicScrollDelegate', '$ionicHistory', '$localStorage', '$window', '$state', function($scope, $cordovaDialogs, $ionicLoading, $ionicScrollDelegate, $ionicHistory, $localStorage, $window, $state) {
		$scope.$storage = $localStorage.$default({
			'myMusic': []
		});
		$ionicLoading.show('Accessing Filesystem.. Please wait');
		$scope.showSubDirs = function(file) {
			if (file.isDirectory || file.isUpNav) {
				if (file.isUpNav) {
					processFile(file.nativeURL.replace(file.actualName + '/', ''));
				} else {
					processFile(file.nativeURL);
				}
			} else {
				if (hasExtension(file.name)) {
					console.log(file.name);
					console.log(file.localURL);
					$window.ID3.loadTags(file.nativeURL, function() {
					    var tags = $window.ID3.getAllTags(file.nativeURL);
					   $window.alert(tags.artist + ' - ' + tags.title + ', ' + tags.album);
					   console.log(tags);
					}, {
						//dataReader: FileAPIReader(file),
						tags: ['artist', 'album', 'track', 'title', 'picture'],
						onError: function(reason) {
							console.log(reason);
						}
					});
				}
			}
		};
		if ($window.LocalFileSystem) {
			$window.requestFileSystem($window.LocalFileSystem.PERSISTENT, 0, function(fs) {
				var directoryReader = fs.root.createReader();
				directoryReader.readEntries(function(entries) {
					var arr = [];
					processEntries(entries, arr); // arr is pass by refrence
					$scope.files = arr;
					$ionicLoading.hide();
				}, function(error) {
					console.log(error);
				});
			}, function(error) {
				console.log(error);
			});
		}else {
			$ionicLoading.hide();
			$cordovaDialogs.alert('We could not access your music directory, please check back later.', 'Alma - Error').then(function() {
				$state.transitionTo('app.dashboard');
				$ionicHistory.nextViewOptions({
					historyRoot: true
				});
			});
		}

		function fsResolver(url, callback) {
			$window.resolveLocalFileSystemURL(url, callback);
		}

		function hasExtension(fileName) {
			var exts = ['.mp3', '.m4a', '.ogg', '.mp4', '.aac'];
			return (new RegExp('(' + exts.join('|').replace(/\./g, '\\.') + ')$')).test(fileName);
		}

		function processFile(url) {
			fsResolver(url, function(fs) {
				var directoryReader = fs.createReader();
				directoryReader.readEntries(function(entries) {
					if (entries.length > 0) {
						var arr = [];
						// push the path to go one level up
						if (fs.fullPath !== '/') {
							arr.push({
								id: 0,
								name: '.. One level up',
								actualName: fs.name,
								isDirectory: false,
								isUpNav: true,
								nativeURL: fs.nativeURL,
								fullPath: fs.fullPath
							});
						}
						processEntries(entries, arr);
						$scope.$apply(function() {
							$scope.files = arr;
						});
						$ionicScrollDelegate.scrollTop();
					} else {
						$ionicLoading.show({
							template: fs.name + ' folder is empty!',
							duration: 2000
						});
					}
				}, function(error) {
					console.log(error);
				});
			});
		}

		function processEntries(entries, arr) {
			for (var i = 0; i < entries.length; i++) {
				var e = entries[i];
				// do not push/show hidden files or folders
				if (e.name.indexOf('.') !== 0) {
					arr.push({
						id: i + 1,
						name: e.name,
						isUpNav: false,
						isDirectory: e.isDirectory,
						nativeURL: e.nativeURL,
						fullPath: e.fullPath
					});
				}
				//$window.LocalFileSystem.root.getFile(currentFileEntry.nativeURL.replace('file://', ''), null, getInfo, fail); This will call the function to check the file for mp3s
			}
			return arr;
		}
	}]);