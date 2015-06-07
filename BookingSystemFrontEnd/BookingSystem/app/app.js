'use strict';

(function() {

    var BookingSystem;

    // Declare app level module which depends on views, and components
    BookingSystem = angular.module('bookingSystem', [
        'ngRoute',
        'ngResource',
        'bookingSystem.startPage',
        'bookingSystem.header',
        'bookingSystem.booking',
        'bookingSystem.bookingType',
        'bookingSystem.furnituring',
        'bookingSystem.location',
        'bookingSystem.locationBooking',
        'bookingSystem.resource',
        'bookingSystem.customer',
        'bookingSystem.commonDirectives',
        'bookingSystem.commonServices'
    ]);

    /*
     'http://localhost:6796/api/'
     'http://192.168.1.4:8080/BookingSystem/api/');

     BookingSystem.constant('API_URL', 'http://www.pesola.se:8080/BookingSystem/api/');
     BookingSystem.constant('API_IMG_PATH_URL', 'http://www.pesola.se:8080/BookingSystem/');
     */

    // Define API url, used in services
    BookingSystem.constant('API_URL', 'http://localhost:6796/api/');
    BookingSystem.constant('API_IMG_PATH_URL', 'http://localhost:6796/');
    BookingSystem.constant('UPLOAD_IMG_MAX_WIDTH', '400');
    BookingSystem.constant('UPLOAD_IMG_MAX_HEIGHT', '400');
    BookingSystem.constant('PHOTO_MISSING_SRC', 'img/icons/photo_missing.svg');
    BookingSystem.constant('OPTIONS_MAX_PEOPLE', 1000);


    BookingSystem.config(["$routeProvider", function($routeProvider) {
        
        // Declare basic routes
        $routeProvider.
            // Startpage
            when('/', {
                redirectTo: '/start'
            }).
            when('/start', {
                templateUrl: 'controllers/start/start.html'
            }).
            when('/information', {
                templateUrl: 'controllers/start/information.html'
            }).

            // Bookings
            when('/bokningstillfallen/visa/:bookingId', {
                templateUrl: 'controllers/booking/bookingShow.html'
            }).
            when('/bokningstillfallen/lista', {
                templateUrl: 'controllers/booking/bookingList.html',
                reloadOnSearch: false
            }).
            when('/bokningstillfallen/tomma', {
                templateUrl: 'controllers/booking/bookingListEmpty.html',
                reloadOnSearch: false
            }).
            when('/bokningstillfallen/radera/:bookingId', {
                templateUrl: 'controllers/booking/bookingDelete.html'
            }).
            when('/bokningstillfallen/kalender', {
                templateUrl: 'controllers/booking/bookingCalendar.html',
                reloadOnSearch: false
            }).
            when('/bokningstillfallen/redigera/:bookingId', {
                templateUrl: 'controllers/booking/bookingEdit.html'
            }).
            when('/bokningstillfallen/skapa', {
                templateUrl: 'controllers/booking/bookingCreate.html'
            }).
            when('/bokningstillfallen/sok', {
                templateUrl: 'controllers/booking/bookingSearch.html'
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
            when('/platser/sok', {
                templateUrl: 'controllers/location/locationSearch.html'
            }).

            // LocationBookings
            when('/lokalbokningar/visa/:locationBookingId', {
                templateUrl: 'controllers/location-booking/locationBookingShow.html'
            }).
            when('/lokalbokningar/lista', {
                templateUrl: 'controllers/location-booking/locationBookingList.html'
            }).
            when('/lokalbokningar/radera/:locationBookingId', {
                templateUrl: 'controllers/location-booking/locationBookingDelete.html'
            }).
            when('/lokalbokningar/redigera/:locationBookingId', {
                templateUrl: 'controllers/location-booking/locationBookingEdit.html'
            }).
            when('/lokalbokningar/skapa/', {
                templateUrl: 'controllers/location-booking/locationBookingCreate.html'
            }).
            when('/lokalbokningar/skapa/:bookingId', {
                templateUrl: 'controllers/location-booking/locationBookingCreate.html'
            }).
            when('/lokalbokningar/kalender', {
                templateUrl: 'controllers/location-booking/locationBookingCalendar.html',
                reloadOnSearch: false
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
            when('/kunder/sok', {
                templateUrl: 'controllers/customer/customerSearch.html'
            }).

            // Page not found
            otherwise({
                templateUrl: 'shared/views/notFound.html'
            });
    }]);

    BookingSystem.run(["$rootScope", "$location", "API_IMG_PATH_URL", function($rootScope, $location, API_IMG_PATH_URL) {

        // Add values to $rootScope, for access on all pages, even without controllers
        $rootScope.appLocation = $location;

        $rootScope.Int32MaxValue = 2147483647;
        $rootScope.Int16MaxValue = 32767;
        $rootScope.regExp = {
            textField : new RegExp("^[0-9a-zA-ZåäöÅÄÖé\\-_&\.,~\\^@()/%\\s\!]*$"),
            postNumber : new RegExp("^[0-9]{3}\\s[0-9]{2}$"),
            phoneNumber : new RegExp("^[0-9\\-\\s]*$")
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
        };

        // Set Moment date lib locale
        moment.locale('sv');
    }]);

})();
