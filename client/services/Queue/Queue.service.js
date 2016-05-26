'use strict';

function QueueService(firebaseArray, config) {
	return {
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Player/' + id + '/queue');
		},
		get: function(id) {
			return firebaseArray(this.ref(id));
		},
		add: function(id, data) {
			return this.get(id).$add(data);
		}
	}
}
QueueService.$inject = ['$firebaseArray', 'appConfig'];

angular.module('arbokApp').service('Queue', QueueService);