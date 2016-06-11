'use strict';

function QueueService(firebaseArray, firebaseObject, config) {
	return {
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Player/' + id + '/queue');
		},
		refSingle: function(id, key) {
			return this.ref(id).child(key);
		},
		get: function(id) {
			return firebaseArray(this.ref(id));
		},
		getSingle: function(id, key) {
			return firebaseObject(this.refSingle(id, key));
		},
		add: function(id, data) {
			return this.get(id).$add(data);
		}
	}
}
QueueService.$inject = ['$firebaseArray', '$firebaseObject', 'appConfig'];

angular.module('arbokApp').service('Queue', QueueService);