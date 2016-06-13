'use strict';
var SpotifyWebApi = require('spotify-web-api-node');
var firebase = require('firebase');
var request = require('request');
var async = require('async');
var moment = require('moment');
var cheerio = require('cheerio');
var trim = require('trim');
var _ = require('lodash');
// Gets a list of Tracks
export function index(req, res) {
	if (req.body.params.pid) {
		async.waterfall([
			fireBaseFunc,
			echoNestFunc,
			imvdbFunc,
			youtubeFunc
		], function(err, results) {
			if (err) {
				getFeatured(function() {

				});
				return err;
			}
			res.json(results);
		});
	} else {
		errorHandler({ id: 101, msg: 'Key Missing' });
	}

	function fireBaseFunc(callback) {
		var db = firebase.database();
		var ref = db.ref('Player/' + req.body.params.pid + '/queue');
		ref.once('value', function(snapshot) {
			if (_.isNull(snapshot.val()) || _.isEmpty(snapshot.val())) {
				callback();
			}
		}, function() {
			return callback({ err: 100 });
		});
	}

	function echoNestFunc(callback) {
		var spotifyApi = new SpotifyWebApi({
			clientId: '8d3caf1621064039aa632d113dad7365',
			clientSecret: 'a051adb73187405a81a9d50206f1036e'
		});
		var last = req.body.params.last || 'Drake';
		spotifyApi.searchArtists(last).then(function(data) {
			spotifyApi.getArtistRelatedArtists(data.body.artists.items[0].id).then(function(data) {
				callback(null, data.body.artists);
			}, function(err) {
				callback(err);
			});
		}, function(err) {
			callback(err);
		});
	}

	function imvdbFunc(arg1, callback) {
		var matches = [];
		async.eachSeries(arg1, function(similar, series) {
			var rand = Math.floor(Math.random() * arg1.length);
			request.get('http://imvdb.com/api/v1/search/videos?q=' + encodeURI(arg1[rand].name), function(error, response, body) {
				if (!error && response.statusCode === 200) {
					var data = JSON.parse(body);
					if (data.total_results !== 0) {
						var rand2 = Math.floor(Math.random() * data.results.length);
						for (var i = 0; i < data.results.length; i++) {
							if (data.results[rand2].artists[0].name.toLowerCase() === arg1[rand].name.toLowerCase()) {
								matches.push(data.results[rand2]);
								break;
							}
						}
					} else {
						callback({ err: 102 });
					}
				} else {
					callback({ err: 101 });
				}
				series();
			});
		}, function(err) {
			if (err) {
				callback(err);
			} else {
				callback(null, matches[0]);
			}
		});
	}

	function youtubeFunc(arg1, callback) {
		request.get('http://imvdb.com/api/v1/video/' + String(arg1.id) + '?include=sources,featured', function(error, response, body) {
			if (!error && response.statusCode === 200) {
				var data = JSON.parse(body);
				callback(null, data);
			} else {
				callback({ err: 103 });
			}
		});
	}

	function errorHandler(err) {
		res.status(500);
		res.render('error', { error: err });
	}

	function getFeatured() {
		var last = req.body.params.last || 'Drake';
		async.waterfall([
			function(callback) {
				request.get('http://imvdb.com/api/v1/search/entities?q=' + last, function(error, response, body) { //please finish
					if (!error && response.statusCode === 200) {
						var data = JSON.parse(body);
						if (data.results.length) {
							for (var i = 0; i < data.results.length; i++) {
								if (data.results[i].slug === last) {//$scope.last_track.get('IMVDBartistId')) {
									callback(null, data.results[i].id);
									break;
								}
							}
							callback();
						}
					}
				});
			},
			function(arg1, callback) {
				request.get('http://imvdb.com/api/v1/entity/' + arg1 + '?include=featured_videos', function(error, response, body) {
					if (!error && response.statusCode === 200) {
						var data = JSON.parse(body);
						if (data.featured_artist_videos) {
							if (data.featured_artist_videos.videos) {
								callback(null, Math.floor(Math.random() * data.featured_artist_videos.videos.length))
							} else {
								callback();
							}
						}
					}
				});
			}
		], function(err, result) {
			if (err) {
				console.log(err);
				return;
			}
			console.log('getFeatured');
			console.log(result);
			return(result);
		});
	}

}

export function imvdb(req, res) {
	var urls = {
		fresh: 'https://imvdb.com/charts/new',
		top: 'https://imvdb.com/charts/all'
	};
	if (req.params.sort && urls[req.params.sort]) {
		var sort = req.params.sort;
		var db = firebase.database();
		var ref = db.ref('Discover/' + sort);
		ref.once('value').then(function(snapshot) {
			if (_.isEmpty(snapshot.val()) || moment(new Date(snapshot.val().date)).isBefore(new Date(), 'day')) {
				ref.remove().then(function() {
					request.get(urls[sort], function(error, response, body) {
						if (!error && response.statusCode === 200) {
							var $ = cheerio.load(body);
							var imvdb = {
								date: new Date().toString(),
								tracks: []
							};
							$('table.imvdb-chart-table tr').each(function(i) {
								var track = {
									name: trim(($(this).find('.artist_line').next('p').text() || '')),
									slug: trim(($(this).find('.artist_line').next('p').find('a').attr('href') || '')).substring(20),
									title: trim(($(this).find('.artist_line a').attr('title') || '')),
									slugTitle: $(this).find('.artist_line a').attr('href').substring(parseInt($(this).find('.artist_line a').attr('href').lastIndexOf('/'), 10) + 1),
									image: trim(($(this).find('img').attr('src') || ''))
								}
								imvdb.tracks.push(track);
							});
							ref.set(imvdb);
							res.json(imvdb.tracks);
						}
					});
				});
			} else {
				res.json(snapshot.val().tracks);
			}
		});
	}
}