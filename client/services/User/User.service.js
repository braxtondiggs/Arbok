'use strict';

function UserFactory(firebaseObject, config) {
	return {
		user: undefined,
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Users/' + id);
		},
		get: function(id) {
			if (!angular.isDefined(this.user)) {
				return firebaseObject(this.ref(id));
			} else {
				return this.user;
			}
		},
		set: function(user) {
			this.user = user;
		},
		create: function(obj) {
			this.set(obj);
			return this.ref(obj.id).update(obj);
		}
	};
}
UserFactory.$inject = ['$firebaseObject', 'appConfig'];

angular.module('arbokApp').factory('User', UserFactory);