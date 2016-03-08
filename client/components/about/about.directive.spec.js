'use strict';

describe('Directive: about', function () {

  // load the directive's module and view
  beforeEach(module('arbokApp'));
  beforeEach(module('components/about/about.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<about></about>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the about directive');
  }));
});
