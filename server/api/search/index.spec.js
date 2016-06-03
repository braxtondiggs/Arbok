'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var searchCtrlStub = {
  index: 'searchCtrl.index'
};

var routerStub = {
  get: sinon.spy()
};

// require the index with our stubbed out modules
var searchIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './search.controller': searchCtrlStub
});

describe('Search API Router:', function() {

  it('should return an express router instance', function() {
    searchIndex.should.equal(routerStub);
  });

  describe('GET /api/search', function() {

    it('should route to search.controller.index', function() {
      routerStub.get
        .withArgs('/', 'searchCtrl.index')
        .should.have.been.calledOnce;
    });

  });

});
