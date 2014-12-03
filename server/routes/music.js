var express = require('express'),
    request = require('request');
var router = express.Router();

router.get('/', function(req, res) {
    var conn = req.conn,
        json = [];
    connection.query('SELECT * FROM jukebox_section_music ORDER BY artist_order LIMIT 160', function(err, rows, results) {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(rows));
        res.end();
    });
});
router.get('/search', function(req, res) {
    var e = req.query['e'] || null,
        v = req.query['v'] || null,
        action = (e) ? "entities" : "videos";

    if (action) {
        request({
            url: "http://imvdb.com/api/v1/search/" + action + "?q=" + ((e) ? e : v) + ((e) ? "&per_page=5" : ""),
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
    } else {
        //show404
    }
});
router.get('/artist', function(req, res) {
    var e = req.query['e'] || null;
    if (e) {
        request({
            url: "http://imvdb.com/api/v1/entity/" + e + "?include=artist_videos,featured_videos",
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
    } else {
        //show 404
    }
});

module.exports = router;