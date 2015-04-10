'use strict';

angular.module('serverApp')
.controller('MainCtrl', ['$scope', function ($scope) {
	var renderedcount = 0;
	$scope.$on('$includeContentLoaded', function() {
		renderedcount++;
		if (renderedcount === 10) {
			angularContentLoaded();
		}
	});
}]);
