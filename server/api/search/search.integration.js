'use strict';

var app = require('../..');
import request from 'supertest';

describe('Search API:', function() {

  describe('GET /api/search', function() {
    var searchs;

    beforeEach(function(done) {
      request(app)
        .get('/api/search')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          searchs = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      searchs.should.be.instanceOf(Array);
    });

  });

});
