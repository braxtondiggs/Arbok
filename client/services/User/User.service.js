'use strict';

function UserFactory(firebaseObject, config) {
	return {
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Users/' + id);
		},
		get: function(id) {
			return firebaseObject(this.ref(id));
		},
		update: function(obj) {
			return this.ref(obj.id).update(obj);
		}
	};
}
UserFactory.$inject = ['$firebaseObject', 'appConfig'];

angular.module('arbokApp').factory('User', UserFactory);