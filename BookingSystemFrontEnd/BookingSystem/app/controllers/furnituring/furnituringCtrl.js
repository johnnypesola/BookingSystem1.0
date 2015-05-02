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
    .controller('FurnituringListCtrl', function($scope, Furnituring, $rootScope){

        /* Private methods START */


        /* Private methods END */



            /* Public methods START */


            /* Public methods END */

            /* Initialization START */

            var furniturings = Furnituring.query();

            // In case furnituring cannot be fetched, display an error to user.
            furniturings.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Möbleringar kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.furniturings = furniturings;

            /* Initialization END */
    })

    // Create Controller
    .controller('FurnituringCreateCtrl', function($scope, $routeParams, $location, $rootScope, Furnituring){

            var that = this;

        /* Private methods START */

        that.redirectToListPage = function(){
            var objectType;

            objectType = $location.path().split('/')[1];

            // Go back to location list
            $location.path(objectType + "/lista");
        };

        /* Private methods END */

        /* Public methods START */

        // Abort creating
        $scope.abort = function(){
            that.redirectToListPage();
        };

        // Save furnituring
        $scope.save = function(){

            // Save furnituring
            Furnituring.save(
                {
                    FurnituringId: 0,
                    Name: $scope.furnituring.Name
                }
            ).$promise

                // If everything went ok
                .then(function(response){


                    $rootScope.FlashMessage = {
                        type: 'success',
                        message: 'Möbleringen "' + $scope.furnituring.Name + '" skapades med ett lyckat resultat'
                    };

                    that.redirectToListPage();

                // Something went wrong
                }).catch(function(response) {

                    // If there there was a foreign key reference
                    if (
                        response.status == 400 &&
                        typeof response.data.Message !== 'undefined' &&
                        response.data.Message === 'There is allready a Furnituring with the given name.'
                    ){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Det finns redan en möblering som heter "' + $scope.furnituring.Name +
                            '". Två möbleringar kan inte heta lika.'
                        };
                    }

                    // If there was a problem with the in-data
                    else {
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Ett oväntat fel uppstod när möbleringen skulle sparas'
                        };
                    }
                });
        };

        /* Public methods END */


        /* Initialization START */

        /* Initialization END */
    })

    // Edit Controller
    .controller('FurnituringEditCtrl', function($scope, $routeParams, $location, $rootScope, Furnituring){

            var that = this;

        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

        /* Private methods END */

        /* Public methods START */

            // Abort editing
            $scope.abort = function(){
                that.redirectToListPage();
            };

            // Save furnituring
            $scope.save = function(){

                // Save furnituring
                Furnituring.save(
                    {
                        FurnituringId: $routeParams.furnituringId,
                        Name: $scope.furnituring.Name
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Möbleringen "' + $scope.furnituring.Name + '" sparades med ett lyckat resultat'
                        };

                        that.redirectToListPage();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (
                            response.status == 400 &&
                            response.data.Message !== 'undefined' &&
                            response.data.Message === 'There is allready a Furnituring with the given name.'
                        ){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Det finns redan en möblering som heter "' + $scope.furnituring.Name +
                                '". Två möbleringar kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när möbleringen skulle sparas'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Möbleringen "' + $scope.furnituring.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };

                            that.redirectToListPage();
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

            var furnituring = Furnituring.get(
                {
                    furnituringId: $routeParams.furnituringId
                }
            );

            // In case furniturings cannot be fetched, display an error to user.
            furnituring.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Möbleringen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.furnituring = furnituring;

        /* Initialization END */
    })

    // Delete Controller
    .controller('FurnituringDeleteCtrl', function($scope, $routeParams, Furnituring, $location, $rootScope){

            var that = this;

        /* Private methods START */

            that.redirectToListPage = function(){
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
                        FurnituringId: $routeParams.furnituringId
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response) {

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Möbleringen "' + $scope.furnituring.Name + '" raderades med ett lyckat resultat'
                        };

                        that.redirectToListPage();
                    })
                    // Something went wrong
                    .catch(function(response) {

                        // If there there was a foreign key reference
                        if (
                            response.status == 400 &&
                            response.data.Message !== 'undefined' &&
                            response.data.Message === 'Foreign key references exists'
                        ){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Möbleringen kan inte raderas eftersom det finns' +
                                            ' en lokalbokning eller en lokalmöblering som refererar till möbleringen'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när möbleringen skulle tas bort'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Möbleringen "' + $scope.furnituring.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };
                        }

                    that.redirectToListPage();
                });
            };

            // Abort deletion
            $scope.abort = function(){
                that.redirectToListPage();
            };

        /* Public methods END */

        /* Initialization START */

            var furnituring = Furnituring.get(
                {
                    furnituringId: $routeParams.furnituringId
                }
            );

            // In case furniturings cannot be fetched, display an error to user.
            furnituring.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Möbleringen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.furnituring = furnituring;

        /* Initialization END */
    });

})();