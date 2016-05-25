(function(angular, undefined) {
'use strict';

angular.module('arbokApp.constants', [])

.constant('appConfig', {userRoles:['guest','user','admin'],FIREBASE_URL:'https://arbok.firebaseio.com/'})

;
})(angular);