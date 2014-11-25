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

module.exports = router;