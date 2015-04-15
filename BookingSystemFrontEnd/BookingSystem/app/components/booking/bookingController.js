/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    var booking =  angular.module('bookingSystem.booking', ['bookingSystem.bookings', 'bookingSystem.customFilters']);

    // Routes for startPage
    booking.config(function($routeProvider) {

    });

    // Controller
    booking.controller('BookingCtrl', function($scope, bookings){

        bookings.list(function(bookings) {
            $scope.bookings = bookings;
        });
    })

})();