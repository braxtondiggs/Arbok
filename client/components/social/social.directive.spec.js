'use strict';

describe('Directive: social', function () {

  // load the directive's module and view
  beforeEach(module('arbokApp'));
  beforeEach(module('components/social/social.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<social></social>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the social directive');
  }));
});
