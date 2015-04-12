/**
 * Created by jopes on 2015-04-12.
 */

var bookings =  angular.module('bookingSystem.bookings', []);

bookings.factory('bookings', function($http){

    return {
        list: function (callback){
            $http({
                method: 'GET',
                url: 'http://www.pesola.se:8080/BookingSystem/api/Booking',
                cache: false
            }).success(callback);
        }
    }
});