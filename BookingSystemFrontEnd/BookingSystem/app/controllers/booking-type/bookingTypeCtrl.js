/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.bookingType',

        // Load Dependencies
        [
            'bookingSystem.bookingServices',
            'bookingSystem.commonFilters',
            'bookingSystem.commonDirectives'
        ]
    )

    // Routes for startPage
    .config(["$routeProvider", function($routeProvider) {

    }])

    // Show Controller
    .controller('BookingTypeShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "BookingType", function($scope, $routeParams, $location, $rootScope, BookingType){

        var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

        /* Public methods END */


        /* Initialization START */

        var bookingType = BookingType.get(
            {
                bookingTypeId: $routeParams.bookingTypeId
            }
        );

        // In case bookingTypes cannot be fetched, display an error to user.
        bookingType.$promise.catch(function(){

            $rootScope.FlashMessage = {
                type: 'error',
                message: 'Bokningstypen kunde inte hämtas, var god försök igen.'
            };

            $scope.bookingType = null;
        });

        $scope.bookingType = bookingType;

        /* Initialization END */
    }])

    // List Controller
    .controller('BookingTypeListCtrl', ["$scope", "BookingType", "$rootScope", function($scope, BookingType, $rootScope){

        /* Private methods START */


        /* Private methods END */



            /* Public methods START */


            /* Public methods END */

            /* Initialization START */

            var bookingTypes = BookingType.query();

            // In case bookingType cannot be fetched, display an error to user.
            bookingTypes.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Bokningstyper kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.bookingTypes = bookingTypes;

            /* Initialization END */
    }])

    // Create Controller
    .controller('BookingTypeCreateCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "BookingType", "Redirect", function($scope, $routeParams, $location, $rootScope, BookingType, Redirect){

            var that = this;

        /* Private methods START */

        that.initVariables = function(){
            $scope.bookingType = {};
            $scope.bookingType.MinutesMarginBeforeBooking = 0;
            $scope.bookingType.MinutesMarginAfterBooking = 0;
        };

        /* Private methods END */

        /* Public methods START */

        // Save bookingType
        $scope.save = function(){

            // Save bookingType
            BookingType.save(
                {
                    BookingTypeId: 0,
                    Name: $scope.bookingType.Name,
                    HasLocation: !!parseInt($scope.bookingType.HasLocation,10),
                    MinutesMarginBeforeBooking: $scope.bookingType.MinutesMarginBeforeBooking,
                    MinutesMarginAfterBooking: $scope.bookingType.MinutesMarginAfterBooking
                }
            ).$promise

                // If everything went ok
                .then(function(response){


                    $rootScope.FlashMessage = {
                        type: 'success',
                        message: 'Bokningstypen "' + $scope.bookingType.Name + '" skapades med ett lyckat resultat'
                    };

                    // Redirect to show booking view
                    Redirect.to('visa/', response.BookingTypeId);

                // Something went wrong
                }).catch(function(response) {

                    // If there there was a foreign key reference
                    if (response.status == 409){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Det finns redan en bokningstyp som heter "' + $scope.bookingType.Name +
                            '". Två bokningstyper kan inte heta lika.'
                        };
                    }

                    // If there was a problem with the in-data
                    else {
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Ett oväntat fel uppstod när bokningstypen skulle sparas'
                        };
                    }
                });
        };

        /* Public methods END */


        /* Initialization START */

            that.initVariables();

        /* Initialization END */
    }])

    // Edit Controller
    .controller('BookingTypeEditCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "BookingType", function($scope, $routeParams, $location, $rootScope, BookingType){

            var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

            // Save bookingType
            $scope.save = function(){

                // Save bookingType
                BookingType.save(
                    {
                        BookingTypeId: $routeParams.bookingTypeId,
                        Name: $scope.bookingType.Name,
                        HasLocation: !!parseInt($scope.bookingType.HasLocation,10),
                        MinutesMarginBeforeBooking: $scope.bookingType.MinutesMarginBeforeBooking,
                        MinutesMarginAfterBooking: $scope.bookingType.MinutesMarginAfterBooking
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Bokningstypen "' + $scope.bookingType.Name + '" sparades med ett lyckat resultat'
                        };

                        history.back();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Det finns redan en bokningstyp som heter "' + $scope.bookingType.Name +
                                '". Två bokningstyper kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när bokningstypen skulle sparas'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Bokningstypen "' + $scope.bookingType.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };

                            history.back();
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

            var bookingType = BookingType.get(
                {
                    bookingTypeId: $routeParams.bookingTypeId
                }
            );

            // In case bookingTypes cannot be fetched, display an error to user.
            bookingType.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Bokningstypen kunde inte hämtas, var god försök igen.'
                };

                $scope.bookingType = null;
            });

            $scope.bookingType = bookingType;

        /* Initialization END */
    }])

    // Delete Controller
    .controller('BookingTypeDeleteCtrl', ["$scope", "$routeParams", "BookingType", "$location", "$rootScope", function($scope, $routeParams, BookingType, $location, $rootScope){

            var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

            // Confirm deletion
            $scope.confirm = function(){

                // Delete bookingType
                BookingType.delete(
                    {
                        bookingTypeId: $routeParams.bookingTypeId
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response) {

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Bokningstypen "' + $scope.bookingType.Name + '" raderades med ett lyckat resultat'
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
                                message:    'Bokningstypen kan inte raderas eftersom det finns' +
                                            ' en bokning eller en resurs som refererar till bokningstypen'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när bokningstypen skulle tas bort'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Bokningstypen "' + $scope.bookingType.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };
                        }

                        history.back();
                });
            };

        /* Public methods END */

        /* Initialization START */

            var bookingType = BookingType.get(
                {
                    bookingTypeId: $routeParams.bookingTypeId
                }
            );

            // In case bookingTypes cannot be fetched, display an error to user.
            bookingType.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Bokningstypen kunde inte hämtas, var god försök igen.'
                };

                $scope.bookingType = null;
            });

            $scope.bookingType = bookingType;

        /* Initialization END */
    }]);

})();