var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
var trim = require('trim');
Parse.Cloud.job('IMVDB', function(response, status) {
  // Set up to modify user data
  Parse.Cloud.useMasterKey();
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
        destroy: function(callback){
          for(var i=0; i<result.length; i++) {
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
    }
  });
  function getIMVDB(id, url) {
    request(url, function(error, response, html) {
      if (!error && response.statusCode === 200) {
        var $ = cheerio.load(html);
        $('table.imvdb-chart-table tr').each(function(i) {
          var params = {
            section: parseInt(id, 10),
            artistOrder: parseInt(i, 10),
            artistName: trim(($(this).find('.artist_line').next('p').text() || '')),
            artistTitle: trim(($(this).find('.artist_line a').attr('title') || '')),
            artistImage: trim(($(this).find('img').attr('src') || ''))
          };
          /*kaiseki.createObject('Browse', params, function(err, res, body, success) {
              i++;
          });*/
        });
      }
    });
  }
});