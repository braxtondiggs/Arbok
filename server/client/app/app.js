'use strict';

angular.module('serverApp', [
  'ngSanitize',
  'ngCookies',
  'ngRoute',
  'ngDialog',
  'youtubePlayer'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });