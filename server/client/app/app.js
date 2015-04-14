'use strict';

angular.module('serverApp', ['serverApp.controllers', 'ngCookies', 'ngSanitize', 'ngRoute', 'ngDialog', 'youtubePlayer', 'ngStorage'])
.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .otherwise({
      redirectTo: '/'
    });
  
  $locationProvider.html5Mode(true);
  Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');
});