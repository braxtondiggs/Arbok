// set variables for environment
var express = require('express'),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http').createServer(app),
    io = require('socket.io').listen(http),
    mysql = require('mysql'),
    request = require("request"),
    cheerio = require('cheerio'),
    trim = require('trim'),
    CronJob = require('cron').CronJob,
    time = require('time');


app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});
var routes = require('./routes/index'),
    users = require('./routes/users'),
    player = require('./routes/player'),
    music = require('./routes/music');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set server port
app.set('port', (process.env.PORT || 5000));

app.use(function(req,res,next){
    req.conn = connection;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/player', player);
app.use('/music', music);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

/*var db_config = {
    host: 'us-cdbr-iron-east-01.cleardb.net',
    user: 'b3b9b17a92408d',
    password: 'a0f39082',
    database: 'heroku_d16dd5404e8d931'
};*/
var db_config = {
    host: 'localhost',
    port:8889,
    user: 'root',
    password: 'root',
    database: 'cymbitco_quilava'
};
function handleDisconnect() {
    connection = mysql.createConnection(db_config);

    connection.connect(function(err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}
handleDisconnect();

http.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('server init', function(msg, fn) {
        var sid = genID(12),
            post = {
                sid: sid,
                name: msg.name,
                lat: msg.location.lat,
                lng: msg.location.lng
            };
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
                    post = {
                        customtrack_id: customtrack_id,
                        track_id: body.id,
                        youtube_id: body.sources[0].source_data,
                        artist: body.artists[0].name,
                        track: body.song_title,
                        image: body.image.o,
                        year: body.year,
                        jukebox_id: jukebox_id
                    };
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
        if (sid !== null && tid !== null) {
            console.log("DELETE FROM jukebox_songs WHERE jukebox_id = '" + sid + "' AND customtrack_id = " + tid + " LIMIT 1;");
            connection.query("DELETE FROM jukebox_songs WHERE jukebox_id = '" + sid + "' AND customtrack_id = '" + tid + "' LIMIT 1;", function(err, rows, results) {
                if (err) throw err;
            });
            io.emit("next song");
        }
    });
});
var IMVDBurls = {0:{url:"http://imvdb.com/charts/new",title:"Best New Music Video"}, 1:{url:"http://imvdb.com/charts/week", title:"Top Music Video of The Week"}, 2:{url:"http://imvdb.com/charts/month", title:"Top Music Video of The Month"}, 3:{url:"http://imvdb.com/charts/all", title:"Top Music Video of All Time"}};

var job = new CronJob('00 00 12 * * *', function(){
    connection.query("DELETE FROM jukebox_section_music", function(err, rows, results) {
        if (err) throw err;
    });
    for(var key in IMVDBurls) {
        getIMVDB(key, IMVDBurls[key].title, IMVDBurls[key].url);
        console.log("Song Update");
    }
  }, function () {
    // This function is executed when the job stops
  },
  true /* Start the job right now */,
  "America/New_York"
);
function getIMVDB(id, list, url) {
    request(url, function(error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html),
                i = 0;
            $("table.imvdb-chart-table tr").each(function(i, element) {
                var post_music = {
                    section: id,
                    artist_order: i,
                    artist_name: trim($(this).find(".artist_line").next("p").text()),
                    artist_title: trim($(this).find(".artist_line a").attr("title")),
                    artist_image: trim($(this).find("img").attr("src"))
                };
                connection.query("INSERT INTO jukebox_section_music SET ?", post_music, function(err, rows, results) {
                    if (err) throw err;
                });
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