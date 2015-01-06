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
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .factory('socket', function($rootScope, ENV) {
    var socket = io.connect(ENV.apiEndpoint);
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };

  })
  .factory('UserService', function() {
    return {
      checkImage: function(img) {
        if (img) {
          return (img.slice(-3) === "jpg") ? img : 'http://placehold.it/125x70';
        } else {
          return;
        }
      },
      convertSlug: function(name, slug) {
        if (name !== null) {
          return name;
        } else {
          return slug.replace("-", " ").replace("-", " ").replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        }
      }
    };
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
        'menuContent': {
          templateUrl: 'templates/search.html'
        }
      }
    })

    .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html',
            controller: 'BrowseCtrl'
          }
        }
      })
      .state('app.more', {
        url: '/more/:browseId',
        views: {
          'menuContent': {
            templateUrl: 'templates/more.html',
            controller: 'BrowseCtrl'
          }
        }
      })
      .state('app.artist', {
        url: '/artist/:action/:artistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/artist.html',
            controller: 'ArtistCtrl'
          }
        }
      })
      .state('app.queue', {
        url: '/queue',
        views: {
          'menuContent': {
            templateUrl: 'templates/queue.html',
            controller: 'QueueCtrl'
          }
        }
      })
      .state('app.player', {
        url: '/player',
        views: {
          'menuContent': {
            templateUrl: 'templates/player.html',
            controller: 'PlayerCtrl'
          }
        }
      })
      .state('app.chat', {
        url: '/chat',
        views: {
          'menuContent': {
            templateUrl: 'templates/chat.html',
            controller: 'ChatCtrl'
          }
        }
      })
      .state('app.music', {
        url: '/music',
        views: {
          'menuContent': {
            templateUrl: 'templates/music.html'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/browse');
  });