'use strict';

describe('Directive: videos', function () {

  // load the directive's module and view
  beforeEach(module('arbokApp'));
  beforeEach(module('components/videos/videos.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<videos></videos>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the videos directive');
  }));
});
