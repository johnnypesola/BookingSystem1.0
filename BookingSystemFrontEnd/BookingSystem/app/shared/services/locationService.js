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

        .factory('LocationImage', function($http, API_URL) {


            return {
                upload : function(imageData, locationId) {

                    return $http(
                        {
                            method: 'POST',
                            url: API_URL + 'Location/image/' + locationId,
                            data: imageData,
                            headers: {'Content-Type': undefined}
                        }
                    );
                    /*
                     .success(function(data, status, headers, config) {

                     });
                     */
                }
            }

        });

        /*
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
        */
})();
