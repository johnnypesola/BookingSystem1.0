'use strict';

(function() {

    var BookingSystem;

    // Declare app level module which depends on views, and components
    BookingSystem = angular.module('bookingSystem', [
        'ngRoute',
        'bookingSystem.startPage',
        'bookingSystem.version',
        'bookingSystem.header',
        'bookingSystem.booking',
        'bookingSystem.furnituring'
    ]);

    // Define API url, used in services
    BookingSystem.constant('API_URL', 'http://192.168.1.4:8080/BookingSystem/api/');

    // Declare basic routes
    BookingSystem.config(function($routeProvider) {

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
            });
            /*.
            otherwise({
                redirectTo: '/mobleringar/lista'
            })*/

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
