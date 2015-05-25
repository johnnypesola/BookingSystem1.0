/**
 * Created by jopes on 2015-05-22.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.locationBookingServices',

        // Dependencies
        [
            'ngResource'
        ])

        .factory('LocationBooking', function($resource, API_URL){

            return $resource(
                API_URL + 'LocationBooking/:locationBookingId',
                {locationBookingId: '@locationBookingId'},
                {
                    // Get bookings for specified day
                    /*queryDay: {
                        url: API_URL + 'LocationBooking/day/:date',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            date: '@date'
                        }
                    },*/

                    // Get bookings for a specified period
                    queryLessForPeriod: {
                        url: API_URL + 'LocationBooking/period/:fromDate/:toDate/less',
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
                        url: API_URL + 'LocationBooking/period/:fromDate/:toDate/more',
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
})();