'use strict';

function PlayerFactory(firebaseObject, _, config) {
	return {
		players: undefined,
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Player' + ((!_.isUndefined(id)) ? '/' + id : ''));
		},
		get: function(id) {
			return firebaseObject(this.ref(id));
		},
		create: function(obj) {
			return this.ref().push(obj);
		},
		update: function(obj) {
			return this.ref(obj.$id).update(obj);
		},
		location: function() {
			var ref = new Firebase(config.FIREBASE_URL + 'Locations/Player');
			return new GeoFire(ref);
		}
	};
}

PlayerFactory.$inject = ['$firebaseObject', 'lodash', 'appConfig'];

angular.module('arbokApp').factory('Player', PlayerFactory);