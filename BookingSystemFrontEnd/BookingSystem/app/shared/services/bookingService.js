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

        .factory('Booking', function($resource, API_URL){

            return $resource(
                API_URL + 'Booking/:bookingId',
                {bookingId: '@bookingId'},
                {
                    // Get bookings for specified day
                    queryDay: {
                        url: API_URL + 'Booking/day/:date',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            date: '@date'
                        }
                    },

                    // Get bookings for a specified period
                    queryLessForPeriod: {
                        url: API_URL + 'Booking/period/:fromDate/:toDate/less',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            fromDate: '@fromDate',
                            toDate: '@toDate'
                        }
                    },
                    // Get bookings for a specified period
                    queryMoreForPeriod: {
                        url: API_URL + 'Booking/period/:fromDate/:toDate/more',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            fromDate: '@fromDate',
                            toDate: '@toDate'
                        }
                    }
                });
        })

        .factory('BookingType', function($resource, API_URL){

            return $resource(
                API_URL + 'BookingType/:bookingTypeId',
                {bookingId: '@bookingTypeId'}
            );
        })

})();
