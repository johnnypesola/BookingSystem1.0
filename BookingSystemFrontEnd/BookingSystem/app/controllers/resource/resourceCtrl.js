/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.resource',

        // Load Dependencies
        [
            'bookingSystem.resourceServices',
            'bookingSystem.customFilters',
            'bookingSystem.itemActionButtonsDirective'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // List Controller
    .controller('ResourceListCtrl', function($scope, Resource, $rootScope){

        /* Private methods START */


        /* Private methods END */



            /* Public methods START */


            /* Public methods END */

            /* Initialization START */

            var resources = Resource.query();

            // In case resource cannot be fetched, display an error to user.
            resources.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Möbleringar kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.resources = resources;

            /* Initialization END */
    })

    // Create Controller
    .controller('ResourceCreateCtrl', function($scope, $routeParams, $location, $rootScope, Resource){

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

        // Save resource
        $scope.save = function(){

            // Save resource
            Resource.save(
                {
                    ResourceId: 0,
                    Name: $scope.resource.Name
                }
            ).$promise

                // If everything went ok
                .then(function(response){


                    $rootScope.FlashMessage = {
                        type: 'success',
                        message: 'Möbleringen "' + $scope.resource.Name + '" skapades med ett lyckat resultat'
                    };

                    that.redirectToListPage();

                // Something went wrong
                }).catch(function(response) {

                    // If there there was a foreign key reference
                    if (response.status == 409){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Det finns redan en möblering som heter "' + $scope.resource.Name +
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
    .controller('ResourceEditCtrl', function($scope, $routeParams, $location, $rootScope, Resource){

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

            // Save resource
            $scope.save = function(){

                // Save resource
                Resource.save(
                    {
                        ResourceId: $routeParams.resourceId,
                        Name: $scope.resource.Name
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Möbleringen "' + $scope.resource.Name + '" sparades med ett lyckat resultat'
                        };

                        that.redirectToListPage();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Det finns redan en möblering som heter "' + $scope.resource.Name +
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
                                message: 'Möbleringen "' + $scope.resource.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };

                            that.redirectToListPage();
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

            var resource = Resource.get(
                {
                    resourceId: $routeParams.resourceId
                }
            );

            // In case resources cannot be fetched, display an error to user.
            resource.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Möbleringen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.resource = resource;

        /* Initialization END */
    })

    // Delete Controller
    .controller('ResourceDeleteCtrl', function($scope, $routeParams, Resource, $location, $rootScope){

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

                // Delete resource
                Resource.delete(
                    {
                        resourceId: $routeParams.resourceId
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response) {

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Möbleringen "' + $scope.resource.Name + '" raderades med ett lyckat resultat'
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
                                message: 'Möbleringen "' + $scope.resource.Name + '" existerar inte längre. Hann kanske någon radera den?'
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

            var resource = Resource.get(
                {
                    resourceId: $routeParams.resourceId
                }
            );

            // In case resources cannot be fetched, display an error to user.
            resource.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Möbleringen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.resource = resource;

        /* Initialization END */
    });

})();