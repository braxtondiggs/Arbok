'use strict';

describe('Directive: testimonials', function () {

  // load the directive's module and view
  beforeEach(module('arbokApp'));
  beforeEach(module('components/testimonials/testimonials.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<testimonials></testimonials>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the testimonials directive');
  }));
});
