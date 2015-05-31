/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.resource',

        // Load Dependencies
        [
            'bookingSystem.resourceServices',
            'bookingSystem.commonFilters',
            'bookingSystem.commonDirectives'
        ]
    )

    // Routes for startPage
    .config(["$routeProvider", function($routeProvider) {

    }])

    // Show Controller
    .controller('ResourceShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Resource", function($scope, $routeParams, $location, $rootScope, Resource){

        var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

        /* Public methods END */


        /* Initialization START */

            $scope.resource = Resource.get(
                {
                    resourceId: $routeParams.resourceId
                }
            );

            // In case resources cannot be fetched, display an error to user.
            $scope.resource.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Resursen kunde inte hämtas, var god försök igen.'
                };

                $scope.resource = null;
            });

        /* Initialization END */
    }])

    // List Controller
    .controller('ResourceListCtrl', ["$scope", "Resource", "$rootScope", function($scope, Resource, $rootScope){

        /* Private methods START */

        /* Private methods END */


        /* Public methods START */

        /* Public methods END */


        /* Initialization START */

            $scope.resources = Resource.query();

            // In case resource cannot be fetched, display an error to user.
            $scope.resources.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Resurser kunde inte hämtas, var god försök igen.'
                };
            });

        /* Initialization END */
    }])

    // Create Controller
    .controller('ResourceCreateCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Resource", function($scope, $routeParams, $location, $rootScope, Resource){

            var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

            // Save resource
            $scope.save = function(){

                // Save resource
                Resource.save(
                    {
                        ResourceId: 0,
                        Name: $scope.resource.Name,
                        Count: $scope.resource.Count,
                        BookingPricePerHour: $scope.resource.BookingPricePerHour,
                        MinutesMarginAfterBooking: $scope.resource.MinutesMarginAfterBooking,
                        WeekEndCount: $scope.resource.WeekEndCount
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){


                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Resursen "' + $scope.resource.Name + '" skapades med ett lyckat resultat'
                        };

                        history.back();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Det finns redan en resurs som heter "' + $scope.resource.Name +
                                '". Två resurser kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när resursen skulle sparas'
                            };
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

        /* Initialization END */
    }])

    // Edit Controller
    .controller('ResourceEditCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Resource", function($scope, $routeParams, $location, $rootScope, Resource){

            var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

            // Save resource
            $scope.save = function(){

                // Save resource
                Resource.save(
                    {
                        ResourceId: $routeParams.resourceId,
                        Name: $scope.resource.Name,
                        Count: $scope.resource.Count,
                        BookingPricePerHour: $scope.resource.BookingPricePerHour,
                        MinutesMarginAfterBooking: $scope.resource.MinutesMarginAfterBooking,
                        WeekEndCount: $scope.resource.WeekEndCount
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Resursen "' + $scope.resource.Name + '" sparades med ett lyckat resultat'
                        };

                        history.back();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Det finns redan en resurs som heter "' + $scope.resource.Name +
                                '". Två resurser kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när resursen skulle sparas'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Resursen "' + $scope.resource.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };

                            history.back();
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

            $scope.resource = Resource.get(
                {
                    resourceId: $routeParams.resourceId
                }
            );

            // In case resources cannot be fetched, display an error to user.
            $scope.resource.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Resursen kunde inte hämtas, var god försök igen.'
                };

                $scope.resource = null;
            });

        /* Initialization END */
    }])

    // Delete Controller
    .controller('ResourceDeleteCtrl', ["$scope", "$routeParams", "Resource", "$location", "$rootScope", function($scope, $routeParams, Resource, $location, $rootScope){

            var that = this;

        /* Private methods START */

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
                            message: 'Resursen "' + $scope.resource.Name + '" raderades med ett lyckat resultat'
                        };

                        history.back();
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
                                message:    'Resursen kan inte raderas eftersom det finns' +
                                            ' en resursbokning som refererar till resursen'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när resursen skulle tas bort'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Resursen "' + $scope.resource.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };
                        }

                        history.back();
                });
            };

        /* Public methods END */

        /* Initialization START */

            $scope.resource = Resource.get(
                {
                    resourceId: $routeParams.resourceId
                }
            );

            // In case resources cannot be fetched, display an error to user.
            $scope.resource.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Resursen kunde inte hämtas, var god försök igen.'
                };

                $scope.resource = null;
            });

        /* Initialization END */
    }]);

})();