'use strict';

function PlayerFactory(firebaseObject, config) {
	return {
		players: undefined,
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Player/' + id);
		},
		get: function(id) {
			if (!angular.isDefined(this.players)) {
				return firebaseObject(this.ref(id));
			} else {
				return this.players;
			}
		},
		set: function(player) {
			this.players = player;
		},
		create: function(obj) {
			this.set(obj);
			return this.ref(obj.id).update(obj);
		}
	};
}

PlayerFactory.$inject = ['$firebaseObject', 'appConfig'];

angular.module('arbokApp').factory('Player', PlayerFactory);