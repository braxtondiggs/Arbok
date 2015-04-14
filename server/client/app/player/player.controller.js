'use strict';
angular.module('serverApp.controllers', [])
.controller('PlayerCtrl', ['$scope', '$location', '$localStorage', 'ngDialog', function($scope, $location, $localStorage, ngDialog) {
    $scope.isBox = ($location.path().indexOf('box') > -1) ? true : false;
    $scope.$storage = $localStorage.$default({
        boxCode: null
    });
    $scope.player = {
        width: $(window).width(),
        height: $(window).height(),
        videoId: 'UpRssA0CQ0E',
        playerVars: {
            controls: 0,
            disablekb: 0,
            showinfo: 0,
            rel: 0,
            iv_load_policy: 3,
            autoplay: 0
        }
    };
    $scope.onReady = function(event) {
        
    };
    $scope.openPlayerSetupDialog = function() {
        if ($scope.$storage.boxCode == null) {
            getID();
        }else {
            var Player = Parse.Object.extend('Player');
            var query = new Parse.Query(Player);
            query.equalTo('objectId', $scope.$storage.boxCode);
            query.first({
                success: function(object) {
                    if (object !== undefined) {
                        openModal();
                    }else {
                        getID();
                    }
                },
                error: function(gameScore, error) {
                    var c = confirm('Failed to initalize new player, with error code: ' + error.message);
                    if (c) {
                        window.location.reload();
                    }
                }
            });
        }
        function openModal() {
            ngDialog.open({
                template: 'boxSetupTmpl',
                className: 'ngdialog-boxSetup ngdialog-theme-default',
                showClose: false,
                closeByEscape: false,
                closeByDocument: false,
                scope: $scope
            });
        }
        function getID() {
            var Player = Parse.Object.extend('Player');
            var player = new Player();
            player.set("isBox", true);
            player.set("isSetup", false);
            player.save(null, {
                success: function(object) {
                    $scope.$storage.boxCode = object.id;
                    openModal();
                },
                error: function(gameScore, error) {
                    var c = confirm('Failed to initalize new player, with error code: ' + error.message);
                    if (c) {
                        window.location.reload();
                    }
                }
            });
        }
    };
    if($scope.isBox) {
    $scope.openPlayerSetupDialog();
    }
}]);