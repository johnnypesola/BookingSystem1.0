/**
 * Created by jopes on 2015-04-12.
 */

(function(){

    // Declare module
    angular.module('bookingSystem.startPage',

        // Dependencies
        [
            'bookingSystem.bookingServices',
            'bookingSystem.customFilters'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Controller
    .controller('BookingsController', function($scope, Booking){

        $scope.bookings = Booking.query();

        /*
        Booking.list(function(bookings) {
            $scope.bookings = bookings;
        });
        */
    });


})();



