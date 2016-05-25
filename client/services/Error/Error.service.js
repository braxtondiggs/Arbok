'use strict';

function ErrorFactory(toast) {
	return {
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

ErrorFactory.$inject = ['$mdToast'];

angular.module('arbokApp').factory('Error', ErrorFactory);