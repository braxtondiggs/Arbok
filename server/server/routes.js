/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/music', require('./routes/music'));
  app.use('/api/things', require('./api/thing'));
  app.route('/image_gallery/:objectId')
    .get(function(req, res) {
      //res.sendfile(app.get('appPath') + '/app/image_gallery/image_gallery.html', {vars: 'hi'});
      res.render('image_gallery.html', { title: 'Ninja Store' })
    });
    app.route('/info_gallery/:objectId')
    .get(function(req, res) {
      //res.sendfile(app.get('appPath') + '/app/info_gallery/info_gallery.html', {vars: 'hi'});
      res.render('info_gallery.html', { title: 'Ninja Store' })
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
