'use strict';
angular.module('Quilava', ['ionic', 'ngCordova', 'config', 'filter', 'Quilava.controllers', 'angular-loading-bar', 'cfp.loadingBar', 'angular-echonest', 'ngStorage', 'ngTextTruncate', 'ngCordovaOauth', 'ngLodash'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  /*global Parse*/
  Parse.initialize('GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k', 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE');
})

/*.factory('socket', function($rootScope, ENV) {
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

  })*/
  .factory('UserService', function() {
    return {
      checkImage: function(img) {
        if (img) {
          return (img.slice(-3) === 'jpg') ? img : 'http://placehold.it/125x70';
        } else {
          return;
        }
      },
      convertSlug: function(name, slug) {
        if (name !== null && name !== undefined && name !== '') {
          return name;
        } else if(slug !== null && slug !== undefined && slug !== '') {
          if (isNaN(slug)){
            return slug.replace('-', ' ').replace('-', ' ').replace(/\w\S*/g, function(txt) {
              return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
          }else {
            return slug;
          }
        } else {
          return '';
        }
      }
    };
  })
  .factory('LoadingService', function(cfpLoadingBar, $ionicLoading) {
    return {
      showLoading: function() {
        cfpLoadingBar.start();
        cfpLoadingBar.inc();
        $ionicLoading.show({
          animation: 'fade-in',
          showBackdrop: false
        });
      },
      hideLoading: function() {
        $ionicLoading.hide();
        cfpLoadingBar.complete();
      }
    };
  })
  .directive('watchMenu', function($timeout, $ionicSideMenuDelegate) {
  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {
      // Run in the next scope digest
      $timeout(function() {
        // Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is

        $scope.$watch(function() { 
          return $ionicSideMenuDelegate.getOpenRatio();
        }, 
          function(ratio) {
            $scope.data=ratio;
            if( ratio == 1){
              $scope.ratio = true;
            }else{
              $scope.ratio = false;
            }

          });
      });
    }
  };
})
  .config(['EchonestProvider', function(EchonestProvider) {
    EchonestProvider.setApiKey('0NPSO7NBLICGX3CWQ');
  }])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: '/search/{searchId}/',
      className: 'search',
      params: {
        searchId: {value: null, squash: true}
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/search.html',
          controller: 'SearchCtrl',
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
        className: 'player',
        views: {
          'menuContent': {
            templateUrl: 'templates/player.html',
            controller: 'PlayerCtrl'
          }
        }
      })
      .state('app.music', {
        url: '/music',
        views: {
          'menuContent': {
            templateUrl: 'templates/music.html',
            controller: 'MusicCtrl'
          }
        }
      })
      .state('app.settings', {
        url: '/settings',
        className: 'settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'SettingsCtrl'
          }
        }
      })
      .state('app.settings-player', {
        url: '/settings/player',
        className: 'player_settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/player_settings.html',
            controller: 'PlayerSettingsCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/browse');
  });