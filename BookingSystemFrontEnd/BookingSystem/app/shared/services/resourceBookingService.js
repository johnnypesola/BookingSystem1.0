/**
 * Created by jopes on 2015-05-22.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.resourceBookingServices',

        // Dependencies
        [
            'ngResource'
        ])

        .factory('ResourceBooking', ["$resource", "API_URL", function($resource, API_URL){

            return $resource(
                API_URL + 'ResourceBooking/:resourceBookingId',
                {locationBookingId: '@resourceBookingId'},
                {
                    // Get bookings for a specified period
                    queryLessForPeriod: {
                        url: API_URL + 'ResourceBooking/period/:fromDate/:toDate/less',
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
                        url: API_URL + 'ResourceBooking/period/:fromDate/:toDate/more',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            fromDate: '@fromDate',
                            toDate: '@toDate'
                        }
                    }
                });
        }])
})();