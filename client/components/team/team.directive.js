'use strict';

angular.module('arbokApp')
  .directive('team', function () {
    return {
      templateUrl: 'components/team/team.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
