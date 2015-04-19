/**
 * Created by jopes on 2015-04-12.
 */

(function(){
    var startPage =  angular.module('bookingSystem.startPage', ['bookingSystem.bookingServices', 'bookingSystem.customFilters']);

    // Routes for startPage
    startPage.config(function($routeProvider) {

    });

    // Controller
    startPage.controller('BookingsController', function($scope, Booking){

        Booking.list(function(bookings) {
            $scope.bookings = bookings;
        });
    })

})();



