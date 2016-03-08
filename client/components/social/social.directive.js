'use strict';

angular.module('arbokApp')
  .directive('social', function () {
    return {
      templateUrl: 'components/social/social.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
