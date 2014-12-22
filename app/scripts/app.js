'use strict';
// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Quilava', ['ionic', 'config', 'Quilava.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: '/search',
      views: {
        'menuContent' :{
          templateUrl: 'templates/search.html'
        }
      }
    })

    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent' :{
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.artist', {
      url: '/artist/:artistId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/artist.html',
          controller: 'ArtistCtrl'
        }
      }
    })
    .state('app.queue', {
      url: '/queue',
      views: {
        'menuContent' :{
          templateUrl: 'templates/queue.html',
          controller: 'QueueCtrl'
        }
      }
    })
    .state('app.player', {
      url: '/player',
      views: {
        'menuContent' :{
          templateUrl: 'templates/player.html',
          controller: 'PlayerCtrl'
        }
      }
    })
    .state('app.chat', {
      url: '/chat',
      views: {
        'menuContent' :{
          templateUrl: 'templates/chat.html',
          controller: 'ChatCtrl'
        }
      }
    })
    .state('app.music', {
      url: '/music',
      views: {
        'menuContent' :{
          templateUrl: 'templates/music.html'
        }
      }
    })
    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent' :{
          templateUrl: 'templates/settings.html'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/browse');
});

