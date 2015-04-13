/**
 * Created by jopes on 2015-04-12.
 */

var bookings =  angular.module('bookingSystem.bookings', []);

bookings.factory('bookings', function($http){

    return {
        list: function (callback){
            $http({
                method: 'GET',
                url: 'http://192.168.1.4:8080/BookingSystem/api/Booking',
                cache: false
            }).success(callback);
        }
    }
});