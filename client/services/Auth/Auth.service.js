'use strict';

angular.module('arbokApp')
    .factory('Auth', ['$firebaseAuth', function($firebaseAuth) {
        var ref = new Firebase('https://arbok.firebaseio.com');
        return $firebaseAuth(ref);
    }]);
