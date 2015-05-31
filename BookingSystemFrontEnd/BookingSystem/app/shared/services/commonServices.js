/**
 * Created by jopes on 2015-05-27.
 */


(function(){
    // Declare module
    angular.module('bookingSystem.commonServices',

        // Dependencies
        [

        ])

        .factory('Redirect', ["$location", function ($location) {

            return {
                to: function (page, value) {

                    var objectType;

                    objectType = $location.path().split('/')[1];

                    // Go back to location list
                    $location.path(objectType + "/" + page + (value || "") );
                }
            }
        }])
})();
