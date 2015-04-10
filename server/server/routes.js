/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/music', require('./routes/music'));
  app.use('/api/things', require('./api/thing'));
  app.route('/gallery/:objectId')
    .get(function(req, res) {
      //res.sendfile(app.get('appPath') + '/app/image_gallery/image_gallery.html', {vars: 'hi'});
      res.render('gallery.html', { title: 'Ninja Store' })
    });
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
