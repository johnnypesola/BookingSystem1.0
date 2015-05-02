module.exports = function(config){
  config.set({

    basePath : './',

    files : [
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/bower_components/angular-mocks/angular-mocks.js',
        'app/bower_components/angular-resource/angular-resource.js',
        'app/components/**/*.js',
        //'app/view*/**/*.js',
        'karma_test_includes/*.js',
        'app/shared/**/*.js',
        'app/controllers/**/*.js',
        'app/shared/directives/**/*.js',
        'app/*.js',
        'app/lib/extensions.js',
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
