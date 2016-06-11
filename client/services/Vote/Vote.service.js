'use strict';

function VoteService(firebaseArray, firebaseObject, config) {
	return {
		ref: function(id, key) {
			return new Firebase(config.FIREBASE_URL + 'Player/' + id + '/queue/' + key + '/votes');
		},
		refSingle: function(id, key, vote) {
			return this.ref(id, key).child(vote);
		},
		get: function(id, key) {
			return firebaseArray(this.ref(id, key));
		},
		getSingle: function(id, key, vote) {
			return firebaseObject(this.refSingle(id, key, vote));
		}
	}
}
VoteService.$inject = ['$firebaseArray', '$firebaseObject', 'appConfig'];

angular.module('arbokApp').service('Vote', VoteService);