'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var artistCtrlStub = {
  index: 'artistCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var artistIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './artist.controller': artistCtrlStub
});

describe('Artist API Router:', function() {

  it('should return an express router instance', function() {
    artistIndex.should.equal(routerStub);
  });

  describe('GET /api/artists', function() {

    it('should route to artist.controller.index', function() {
      routerStub.get
        .withArgs('/', 'artistCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
