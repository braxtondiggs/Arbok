'use strict';
var _ = require('lodash');
var request = require('request');
// Gets a list of Searchs
export function index(req, res) {
	if (req.query.pg && req.query.q && req.query.s) {
		request.get('http://imvdb.com/api/v1/search/' + req.query.s + '?q=' + req.query.q + '&page=' + req.query.pg,
			function(error, response, body) {
				if (!error && response.statusCode === 200) {
					var data = JSON.parse(body);
					res.json(data);
				}
			});
	} else {
		res.json({});
	}
}