'use strict';

function HistoryService(firebaseArray, config) {
	return {
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Player/' + id + '/history');
		},
		get: function(id) {
			return firebaseArray(this.ref(id));
		},
		add: function(id, data) {
			return this.get(id).$add(data);
		}
	}
}
HistoryService.$inject = ['$firebaseArray', 'appConfig'];

angular.module('arbokApp').service('History', HistoryService);