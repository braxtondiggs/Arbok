// set variables for environment
var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http),
    mysql = require('mysql'),
    request = require("request");

// Set server port
app.set('port', (process.env.PORT || 5000));

var db_config = {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b3b9b17a92408d',
    password: 'a0f39082',
    database: 'heroku_d16dd5404e8d931'
};

function handleDisconnect() {
    connection = mysql.createConnection(db_config);

    connection.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        }else {
            throw err;
        }
    });
}
handleDisconnect();
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});
app.get('/search', function(req, res) {
    var v = req.query['v'],
        url = "http://imvdb.com/api/v1/search/videos?q=" + v;

    request({
        url: url,
        json: true
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(body));
        } else {
            //show 404 page
        }
        res.end();
    });
});

app.get('/server', function(req, res) {
    var lng = req.query['lng'],
        lat = req.query['lat'],
        distance = req.query['distance'] || 25;
    if (lat && lng) {
        connection.query('SELECT *, ( 3959 * acos( cos( radians(' + lat + ') ) * cos( radians( lat ) ) * cos( radians( lng ) - radians(' + lng + ') ) + sin( radians(' + lat + ') ) * sin( radians( lat ) ) ) ) AS distance FROM jukebox_locations HAVING distance < ' + distance + ' ORDER BY distance LIMIT 0 , 20', function(err, rows, results) { //jukebox_locations
            if (err) throw err;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(rows));
        });
    } else {
        res.status(404).send('Not found');
    }
});
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
http.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('server init', function(msg, fn) {
        var sid = genID(12),
            post = {sid: sid, name: msg.name, lat: msg.location.lat, lng: msg.location.lng};
        connection.query("INSERT INTO jukebox_locations SET ?", post, function(err, rows, results) {
            if (err) throw err;
            socket.broadcast.emit('New Server');
            connection.query('SELECT * FROM jukebox_songs WHERE jukebox_id = ?', [sid], function(err, rows, results) {
                fn({
                    sid: sid,
                    playlist: rows
                });
            });
        });
    });

    socket.on('get playlist', function(msg, fn) {
        var sid = msg.sid;
        connection.query('SELECT * FROM jukebox_songs WHERE jukebox_id = ?', [sid], function(err, rows, results) {
            fn(rows);
        });
    });

    socket.on("add song", function(msg) {
        var track_id = msg.track_id,
            jukebox_id = msg.server_id,
            url = "http://imvdb.com/api/v1/video/" + track_id + "?include=sources";
        request({
            url: url,
            json: true
        }, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var customtrack_id = genID(12),
                    post = {customtrack_id: customtrack_id,track_id: body.id, youtube_id: body.sources[0].source_data, artist: body.artists[0].name, track: body.song_title, image: body.image.o, year: body.year, jukebox_id: jukebox_id};
                connection.query("INSERT INTO jukebox_songs SET ?", post, function(err, rows, results) {
                    if (err) throw err;
                });
                //socket.broadcast.to(sid).emit("new song", {youtube_id: body.sources[0].source_data, artist: body.artists[0].name, track: body.song_title, image: body.image.o});
                io.emit("new song", {
                    youtube_id: body.sources[0].source_data,
                    artist: body.artists[0].name,
                    track: body.song_title,
                    image: body.image.o,
                    customtrack_id: customtrack_id
                });
            }
        });
    });
    socket.on('song ended', function(msg, fn) {
        var sid = msg.sid,
            tid = msg.tid;
            console.log("ended");
        if(sid !== null && tid !== null) {
            console.log("DELETE FROM jukebox_songs WHERE jukebox_id = '" + sid + "' AND customtrack_id = " + tid + " LIMIT 1;");
            connection.query("DELETE FROM jukebox_songs WHERE jukebox_id = '" + sid + "' AND customtrack_id = '" + tid + "' LIMIT 1;", function(err, rows, results) {
                if (err) throw err;
            });
            io.emit("next song");
        }
    });
});

function genID(length) {
    var text = "",
        possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}