'use strict';

describe('Service: Queue', function () {

  // load the service's module
  beforeEach(module('arbokApp'));

  // instantiate service
  var Queue;
  beforeEach(inject(function (_Queue_) {
    Queue = _Queue_;
  }));

  it('should do something', function () {
    expect(!!Queue).toBe(true);
  });

});
