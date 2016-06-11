'use strict';

function ChatService(firebaseArray, firebaseObject, config) {
	return {
		ref: function(id) {
			return new Firebase(config.FIREBASE_URL + 'Player/' + id + '/chat');
		},
		refSingle: function(id, key) {
			return this.ref(id).child(key);
		},
		get: function(id) {
			return firebaseArray(this.ref(id));
		},
		getSingle: function(id, key) {
			return firebaseObject(this.refSingle(id, key));
		}
	}
}
ChatService.$inject = ['$firebaseArray', '$firebaseObject', 'appConfig'];

angular.module('arbokApp').service('Chat', ChatService);