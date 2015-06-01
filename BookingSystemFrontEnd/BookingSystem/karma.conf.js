module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-resource/angular-resource.js',

        'karma_test_includes/*.js',

        // Main app file
        'app/app.js',

        'app/shared/controllers/headerCtrl.js',

        'app/shared/directives/calendarDirective.js',
        'app/shared/directives/commonDirectives.js',
        'app/shared/directives/imageUploaderDirective.js',
        'app/shared/directives/menuDirective.js',

        'app/shared/filters/commonFilters.js',

        // Controllers. Manually added to exclude .min files, which doesn't work that well to include in tests.
        'app/controllers/booking/bookingCtrl.js',
        'app/controllers/booking-type/bookingTypeCtrl.js',
        'app/controllers/customer/customerCtrl.js',
        'app/controllers/furnituring/furnituringCtrl.js',
        'app/controllers/location/locationCtrl.js',
        'app/controllers/location-booking/locationBookingCtrl.js',
        'app/controllers/resource/resourceCtrl.js',
        'app/controllers/start/startCtrl.js',
        'app/controllers/start/startCtrl.js',

        // Inlude controller tests
        'app/controllers/**/*_test.js',

        // Services
        'app/shared/services/bookingService.js',
        'app/shared/services/commonServices.js',
        'app/shared/services/customerService.js',
        'app/shared/services/furnituringService.js',
        'app/shared/services/imageResizeService.js',
        'app/shared/services/locationBookingService.js',
        'app/shared/services/locationService.js',
        'app/shared/services/resourceBookingService.js',
        'app/shared/services/resourceService.js',

        // Include shared tests
        'app/shared/**/*_test.js',

        // Other
        'app/lib/extensions.js',
        'app/lib/angular-google-maps.min.js',
        'app/lib/lodash.min.js',
        'app/lib/google-maps-api.js',
        'app/lib/moment-with-locales.min.js',
        'app/shared/**/*.html'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
        'app/shared/**/*.js': ['coverage'],
        'app/controllers/**/*.js': ['coverage'],
        'app/shared/**/*.html': ['ng-html2js']
    },

    // optionally, configure the reporter
    coverageReporter: {
        type : 'html',
        dir : 'coverage/'
    },


    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-coverage',
            'karma-ng-html2js-preprocessor'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },

    client: {
      captureConsole: true,
      mocha: {
          bail: true
      }
    },

    ngHtml2JsPreprocessor: {
      // strip this from the file path
      stripPrefix: 'app/',
      //stripSufix: '.ext',
      // prepend this to the
      //prependPrefix: 'served/',

      // or define a custom transform function
      //cacheIdFromPath: function(filepath) {
//          return cacheId;
//      },

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'templates'
    }

  });
};
