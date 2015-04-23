/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.furnituring',

        // Load Dependencies
        [
            'bookingSystem.furnituringServices',
            'bookingSystem.customFilters',
            'bookingSystem.itemActionButtonsDirective'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // List Controller
    .controller('FurnituringListCtrl', function($scope, Furnituring){

        /* Private methods START */


        /* Private methods END */



            /* Public methods START */


            /* Public methods END */

            /* Initialization START */

            $scope.furniturings = Furnituring.query();

            /* Initialization END */
    })

    // Delete Controller
    .controller('FurnituringDeleteCtrl', function($scope, $routeParams, Furnituring, $location, $rootScope){

        /* Private methods START */

            var redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

        /* Private methods END */



        /* Public methods START */

            // Confirm deletion
            $scope.confirm = function(){

                // Delete furnituring
                Furnituring.delete(
                    {
                        furnituringId: $routeParams.furnituringId
                    }
                )
                .$promise.catch(function(response) {

                    console.log(response);

                    // If everything went ok
                    if (response.status == 200) {
                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Möbleringen togs bort med ett lyckat resultat'
                        }
                    }

                    // If there there was a foreign key reference
                    if (
                        response.status == 400 &&
                        response.data.Message !== 'undefined' &&
                        response.data.Message === 'Foreign key references exists'
                    ){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message:    'Möbleringen kan inte tas bort eftersom det finns' +
                                        ' en lokalbokning eller en lokalmöblering som refererar till möbleringen'
                        };
                    }

                    // If there was a problem with the in-data
                    else if (response.status == 400){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Ett oväntat fel uppstod när möbleringen skulle tas bort'
                        };
                    }

                    // If the entry was not found
                    if (response.status == 404) {
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Möbleringen som skulle tas bort existerar inte längre. Hann kanske någon radera den före?'
                        };
                    }

                    redirectToListPage();
                });
            };

            // Abort deletion
            $scope.abort = function(){
                redirectToListPage();
            };

        /* Public methods END */

        /* Initialization START */

        $scope.furnituring = Furnituring.get(
            {
                furnituringId: $routeParams.furnituringId
            }
        );

        /* Initialization END */
    });

})();