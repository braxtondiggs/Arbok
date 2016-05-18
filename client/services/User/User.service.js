'use strict';

angular.module('arbokApp')
    .factory('UserService', ['$firebaseObject', function($firebaseObject) {
        return function(userId) {
            var ref = new Firebase('https://arbok.firebaseio.com/Users/' + userId);

            // return it as a synchronized object
            return $firebaseObject(ref);
        }
    }]);
