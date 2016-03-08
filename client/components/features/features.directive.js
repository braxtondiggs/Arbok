'use strict';

angular.module('arbokApp')
  .directive('features', function () {
    return {
      templateUrl: 'components/features/features.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
