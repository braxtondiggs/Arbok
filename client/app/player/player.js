'use strict';

angular.module('arbokApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/player', {
        templateUrl: 'app/player/player.html',
        controller: 'PlayerCtrl'
      });
  });
