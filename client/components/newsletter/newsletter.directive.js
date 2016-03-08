'use strict';

angular.module('arbokApp')
  .directive('newsletter', function () {
    return {
      templateUrl: 'components/newsletter/newsletter.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
