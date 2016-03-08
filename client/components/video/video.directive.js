'use strict';

angular.module('arbokApp')
  .directive('video', function () {
    return {
      templateUrl: 'components/video/video.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
