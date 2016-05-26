'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var trackCtrlStub = {
  index: 'trackCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var trackIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './track.controller': trackCtrlStub
});

describe('Track API Router:', function() {

  it('should return an express router instance', function() {
    trackIndex.should.equal(routerStub);
  });

  describe('GET /api/tracks', function() {

    it('should route to track.controller.index', function() {
      routerStub.get
        .withArgs('/', 'trackCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
