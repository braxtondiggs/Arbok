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
			spotifyFunc,
			imvdbFunc,
			youtubeFunc
		], function(err, results) {
			if (err) {
				if (req.body.params.lastId) {
					getFeatured();
				} else {
					getTop();
				}
				return err;
			}
			res.json(results);
		});
	} else {
		errorHandler({ id: 101, msg: 'Key Missing' });
	}

	function spotifyFunc(callback) {
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
		var matches;
		async.eachSeries(arg1, function(similar, series) {
			var rand = Math.floor(Math.random() * arg1.length);
			if (_.isUndefined(matches)) {
				request.get('http://imvdb.com/api/v1/search/videos?q=' + encodeURI(arg1[rand].slug), function(error, response, body) {
					if (!error && response.statusCode === 200) {
						var data = JSON.parse(body);
						if (data.total_results !== 0) {
							var filterdObj = _.filter(data.results, function(o) {
									return o.artists[0].slug === arg1[rand].slug
								}),
								filteredRand = Math.floor(Math.random() * filterdObj.length);
							for (var i = 0; i < filterdObj.length; i++) {
								matches = data.results[filteredRand];
								break;
							}
						}
					}
					series();
				});
			} else {
				series();
			}
		}, function(err) {
			if (err || _.isUndefined(matches)) {
				callback(err);
			} else {
				callback(null, matches);
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
		async.waterfall([
			async.apply(youtubeFunc, { id: req.body.params.lastId }),
			function(arg1, callback) {
				if (!_.isEmpty(arg1.featured_artists)) {
					callback(null, arg1.featured_artists)
				} else {
					callback();
				}
			},
			imvdbFunc,
			youtubeFunc
		], function(err, result) {
			if (err) {
				return err;
			}
			res.json(result);
		});
	}

	function getTop() {
		var db = firebase.database(),
			ref = db.ref('Discover/fresh/tracks');
		ref.once('value').then(function(snapshot) {
			var i = 0,
				rand = Math.floor(Math.random() * snapshot.numChildren());
			snapshot.forEach(function(snapshot) {
				if (i === rand) {
					async.waterfall([
						function(callback) {
							request.get('http://imvdb.com/api/v1/search/videos?q=' + snapshot.val().slug + ' ' + snapshot.val().slugTitle, function(error, response, body) {
								if (!error && response.statusCode === 200) {
									callback(null, JSON.parse(body).results[0]);
								} else {
									callback();
								}
							});
						},
						youtubeFunc
					], function(err, result) {
						if (err) {
							return err;
						}
						res.json(result);
					});
				}
				i++;
			});
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