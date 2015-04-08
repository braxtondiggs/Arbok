'use strict';

angular.module('serverApp')
  .controller('MainCtrl', function ($scope, $rootScope) {
  	$rootScope.$on('$includeContentLoaded', function() {
  		angularContentLoaded();
  	});

  });
