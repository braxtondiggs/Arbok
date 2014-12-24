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
var ParseAPI = require('node-parse-api').Parse;
var request = require("request");
var cheerio = require('cheerio');
var trim = require('trim');
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode1', config.port, app.get('env'));
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

var APP_ID = 'elI09bdCIrfXPktMALD1KdPQx8qoMeHTjkaSRQqB';
var MASTER_KEY = 'i6SnNDq5FKZVqelw2UPJs8EvFqg3KuKOrjwZPmLN';

var parse = new ParseAPI(APP_ID, MASTER_KEY);

io.sockets.on('connection', function(socket) {
    console.log('connected!');
    socket.on('user:init', function(msg, fn) {
        socket.join(msg.room);
        fn({
            playlst: 1
        });
    })
    socket.on('server:init', function(msg, fn) {
        socket.join(msg.room);
        fn({
            playlst: 1
        });
    });
    socket.on('unsubscribe', function(msg) {
        socket.leave(msg.room);
    });
    socket.on("song:new", function(msg, fn) {
        console.log("add song");
        var track_id = msg.track_id,
            jukebox_id = msg.server_id;
        var status = newSong(track_id, jukebox_id, fn);

    });
    socket.on('song ended', function(msg, fn) {
        var sid = msg.sid,
            tid = msg.tid;
        if (sid !== null && tid !== null) {
            /*connection.query("DELETE FROM jukebox_songs WHERE jukebox_id = '" + sid + "' AND track_id = '" + tid + "' LIMIT 1;", function(err, rows, results) {
                if (err) throw err;
            });
            io.emit("next song");*/
        }
    });

    function newSong(track_id, jukebox_id, fn) {
            request({
                url: "http://imvdb.com/api/v1/video/" + track_id + "?include=sources",
                json: true
            }, function(error, response, body) {
                console.log(body);
                if (!error && response.statusCode === 200) {
                    var sources = body.sources,
                        YT_Key = 0,
                        noMatch = true;
                    for (var key in sources) {
                        console.log(sources[key].source);
                        console.log(sources);
                        if (sources[key].source === "youtube") {
                            YT_Key = key;
                            noMatch = false;
                        }
                        if (noMatch) {
                            returnData(2);
                            return false;
                        }
                    }
                    var post = {
                            IMVDBtrackId: body.id,
                            IMVDBartistId: body.artists[0].slug,
                            youtubeId: body.sources[YT_Key].source_data,
                            artistInfo: body.artists[0].name,
                            trackInfo: body.song_title,
                            imagePreview: body.image.o,
                            yearInfo: body.year || 2014,
                            playerId: jukebox_id,
                            upvoteNum: 0,
                            downvoteNum: 0
                        },
                        exists = {
                            youtubeId: body.sources[YT_Key].source_data
                        };
                    parse.find('Playlist', exists, function(err, response) {
                        console.log(err);
                        console.log(response);
                        parse.insert('Playlist', post, function(err, response) {
                            console.log(response);
                            console.log(err);
                            console.log("madeit");
                        });
                    });
                }
                /*connection.query("SELECT youtube_id FROM jukebox_songs WHERE ?", where_post, function(err, rows, results) {
                            if (err) {
                                returnData(2);
                                throw err;
                            }
                            if (rows.length === 0) {
                                connection.query("INSERT INTO jukebox_songs SET ?", post, function(err, rows, results) {
                                    if (err) {
                                        returnData(2);
                                        throw err;
                                    }
                                    io.emit("new song", {
                                        youtube_id: body.sources[YT_Key].source_data,
                                        artist: body.artists[0].name,
                                        track: body.song_title,
                                        image: body.image.o,
                                        track_id: customtrack_id,
                                        imvdbtrack_id: body.id,
                                        imvdbartist_id: body.artists[0].slug,
                                        upvote: 0,
                                        downvote: 0
                                    });
                                    returnData(1);

                                });
                            } else {
                                returnData(0);
                            }

                        });
                        //socket.broadcast.to(sid).emit("new song", {youtube_id: body.sources[0].source_data, artist: body.artists[0].name, track: body.song_title, image: body.image.o});
                    } else {
                        returnData(2);
                    }
                });*/
                function returnData(status) {
                    fn({
                        status: status
                    });
                }
            });
        }
        function getIMVDB(id, list, url) {
            request(url, function(error, response, html) {
                if (!error && response.statusCode === 200) {
                    var $ = cheerio.load(html),
                        i = 0;
                    $("table.imvdb-chart-table tr").each(function(i, element) {
                        var post_music = {
                            section: id,
                            artist_order: i,
                            artist_name: trim(($(this).find(".artist_line").next("p").text() || '')),
                            artist_title: trim(($(this).find(".artist_line a").attr("title") || '')),
                            artist_image: trim(($(this).find("img").attr("src") || ''))
                        };
                        /*connection.query("INSERT INTO jukebox_section_music SET ?", post_music, function(err, rows, results) {
                            if (err) throw err;
                        });*/
                        i++;
                        console.log("artist: " + post_music.artist_name + ", title: " + post_music.artist_title + ", image: " + post_music.artist_image);
                    });
                }
            });
        }

        function genID(length) {
            var text = "",
                possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < length; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
});

// Expose app
exports = module.exports = app;