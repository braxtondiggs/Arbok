'use strict';

angular.module('arbokApp')
  .directive('videos', function () {
    return {
      templateUrl: 'components/videos/videos.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
