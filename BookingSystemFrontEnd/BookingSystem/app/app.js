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
                templateUrl: 'controllers/start/startCtrl.html'
            }).
            when('/bokningstillfallen/lista', {
                templateUrl: 'controllers/booking/bookingListCtrl.html'
            }).
            when('/bokningstillfallen/kalender', {
                templateUrl: 'controllers/booking/bookingCalendarView.html'
            });
    });

    // Automatically convert all $http ISO 6801 date strings to date objects from backend (affected: $http $provider).
    BookingSystem.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.defaults.transformResponse.push(function(responseData){

            var dateObj = new Date();
            dateObj.convertDateStringsToDates(responseData);
            return responseData;
        });
    }]);

})();
