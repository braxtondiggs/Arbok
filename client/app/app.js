'use strict';

angular.module('arbokApp', [
  'arbokApp.constants',
  'ngRoute',
  'ngMessages',
  'ngStorage',
  'ngDialog',
  'ngMaterial',
  'ngIdle',
  'cgNotify',
  'ngLodash',
  'angularMoment',
  'youtubePlayer'
])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });
