'use strict';

var app = require('../..');
import request from 'supertest';

describe('Artist API:', function() {

  describe('GET /api/artists', function() {
    var artists;

    beforeEach(function(done) {
      request(app)
        .get('/api/artists')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          artists = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      artists.should.be.instanceOf(Array);
    });

  });

});
