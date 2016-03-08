'use strict';

angular.module('arbokApp')
  .directive('testimonials', function () {
    return {
      templateUrl: 'components/testimonials/testimonials.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
