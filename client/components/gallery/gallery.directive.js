'use strict';

angular.module('arbokApp')
  .directive('gallery', function () {
    return {
      templateUrl: 'components/gallery/gallery.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
