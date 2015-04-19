/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.booking',

        // Load Dependencies
        [
            'bookingSystem.bookingServices',
            'bookingSystem.customFilters',
            'bookingSystem.calendarDirective'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Controller
    .controller('BookingCtrl', function($scope, Booking){

            $scope.bookings = Booking.query();
    });

})();