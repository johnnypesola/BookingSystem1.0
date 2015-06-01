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

        .factory('Location', ["$resource", "API_URL", function($resource, API_URL){

            return $resource(
                API_URL + 'Location/:locationId',
                {locationId: '@locationId'},
                {
                    queryFreeForPeriod: {
                        url: API_URL + 'Location/free/:fromDate/:toDate',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            fromDate: '@fromDate',
                            toDate: '@toDate'
                        }
                    },
                    // Search for location
                    querySearch: {
                        url: API_URL + 'Location/search/:column',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            column: '@column'
                        }
                    }
                }
            );
        }])

        .factory('LocationImage', ["$http", "API_URL", function($http, API_URL) {

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
        }])

        .factory('LocationFurnituringHelper', ["LocationFurnituring", "Furnituring", function(LocationFurnituring, Furnituring) {

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
                                var match = false,
                                    i;

                                // If there are any existing location furniturings, mark them as selected
                                for (i = 0; i < locationFurniturings.length; i++){
                                    if (availableFurnituring.FurnituringId == locationFurniturings[i].FurnituringId) {
                                        availableFurnituring.Selected = true;
                                        availableFurnituring.MaxPeople = locationFurniturings[i].MaxPeople;

                                        match = true;
                                        break;
                                    }
                                }

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
        }])
})();
