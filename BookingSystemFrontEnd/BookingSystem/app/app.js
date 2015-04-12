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

})();
