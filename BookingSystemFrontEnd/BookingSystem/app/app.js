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
        'bookingSystem.bookingType',
        'bookingSystem.furnituring',
        'bookingSystem.location',
        'bookingSystem.resource',
        'bookingSystem.customer',
        'bookingSystem.commonDirectives'
    ]);

    /*
     'http://localhost:6796/api/'
     'http://192.168.1.4:8080/BookingSystem/api/');
     */

    // Define API url, used in services
    BookingSystem.constant('API_URL', 'http://localhost:6796/api/');
    BookingSystem.constant('API_IMG_PATH_URL', 'http://localhost:6796/');
    BookingSystem.constant('UPLOAD_IMG_MAX_WIDTH', '400');
    BookingSystem.constant('UPLOAD_IMG_MAX_HEIGHT', '400');
    BookingSystem.constant('PHOTO_MISSING_SRC', 'img/icons/photo_missing.svg');
    BookingSystem.constant('OPTIONS_MAX_PEOPLE', 2000);


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
            when('/bokningstillfallen/skapa', {
                templateUrl: 'controllers/booking/bookingCreate.html'
            }).

            // BookingTypes
            when('/bokningstyper/visa/:bookingTypeId', {
                templateUrl: 'controllers/booking-type/bookingTypeShow.html'
            }).
            when('/bokningstyper/lista', {
                templateUrl: 'controllers/booking-type/bookingTypeList.html'
            }).
            when('/bokningstyper/radera/:bookingTypeId', {
                templateUrl: 'controllers/booking-type/bookingTypeDelete.html'
            }).
            when('/bokningstyper/redigera/:bookingTypeId', {
                templateUrl: 'controllers/booking-type/bookingTypeEdit.html'
            }).
            when('/bokningstyper/skapa', {
                templateUrl: 'controllers/booking-type/bookingTypeCreate.html'
            }).

            // Furniturings
            when('/mobleringar/visa/:furnituringId', {
                templateUrl: 'controllers/furnituring/furnituringShow.html'
            }).
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
            when('/platser/visa/:locationId', {
                templateUrl: 'controllers/location/locationShow.html'
            }).
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
            when('/platser/karta', {
                templateUrl: 'controllers/location/locationMap.html'
            }).

            // Resources
            when('/resurser/visa/:resourceId', {
                templateUrl: 'controllers/resource/resourceShow.html'
            }).
            when('/resurser/lista', {
                templateUrl: 'controllers/resource/resourceList.html'
            }).
            when('/resurser/radera/:resourceId', {
                templateUrl: 'controllers/resource/resourceDelete.html'
            }).
            when('/resurser/redigera/:resourceId', {
                templateUrl: 'controllers/resource/resourceEdit.html'
            }).
            when('/resurser/skapa', {
                templateUrl: 'controllers/resource/resourceCreate.html'
            }).

            // Customer
            when('/kunder/visa/:customerId', {
                templateUrl: 'controllers/customer/customerShow.html'
            }).
            when('/kunder/lista', {
                templateUrl: 'controllers/customer/customerList.html'
            }).
            when('/kunder/radera/:customerId', {
                templateUrl: 'controllers/customer/customerDelete.html'
            }).
            when('/kunder/redigera/:customerId', {
                templateUrl: 'controllers/customer/customerEdit.html'
            }).
            when('/kunder/skapa', {
                templateUrl: 'controllers/customer/customerCreate.html'
            }).

            // Page not found
            otherwise({
                templateUrl: 'shared/views/notFound.html'
            });
    });


    BookingSystem.run(function($rootScope, $location, API_IMG_PATH_URL) {

        // Add values to $rootScope, for access on all pages, even without controllers
        $rootScope.appLocation = $location;

        $rootScope.Int32MaxValue = 2147483647;
        $rootScope.Int16MaxValue = 32767;
        $rootScope.regExp = {
            textField : new RegExp("^[0-9a-zA-ZåäöÅÄÖé\\-_&\.,~\\^@()/%\\s\!]*$"),
            postNumber : new RegExp("^[0-9]{3}\\s[0-9]{2}$"),
            phoneNumber : new RegExp("^[0-9\\-\\s]*$"),

        };

        // Image path
        $rootScope.imagePath = API_IMG_PATH_URL;

        // Form visibility
        $rootScope.searchFormIsVisible = false;
        $rootScope.addFormIsVisible = false;

        // Google maps defaults
        $rootScope.googleMapsDefaults = {
            center: {
                latitude: 59.990229963467435,
                longitude: 15.806483030319214
            },
            zoom: 1
        }
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
