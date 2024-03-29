'use strict';

describe('Directive: team', function () {

  // load the directive's module and view
  beforeEach(module('arbokApp'));
  beforeEach(module('components/team/team.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<team></team>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the team directive');
  }));
});
