'use strict';
angular.module('MVPlayer', ['ngSanitize', 'ngRoute', 'ngSanitize', 'youtubePlayer', 'ngStorage', 'ngDialog', 'pubnub.angular.service', 'angular-echonest'])
  	.config(function ($routeProvider, $locationProvider, EchonestProvider) {
		$routeProvider.when('/', {
			templateUrl: 'views/main.html',
			controller: 'MainCtrl'
		  })
		.when('/player', {
			templateUrl: 'views/player.html',
			controller: 'PlayerCtrl'
		})
		.when('/player/box', {
			templateUrl: 'views/box.html',
			controller: 'PlayerCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
		$locationProvider.html5Mode(true);
		/*global Parse*/
		Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');
		EchonestProvider.setApiKey('0NPSO7NBLICGX3CWQ');
	});