'use strict';
angular.module('arbokApp')
    .controller('MainController', function($scope, $timeout) {
        $scope.$on('$viewContentLoaded', function() {
            $timeout(function() {
                angularContentLoaded(); // jshint ignore:line
            }, 500);
        });
    });
