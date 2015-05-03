'use strict';

(function() {

    var BookingSystem;

    // Declare app level module which depends on views, and components
    BookingSystem = angular.module('bookingSystem', [
        'ngRoute',
        'ngResource',
        'bookingSystem.startPage',
        'bookingSystem.version',
        'bookingSystem.header',
        'bookingSystem.booking',
        'bookingSystem.furnituring',
        'bookingSystem.location',
        'bookingSystem.loadingDirective'
    ]);

    // Define API url, used in services
    BookingSystem.constant('API_URL', 'http://localhost:6796/api/'); // 'http://192.168.1.4:8080/BookingSystem/api/');


    BookingSystem.config(function($routeProvider) {

        // Declare basic routes
        $routeProvider.
            // Startpage
            when('/', {
                templateUrl: 'controllers/start/startCtrl.html'
            }).

            // Bookings
            when('/bokningstillfallen/lista', {
                templateUrl: 'controllers/booking/bookingList.html'
            }).
            when('/bokningstillfallen/kalender', {
                templateUrl: 'controllers/booking/bookingCalendar.html'
            }).

            // Furniturings
            when('/mobleringar/lista', {
                templateUrl: 'controllers/furnituring/furnituringList.html'
            }).
            when('/mobleringar/radera/:furnituringId', {
                templateUrl: 'controllers/furnituring/furnituringDelete.html'
            }).
            when('/mobleringar/redigera/:furnituringId', {
                templateUrl: 'controllers/furnituring/furnituringEdit.html'
            }).
            when('/mobleringar/skapa', {
                templateUrl: 'controllers/furnituring/furnituringCreate.html'
            }).

            // Locations
            when('/platser/lista', {
                templateUrl: 'controllers/location/locationList.html'
            }).
            when('/platser/radera/:locationId', {
                templateUrl: 'controllers/location/locationDelete.html'
            }).
            when('/platser/redigera/:locationId', {
                templateUrl: 'controllers/location/locationEdit.html'
            }).
            when('/platser/skapa', {
                templateUrl: 'controllers/location/locationCreate.html'
            }).

            // Page not found
            otherwise({
                templateUrl: 'shared/views/notFound.html'
            });

    });


    BookingSystem.run(function($rootScope, $location) {

        // Add $location to $rootScope, for access on all pages, even without controllers
        $rootScope.appLocation = $location;
    });


    // Automatically convert all $http ISO 6801 date strings to date objects from backend (affected: $http $provider).
    // Does not work well with tests!
    /*
    BookingSystem.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.defaults.transformResponse.push(function(responseData){

            var dateObj = new Date();
            dateObj.convertDateStringsToDates(responseData);
            return responseData;
        });
    }]);
    */
})();
