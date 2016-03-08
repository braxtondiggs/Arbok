'use strict';

angular.module('arbokApp')
  .directive('contact', function () {
    return {
      templateUrl: 'components/contact/contact.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
      }
    };
  });
