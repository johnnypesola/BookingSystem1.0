/**
 * Created by jopes on 2015-04-12.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.bookingServices',

        // Dependencies
        [
            'ngResource'
        ])

        .factory('Booking', function($resource){

            // Functions
            var parseDates = function(response){
                response.forEach(function(element, index, array){
                    element.StartTime = new Date(element.StartTime);
                    element.EndTime = new Date(element.EndTime);
                });
            };

            return $resource('http://192.168.1.4:8080/BookingSystem/api/Booking',
                {},
                {
                    // Get bookings for specified day
                    queryDay: {
                        url: 'http://192.168.1.4:8080/BookingSystem/api/Booking/day/:date',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            date: '@date'
                        }
                    },

                    // Get bookings for a specified period
                    queryLessForPeriod: {
                        url: 'http://192.168.1.4:8080/BookingSystem/api/Booking/period/:fromDate/:toDate/:type/less',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            fromDate: '@fromDate',
                            toDate: '@toDate',
                            type: '@type' // What kind of bookings to get. Allowed values: meal, resource, location
                        }
                    },
                    // Get bookings for a specified period
                    queryMoreForPeriod: {
                        url: 'http://192.168.1.4:8080/BookingSystem/api/Booking/period/:fromDate/:toDate/:type/more',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            fromDate: '@fromDate',
                            toDate: '@toDate',
                            type: '@type' // What kind of bookings to get. Allowed values: meal, resource, location
                        }
                    }
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
