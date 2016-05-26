'use strict';

var app = require('../..');
import request from 'supertest';

describe('Track API:', function() {

  describe('GET /api/tracks', function() {
    var tracks;

    beforeEach(function(done) {
      request(app)
        .get('/api/tracks')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          tracks = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      tracks.should.be.instanceOf(Array);
    });

  });

});
