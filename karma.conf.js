// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'client/bower_components/modernizr/modernizr.js',
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-messages/angular-messages.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/ng-lodash/build/ng-lodash.js',
      'client/bower_components/angular-youtube-player/build/angularYoutubePlayer.js',
      'client/bower_components/eventEmitter/EventEmitter.js',
      'client/bower_components/eventie/eventie.js',
      'client/bower_components/imagesloaded/imagesloaded.js',
      'client/bower_components/enquire/dist/enquire.js',
      'client/bower_components/owl.carousel/src/js/owl.carousel.js',
      'client/bower_components/owl.carousel/src/js/owl.autoplay.js',
      'client/bower_components/owl.carousel/src/js/owl.navigation.js',
      'client/bower_components/jquery.transit/jquery.transit.js',
      'client/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
      'client/bower_components/ngstorage/ngStorage.js',
      'client/bower_components/angularjs-geolocation/src/geolocation.js',
      'client/bower_components/ngDialog/js/ngDialog.js',
      'client/bower_components/angular-aria/angular-aria.js',
      'client/bower_components/angular-material/angular-material.js',
      'client/bower_components/ng-idle/angular-idle.js',
      'client/bower_components/moment/moment.js',
      'client/bower_components/angular-moment/angular-moment.js',
      'client/bower_components/angular-fx/dist/angular-fx.min.js',
      'client/bower_components/waypoints/lib/jquery.waypoints.js',
      'client/bower_components/firebase/firebase.js',
      'client/bower_components/angularfire/dist/angularfire.js',
      'client/bower_components/classie/classie.js',
      'client/bower_components/angular-notify/dist/angular-notify.js',
      'client/bower_components/geofire/dist/geofire.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'client/app/app.js',
      'client/{app,components}/**/*.module.js',
      'client/{app,components}/**/*.js',
      'client/{app,components}/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'ng-html2js',
      'client/{app,components}/**/*.js': 'babel'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // reporter types:
    // - dots
    // - progress (default)
    // - spec (karma-spec-reporter)
    // - junit
    // - growl
    // - coverage
    reporters: ['spec'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
