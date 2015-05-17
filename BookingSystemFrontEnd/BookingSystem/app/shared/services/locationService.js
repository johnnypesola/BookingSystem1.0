/**
 * Created by jopes on 2015-04-12.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.locationServices',

        // Dependencies
        [
            'ngResource',
            'bookingSystem.furnituringServices'
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
                }
            }
        })

        .factory('LocationFurnituringHelper', function(LocationFurnituring, Furnituring) {

            return {

                // Get location specific furniturings and all furniturings combined. (specific furniturings selected)
                // For use in checkboxes and such.
                getCombined : function(locationId){
                    var furniturings,
                        locationFurniturings;

                    // Get all available furniturings
                    furniturings = Furnituring.query();

                    // Get saved furniturings for this locations
                    locationFurniturings = LocationFurnituring.queryForLocation({locationId: locationId});

                    // When all available furniturings have been fetched
                    furniturings.$promise.finally(function(){

                        // When location available furniturings have been fetched
                        locationFurniturings.$promise.finally(function(){

                            // Mark saved furniturings for this locations as selected
                            furniturings.forEach(function(availableFurnituring) {
                                var match = false;
                                // If there are any existing location furniturings, mark them as selected
                                locationFurniturings.forEach(function(locationFurnituring) {

                                    if (availableFurnituring.FurnituringId == locationFurnituring.FurnituringId) {
                                        availableFurnituring.Selected = true;
                                        availableFurnituring.MaxPeople = locationFurnituring.MaxPeople;

                                        match = true;

                                        return;
                                    }
                                });

                                if(!match){
                                    availableFurnituring.Selected = false;
                                    availableFurnituring.MaxPeople = 0;
                                }
                            })
                        });
                    });

                    // Return furniturings with promise
                    return furniturings;
                }
            }
        })
})();
