'use strict';

function AuthFactory(auth, config) {
	var ref = new Firebase(config.FIREBASE_URL);
	return auth(ref);
}
AuthFactory.$inject = ['$firebaseAuth', 'appConfig'];

angular.module('arbokApp').factory('Auth', AuthFactory);