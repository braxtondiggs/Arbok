'use strict';

angular.module('serverApp')
	.controller('PlayerCtrl', function($scope, socket) {
		$scope.message = 'Hello';
	});