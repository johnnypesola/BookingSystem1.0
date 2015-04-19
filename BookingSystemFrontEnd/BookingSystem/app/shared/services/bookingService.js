/**
 * Created by jopes on 2015-04-12.
 */

(function(){

    angular.module('bookingSystem.bookingServices', ['ngResource'])
        .factory('Booking', function($resource){

            return $resource('http://192.168.1.4:8080/BookingSystem/api/Booking/:id',
                {},
                {
                    queryPeriod: {
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {from: '2015-01-01', to: '2015-12-24'}}
                });
            /*
             query: function (callback){
             $http({
             method: 'GET',
             url: 'http://192.168.1.4:8080/BookingSystem/api/Booking',
             cache: false
             }).success(callback);
             },

             queryBetweenDates: function (callback){
             $http({
             method: 'GET',
             url: 'http://192.168.1.4:8080/BookingSystem/api/Booking',
             cache: false
             }).success(callback);
             }
             */
        });

})();
