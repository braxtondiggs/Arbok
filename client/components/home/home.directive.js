'use strict';

angular.module('arbokApp')
  .directive('home', function () {
    return {
      templateUrl: 'components/home/home.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
