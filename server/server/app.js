/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode1', config.port, app.get('env'));
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});


  io.sockets.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('server init', function(msg, fn) {
        var sid = 12,//genID(12),
            post = {
                sid: sid,
                name: msg.name,
                lat: msg.location.lat,
                lng: msg.location.lng
            };
        /*connection.query("INSERT INTO jukebox_locations SET ?", post, function(err, rows, results) {
            if (err) throw err;
            socket.broadcast.emit('New Server');
            connection.query('SELECT * FROM jukebox_songs WHERE jukebox_id = ?', [sid], function(err, rows, results) {
                fn({
                    sid: sid,
                    playlist: rows
                });
            });
        });*/
    });
  });

// Expose app
exports = module.exports = app;