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
                    },
                    // Count empty bookings
                    countEmpty: {
                        url: API_URL + 'Booking/empty/count',
                        id: '@id',
                        method: 'GET',
                        isArray: false
                    },
                    // Get empty bookings
                    queryEmpty: {
                        url: API_URL + 'Booking/empty/info',
                        id: '@id',
                        method: 'GET',
                        isArray: true
                    },
                    // Search for booking
                    querySearch: {
                        url: API_URL + 'Booking/search/:column',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            column: '@column'
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
