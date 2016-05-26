'use strict';

function PlayerFactory(firebaseObject, config) {
	return {
		players: undefined,
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Player/' + id);
		},
		get: function(id) {
			return firebaseObject(this.ref(id));
		},
		create: function(obj) {
			var ref = new Firebase(config.FIREBASE_URL + 'Player');
			return ref.push(obj);
		},
		update: function(obj) {
			return this.ref(obj.id).update(obj);
		}
	};
}

PlayerFactory.$inject = ['$firebaseObject', 'appConfig'];

angular.module('arbokApp').factory('Player', PlayerFactory);