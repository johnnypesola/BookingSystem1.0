'use strict';

(function() {

    var BookingSystem;

    // Declare app level module which depends on views, and components
    BookingSystem = angular.module('bookingSystem', [
        'ngRoute',
        'bookingSystem.startPage',
        'bookingSystem.version',
        'bookingSystem.header',
        'bookingSystem.booking'
    ]);


    // Declare basic routes
    BookingSystem.config(function($routeProvider) {
        // Startpage
        $routeProvider.
            when('/', {
                templateUrl: 'components/start/startView.html'
            }).
            when('/bokningstillfallen/lista', {
                templateUrl: 'components/booking/bookingListView.html'
            }).
            when('/bokningstillfallen/kalender', {
                templateUrl: 'components/booking/bookingCalendarView.html'
            });
    });

    // Menu code test

})();
