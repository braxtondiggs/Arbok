'use strict';

angular.module('arbokApp')
  .factory('PlayerService', ['$firebaseObject', function($firebaseObject) {
        return function(userId) {
            var ref = new Firebase('https://arbok.firebaseio.com/Player/' + userId);

            // return it as a synchronized object
            return $firebaseObject(ref);
        }
    }]);
