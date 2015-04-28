'use strict';
var async = require('cloud/modules/async.min.js');
var cheerio = require('cloud/modules/cheerio.js');
var trim = require('cloud/modules/trim.min.js');
/*global Parse*/
Parse.Cloud.define('Logger', function(request, response) {
	console.log(request.params);
	response.success();
});
Parse.Cloud.job('IMVDB', function(response) {
	// Set up to modify user data
	Parse.Cloud.useMasterKey();
	console.log(response.params);
	var IMVDBurls = {
		0: {
			url: 'http://imvdb.com/charts/new',
			title: 'Best New Music Video'
		},
		1: {
			url: 'http://imvdb.com/charts/week',
			title: 'Top Music Video of The Week'
		},
		2: {
			url: 'http://imvdb.com/charts/month',
			title: 'Top Music Video of The Month'
		},
		3: {
			url: 'http://imvdb.com/charts/all',
			title: 'Top Music Video of All Time'
		}
	};
	var query = new Parse.Query('Browse');
	query.limit(200);
	query.find({
		success: function(result) {
			async.series({
				destroy: function(callback) {
					for (var i = 0; i < result.length; i++) {
						result[i].destroy();
					}
					callback();
				},
				create: function(callback) {
					for (var key in IMVDBurls) {
						getIMVDB(key, IMVDBurls[key].url);
					}
					callback();
				}
			});
		},
		error: function() {
			response.error('Lookup Failed');
		}
	});

	function getIMVDB(id, url) {
		Parse.Cloud.httpRequest({
			url: url,
			success: function(httpResponse) {
				if (httpResponse.status === 200) {//check status
					var $ = cheerio.load(httpResponse.text);
					$('table.imvdb-chart-table tr').each(function(i) {
						var Browse = Parse.Object.extend('Browse');
						var browse = new Browse();
						 
						browse.set('section', parseInt(id, 10));
						browse.set('artistOrder', parseInt(i, 10));
						browse.set('artistName', trim(($(this).find('.artist_line').next('p').text() || '')));
						browse.set('artistSlug', trim(($(this).find('.artist_line').next('p').find('a').attr('href') || '')).substring(19));
						browse.set('artistTitle', trim(($(this).find('.artist_line a').attr('title') || '')));
						browse.set('artistTitleSlug', $(this).find('.artist_line a').attr('href').substring(parseInt($(this).find('.artist_line a').attr('href').lastIndexOf('/'), 10) + 1));
						browse.set('artistImage', trim(($(this).find('img').attr('src') || '')));
						 
						browse.save();
					});
				}
			},
			error: function(httpResponse) {
				response.error('Request failed with response code ' + httpResponse.status);
			}
		});
	}
});
