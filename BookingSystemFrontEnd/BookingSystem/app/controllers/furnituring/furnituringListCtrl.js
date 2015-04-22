/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.furnituring',

        // Load Dependencies
        [
            'bookingSystem.furnituringServices',
            'bookingSystem.customFilters'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Controller
    .controller('FurnituringCtrl', function($scope, Furnituring){

        /* Private methods START */


        /* Private methods END */



            /* Public methods START */


            /* Public methods END */

            /* Initialization START */

            $scope.furniturings = Furnituring.query();

            /* Initialization END */
    });

})();