/**
 * Created by jopes on 2015-04-12.
 */

(function(){
    var startPage =  angular.module('bookingSystem.startPage', ['bookingSystem.bookings', 'bookingSystem.customFilters']);

    // Routes for startPage
    startPage.config(function($routeProvider) {

    });

    // Controller
    startPage.controller('BookingsController', function($scope, bookings){

        bookings.list(function(bookings) {
            $scope.bookings = bookings;
        });

    })

})();



