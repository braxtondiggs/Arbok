'use strict';

function RoomService(firebaseArray, firebaseObject, config) {
	return {
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Player/' + id + '/connected');
		},
		refSingle: function(id, key) {
			return this.ref(id, key).child(key);
		},
		get: function(id) {
			return firebaseArray(this.ref(id));
		},
		getSingle: function(id, key) {
			return firebaseObject(this.refSingle(id, key));
		}
	}
}
RoomService.$inject = ['$firebaseArray', '$firebaseObject', 'appConfig'];

angular.module('arbokApp').service('Room', RoomService);