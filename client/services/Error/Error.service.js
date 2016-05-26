'use strict';

function ErrorFactory(toast, config, firebaseArray) {
	return {
		ref: function() {
			return new Firebase(config.FIREBASE_URL + 'Error');
		},
		get: function() {
			return firebaseArray(this.ref());
		},
		system: function(txt) {
			toast.show(
				toast.simple()
				.textContent(txt)
				.position('bottom')
				.hideDelay(3000)
			);
		}
	};
}

ErrorFactory.$inject = ['$mdToast', 'appConfig', '$firebaseArray'];

angular.module('arbokApp').factory('Error', ErrorFactory);