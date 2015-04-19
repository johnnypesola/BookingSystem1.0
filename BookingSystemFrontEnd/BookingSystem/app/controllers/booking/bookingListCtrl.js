/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    angular.module('bookingSystem.booking', ['bookingSystem.bookingServices', 'bookingSystem.customFilters', 'booking.calendarDirective'])

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Controller
    .controller('BookingCtrl', function($scope, Booking){

            $scope.bookings = Booking.query();
    });

})();