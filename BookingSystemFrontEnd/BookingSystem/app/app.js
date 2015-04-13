'use strict';

(function() {

    var BookingSystem;

    // Declare app level module which depends on views, and components
    BookingSystem = angular.module('bookingSystem', [
      'ngRoute',
      'bookingSystem.startPage',
      'bookingSystem.version'

    ]);


    // Declare basic routes
    BookingSystem.config(function($routeProvider) {
        $routeProvider.
            // Startpage
            when('/', {
                templateUrl: 'components/start/startView.html'
            })
    });


    // Custom filters
    BookingSystem.filter('kr', function () {
        return function (text) {
            text = text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
            var t = text + ' kr';
            return t;
        };
    });

    BookingSystem.filter('percentage', ['$filter', function($filter) {
        return function(input, decimals) {
            return $filter('number')(input*100, decimals)+'%';
        };
    }]);

})();
