'use strict';
var Echonest = require('echonestjs');
var firebase = require('firebase');
var request = require('request');
var async = require('async');
var _ = require('lodash');
// Gets a list of Tracks
export function index(req, res) {
	if (req.body.params.pid) {
		Echonest.init('0NPSO7NBLICGX3CWQ');
		async.waterfall([
			fireBaseFunc,
			echoNestFunc,
			imvdbFunc,
			youtubeFunc
		], function(err, results) {
			if (err) {
				console.log('error');
				return;
			}
			console.log(results);
			res.json(results);
		});
	} else {
		errorHandler({ id: 101, msg: 'Key Missing' });
	}

	function fireBaseFunc(callback) {
		var db = firebase.database();
		var ref = db.ref('Player/' + req.body.params.pid);
		ref.once('value', function(snapshot) {
			if (!_.isEmpty(snapshot.val())) {
				console.log('passed');
				callback(null);
			}
		}, function() {
			return callback(err);
		});
	}

	function echoNestFunc(callback) {
		var last = req.body.params.last || 'Drake';
		Echonest.get('artist/profile', {
			name: last
		}, function(err, res) {
			Echonest.get('artist/similar', {
				results: 2,
				id: res.response.artist.id
			}, function(err, data) {
				callback(null, data.response.artists)
			});
		});
	}

	function imvdbFunc(arg1, callback) {
		async.eachSeries(arg1, function(similar, series) {
			var rand = Math.floor(Math.random() * arg1.length);
			request.get('http://imvdb.com/api/v1/search/videos?q=' + encodeURI(arg1[rand].name), function(error, response, body) {
				if (!error && response.statusCode === 200) {
					var data = JSON.parse(body);
					if (data.total_results !== 0) {
						var rand2 = Math.floor(Math.random() * data.results.length);
						for (var i = 0; i < data.results.length; i++) {
							if (data.results[rand2].artists[0].name.toLowerCase() === arg1[rand].name.toLowerCase()) {
								callback(null, data.results[rand2]);
								break;
							}
						}
					}
				}
				series();
			});
		}, function(err) {
			callback(err);
		});
	}

	function youtubeFunc(arg1, callback) {
		request.get('http://imvdb.com/api/v1/video/' + String(arg1.id) + '?include=sources,featured', function(error, response, body) {
			if (!error && response.statusCode === 200) {
				var data = JSON.parse(body),
					youtube = [];
				for (var key in data.sources) {
					if (data.sources[key].source === 'youtube') {
						youtube.push(data.sources[key].source_data);
					}
				}
				arg1.youtube = youtube;
				arg1.featured = data.featured;
				callback(null, arg1);
			}
		});
	}

	function errorHandler(err) {
		res.status(500);
		res.render('error', { error: err });
	}

}