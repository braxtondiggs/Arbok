var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    res.render('player', { title: 'MVPlayer' });
});

router.get('/search', function(req, res) {
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

module.exports = router;