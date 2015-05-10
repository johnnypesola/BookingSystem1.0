/**
 * Created by jopes on 2015-04-12.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.locationServices',

        // Dependencies
        [
            'ngResource'
        ])

        .factory('Location', function($resource, API_URL){

            return $resource(
                API_URL + 'Location/:locationId',
                {locationId: '@locationId'}
            );

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
        })

        .factory('LocationImage', function($resource, API_URL){

            return $resource(
                API_URL + 'Location/images/:locationId',
                {locationId: '@locationId'},
                {
                    save: {
                        method: 'POST',
                        transformRequest: formDataObject,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                }
            );
        });
})();
