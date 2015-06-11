// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-04-29 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/modernizr/modernizr.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-youtube-player/build/angularYoutubePlayer.min.js',
      'bower_components/angular-notify/dist/angular-notify.js',
      'bower_components/parse-js-sdk/lib/parse.js',
      'bower_components/eventEmitter/EventEmitter.js',
      'bower_components/eventie/eventie.js',
      'bower_components/imagesloaded/imagesloaded.js',
      'bower_components/enquire/dist/enquire.js',
      'bower_components/owl.carousel/src/js/owl.carousel.js',
      'bower_components/jquery.transit/jquery.transit.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/angularjs-geolocation/src/geolocation.js',
      'bower_components/angular-echonest/build/angular-echonest.js',
      'bower_components/ngDialog/js/ngDialog.js',
      'bower_components/pubnub/web/pubnub.min.js',
      'bower_components/pubnub-angular/lib/pubnub-angular.js',
      'bower_components/ng-lodash/build/ng-lodash.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
