'use strict';

angular.module('serverApp')
  .controller('MainCtrl', function ($scope, $rootScope) {
  	var renderedcount = 0;
  	$rootScope.$on('$includeContentLoaded', function() {
  		renderedcount++;
    	if (renderedcount = 10) {
  			angularContentLoaded();
  		}
  	});

  });
