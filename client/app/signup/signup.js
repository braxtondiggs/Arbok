'use strict';

angular.module('arbokApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/signup', {
        templateUrl: 'app/signup/signup.html',
        controller: 'SignupCtrl'
      });
  });
