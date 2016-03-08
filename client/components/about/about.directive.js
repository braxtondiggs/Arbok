'use strict';

angular.module('arbokApp')
  .directive('about', function () {
    return {
      templateUrl: 'components/about/about.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
