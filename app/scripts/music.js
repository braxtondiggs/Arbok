'use strict';
angular.module('Quilava.controllers')
.controller('MusicCtrl', ['$scope', '$localStorage', '$ionicLoading', 'lodash', function($scope, $localStorage, $ionicLoading, lodash)  {
	$scope.$storage = $localStorage.$default({
    	'myMusic': []
    });
	$scope.refreshMusic = function(){
        $ionicLoading.show({template: 'Searching audio files, please wait...'});
        $scope.$storage.myMusic = null;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
            function collectMedia(path, recursive, level) {
           	if (level === undefined) { 
           		level = 0;
           	}
      		var directoryEntry = new DirectoryEntry('', path);
      		if(!directoryEntry.isDirectory) {
         		console.log('The provided path is not a directory');
         		return;
     		}
      		var directoryReader = directoryEntry.createReader();
      		directoryReader.readEntries(function (entries) {
            var extension;
            for (var i = 0; i < entries.length; i++) {
               	if (entries[i].name === '.') {
               		continue;
               	}
               	extension = entries[i].name.substr(entries[i].name.lastIndexOf('.'));
               	if (entries[i].isDirectory === true && recursive === true) {
                  	collectMedia(entries[i].fullPath, recursive, level + 1);
               	} else if (entries[i].isFile === true && lodash.indexOf(['.mp3', '.wav', '.m4a'], extension) >= 0) {
                  
                  //$scope.$storage.myMusic.push(entries[i].fullPath);
                  console.log('File saved: ' + entries[i].fullPath);
               }
            }
        }, function(error) {
            console.log('Unable to read the directory. Errore: ' + error.code);
        });
      		console.log('Current path analized is: ' + path);
        }
            var root = fileSystem.root;
            collectMedia(root.fullPath, true, undefined);
        },
        function(error){
            console.log('File System Error: ' + error.code);
        });
        //$scope.$broadcast('scroll.refreshComplete');
	};
	if (lodash.isEmpty($scope.$storage.myMusic)) {//check if ran before
		$scope.refreshMusic();
	}
}]);