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
var Kaiseki = require('kaiseki');
var ParseAPI = require('node-parse-api').Parse;
var request = require('request');
var cheerio = require('cheerio');
var echonest = require('echonest');
var trim = require('trim');
var CronJob = require('cron').CronJob;
var time = require('time');
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode1', config.port, app.get('env'));
});

var APP_ID = 'GxJOG4uIVYMnkSuRguq8rZhTAW1f72eOQ2uXWP0k';
var MASTER_KEY = 'zksioMSekJ2a6vctzq6LvFhptRCc0Dn64Qpsv1GJ';
var REST_API_KEY = '3lVlmpc7FZg1EVL9Lg6Hfo68xEP4yMnurm9zT38z';
var JAVASCRIPT_KEY = 'WdvDW26S4r3o5F35HCC9gM5tAYah3tyTwXlwRBvE';

var kaiseki = new Kaiseki(APP_ID, REST_API_KEY);
var Parse = new ParseAPI(APP_ID, MASTER_KEY);
var myNest = new echonest.Echonest({
    api_key: '0NPSO7NBLICGX3CWQ'
});

io.sockets.on('connection', function(socket) {
    console.log('connected!');
    socket.on('user:init', function(msg, fn) {
        socket.join(msg.room);
        kaiseki.getObjects('Playlist', {
            where: {
                playerId: msg.room
            },
            order: 'createdAt'
        }, function(err, res, body, success) {
            fn(body);
        });
    })
    socket.on('server:init', function(msg, fn) {
        socket.join(msg.room);
        kaiseki.getObjects('Playlist', {
            where: {
                playerId: msg.room
            },
            order: 'createdAt',
            count: true
        }, function(err, res, body, success) {
            if (body.count > 0) {
                fn(body.results);
            } else {
                emptyQueue('Drake', msg.room);
            }
        });
    });
    socket.on('unsubscribe', function(msg) {
        socket.leave(msg.room);
    });
    socket.on('chat:init', function(msg, fn) {
        kaiseki.getObjects('Chat', {
            where: {
                room: msg.room
            },
            order: 'createdAt'
        }, function(err, res, body, success) {
            fn(body);
        });
    });
    socket.on('chat', function(msg) {
        var room = msg.room,
            from = msg.from,
            img = msg.img,
            _body = msg.body,
            userId = msg.userId;
        kaiseki.createObject('Chat', {
            room: room,
            from: from,
            image: img,
            body: _body,
            userId: userId
        }, function(err, res, body, success) {
            io.sockets.in(room).emit("chat:new", {
                from: from,
                image: img,
                body: _body,
                userId: userId
            });
        });
    });
    socket.on("vote:client", function(msg, fn) {
        var room = msg.server_id,
            trackId = msg.track_id,
            userId = msg.userId,
            vote = msg.vote,
            hasVoted = msg.hasVoted,
            upVote = msg.upVote,
            downVote = msg.downVote,
            voteId = msg.voteId,
            voteChoice = (upVote)?"upvote":"downvote";
        var params = {
            playerId: room,
            trackId: trackId,
            userId: userId,
            upVote: upVote,
            downVote: downVote
        };
        if (hasVoted) {
            kaiseki.updateObject('Vote', voteId, {
                upVote: upVote,
                downVote: downVote
            }, function(err, res, body, success) {
                updatePlaylistVote(room, voteId);
            });
        } else {
            kaiseki.createObject('Vote', params, function(err, res, body, success) {
                updatePlaylistVote(room, body.objectId);
            });
        }


        function updatePlaylistVote(room, id) {
            kaiseki.getObjects('Vote', {
                playerId: room
            }, function(err, res, body, success) {
                var upvoteNum = 0,
                    downvoteNum = 0;
                for (var i = 0; i < body.length; i++) {
                    console.log(body[i].upVote);
                    if (body[i].upVote === true) {
                        upvoteNum++;
                    } else if (body[i].downVote === true) {
                        downvoteNum++;
                    }
                }
                kaiseki.updateObject('Playlist', trackId, {
                    upvoteNum: upvoteNum,
                    downvoteNum: downvoteNum
                }, function(err, res, body, success) {
                    console.log(body);
                    io.sockets.in(room).emit("vote:change", {
                        upvote: upvoteNum,
                        downvote: downvoteNum,
                        voteId: id,
                        voteChoice: voteChoice
                    });
                });
            });
        }
    });
    socket.on("song:new", function(msg, fn) {
        console.log("add song");
        var track_id = msg.track_id,
            jukebox_id = msg.server_id,
            user_id = msg.userId;
        io.sockets.in(jukebox_id).emit('song:new:server', {
            userName: msg.userName,
            artistTitle: msg.trackTitle,
            artistName: msg.artistName,
            artistImage: msg.artistImage
        });
        var status = newSong(user_id, track_id, jukebox_id, fn);
    });
    socket.on('song:ended', function(msg, fn) {
        var room = msg.room,
            trackId = msg.trackId,
            artistInfo = msg.artistInfo;
        kaiseki.deleteObject('Playlist', trackId, function(err, res, body, success) {
            if (success) {
                Parse.deleteAll('Vote', function() {
                    // nothing to see here
                });
                kaiseki.getObjects('Playlist', {
                    where: {
                        playerId: msg.room
                    },
                    order: 'createdAt',
                    count: true
                }, function(err, res, body, success) {
                    if (success) {
                        if (body.count > 0) {
                            io.sockets.in(msg.room).emit("playlist:change", body.results);
                            var preview = body.results[0].imagePreview;
                            kaiseki.updateObject('Player', msg.room, {
                                playingImg: preview
                            }, function(err, res, body, success) {
                                io.sockets.emit("playlist:playingImg", {
                                    preview: preview,
                                    room: msg.room
                                });
                            });
                        } else {
                            emptyQueue(artistInfo, msg.room);
                        }
                    }
                });
            }
        });

    });

    function emptyQueue(artistInfo, jukebox_id) {
        myNest.artist.similar({
            name: artistInfo
        }, function(error, response) {
            var found = false;
            callAPIs(response.artists);

            function callAPIs(APIs) {
                if (APIs.length) {
                    var ran = Math.floor(Math.random() * APIs.length),
                        artist = APIs[ran].name;
                    request.get({
                        url: "http://imvdb.com/api/v1/search/entities?q=" + artist + "&per_page=1",
                        json: true
                    }, function(error, response, body) {
                        if (!error && response.statusCode === 200) {
                            if (body.results[0]) {
                                var artist_id = body.results[0].id;
                                if (artist_id) {
                                    request.get({
                                        url: "http://imvdb.com/api/v1/entity/" + artist_id + "?include=artist_videos,featured_videos", //distinctpos,credits - Used to get Apperances
                                        json: true
                                    }, function(error, response, body) {
                                        if (!error && response.statusCode === 200) {
                                            if (body.artist_videos.total_videos !== 0) {
                                                var videos = body.artist_videos.videos;
                                                var track_id = body.artist_videos.videos[Math.floor(Math.random() * (videos.length))].id; //Needs to search Featured Artist Also --- Could combine the two arrays and picks from that
                                                found = true;
                                                newSong('emptyQueue', track_id, jukebox_id, function() {
                                                    return;
                                                });
                                            }
                                        }
                                        if (!found) {
                                            APIs.splice(ran, 1);
                                            callAPIs(APIs);
                                        } else {
                                            return false;
                                        }
                                    });
                                } else {
                                    emptyQueue(artistInfo, jukebox_id);
                                }
                            }
                        }
                    });

                } else {
                    emptyQueue(artistInfo, jukebox_id);
                }
            }

        });
    }

    function newSong(user_id, track_id, jukebox_id, fn) {
        request({
            url: "http://imvdb.com/api/v1/video/" + track_id + "?include=sources",
            json: true
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var sources = body.sources,
                    YT_Key = 0,
                    noMatch = true;
                for (var key in sources) {
                    if (sources[key].source === "youtube") {
                        YT_Key = key;
                        noMatch = false;
                    }
                }
                if (noMatch) {
                    returnData(2);
                    return false;
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
                        userId: user_id,
                        upvoteNum: 0,
                        downvoteNum: 0
                    },
                    params = {
                        where: {
                            playerId: jukebox_id
                        },
                        order: 'createdAt'
                    };
                kaiseki.createObject('Playlist', post, function(err, res, body, success) {
                    kaiseki.getObjects('Playlist', params, function(err, res, body, success) {
                        io.sockets.in(jukebox_id).emit("playlist:change", body);
                        kaiseki.updateObject('Player', jukebox_id, {
                            playingImg: post.imagePreview
                        }, function(err, res, body, success) {
                            io.sockets.emit("playlist:playingImg", {
                                preview: post.imagePreview,
                                room: jukebox_id
                            });
                        });
                        if (user_id !== 'emptyQueue') {
                            returnData(1);
                        }
                    });
                });
            }
        });

        function returnData(status) {
            fn({
                status: status
            });
        }
    }
});

function getIMVDB(id, url) {
    request(url, function(error, response, html) {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(html),
                i = 0;
            $("table.imvdb-chart-table tr").each(function(i, element) {
                var params = {
                    section: parseInt(id, 10),
                    artistOrder: parseInt(i, 10),
                    artistName: trim(($(this).find(".artist_line").next("p").text() || '')),
                    artistTitle: trim(($(this).find(".artist_line a").attr("title") || '')),
                    artistImage: trim(($(this).find("img").attr("src") || ''))
                };
                kaiseki.createObject('Browse', params, function(err, res, body, success) {
                    i++;
                });
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

var job = new CronJob('00 00 12 * * *', function() {
        var IMVDBurls = {
            0: {
                url: "http://imvdb.com/charts/new",
                title: "Best New Music Video"
            },
            1: {
                url: "http://imvdb.com/charts/week",
                title: "Top Music Video of The Week"
            },
            2: {
                url: "http://imvdb.com/charts/month",
                title: "Top Music Video of The Month"
            },
            3: {
                url: "http://imvdb.com/charts/all",
                title: "Top Music Video of All Time"
            }
        };
        Parse.deleteAll('Browse', function(err) {
            if (!err) {
                for (var key in IMVDBurls) {
                    getIMVDB(key, IMVDBurls[key].url);
                    console.log("Song Update");
                }
            }
        });
    }, function() {
        // This function is executed when the job stops
    },
    true /* Start the job right now */ ,
    "America/New_York"
);

// Expose app
exports = module.exports = app;