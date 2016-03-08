'use strict';

describe('Directive: contact', function () {

  // load the directive's module and view
  beforeEach(module('arbokApp'));
  beforeEach(module('components/contact/contact.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<contact></contact>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the contact directive');
  }));
});
