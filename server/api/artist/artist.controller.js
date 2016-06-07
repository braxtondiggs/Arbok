'use strict';
var request = require('request');
var _ = require('lodash');
var SpotifyWebApi = require('spotify-web-api-node');

export function id(req, res) {
	request.get('http://imvdb.com/api/v1/entity/' + req.params.id + '?include=artist_videos,featured_videos', function(error, response, body) {
		if (!error && response.statusCode === 200) {
			res.json(JSON.parse(body));
		}
	});
}

export function slug(req, res) {
	request.get('http://imvdb.com/api/v1/search/entities?q=' + req.params.id, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			res.json(JSON.parse(body));
		}
	});
}

export function bio(req, res) {
	//Deprecated with EchoNest
}

export function related(req, res) {
	var spotifyApi = new SpotifyWebApi({
		clientId: '8d3caf1621064039aa632d113dad7365',
		clientSecret: 'a051adb73187405a81a9d50206f1036e'
	});
	var slug = req.params.slug;
	spotifyApi.searchArtists('"'+slug+'"').then(function(data) {
		var items = data.body.artists.items;
		spotifyApi.getArtistRelatedArtists(items[0].id).then(function(data) {
			res.json(data.body.artists);
		}, function(err) {
			console.log(err);
		});
	}, function(err) {
		console.log(err);
	});


}