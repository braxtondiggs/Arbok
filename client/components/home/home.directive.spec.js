'use strict';

describe('Directive: home', function () {

  // load the directive's module and view
  beforeEach(module('arbokApp'));
  beforeEach(module('components/home/home.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<home></home>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the home directive');
  }));
});
