/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.location',

        // Load Dependencies
        [
            'bookingSystem.locationServices',
            'bookingSystem.customFilters',
            'bookingSystem.itemActionButtonsDirective'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Show Controller
    .controller('LocationShowCtrl', function($scope, Location, $routeParams, $location, $rootScope){

            var that = this;

        /* Private methods START */

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
            $scope.back = function(){
                that.redirectToListPage();
            };

        /* Initialization START */

            var location = Location.get(
                {
                    locationId: $routeParams.locationId
                }
            );

            // In case locations cannot be fetched, display an error to user.
            location.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Platsen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.location = location;

        /* Initialization END */
    })

    // List Controller
    .controller('LocationListCtrl', function($scope, Location, $rootScope){

        /* Private methods START */

        /* Private methods END */



            /* Public methods START */


            /* Public methods END */

            /* Initialization START */

            var locations = Location.query();

            // In case location cannot be fetched, display an error to user.
            locations.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Platser kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.locations = locations;

            /* Initialization END */
    })

    // Create Controller
    .controller('LocationCreateCtrl', function($scope, $routeParams, $location, $rootScope, Location){

            var that = this;

        /* Private methods START */

            that.initVariables = function(){

            };

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

        // Save location
        $scope.save = function(){

            // Save location
            Location.save(
                {
                    LocationId: 0,
                    Name: $scope.location.Name,
                    MaxPeople: $scope.location.MaxPeople,
                    GPSLatitude: $scope.location.GPSLatitude,
                    GPSLongitude: $scope.location.GPSLongitude,
                    ImageSrc: $scope.location.ImageSrc,
                    BookingPricePerHour: $scope.location.BookingPricePerHour,
                    MinutesMarginAfterBooking: $scope.location.MinutesMarginAfterBooking
                }
            ).$promise

                // If everything went ok
                .then(function(response){


                    $rootScope.FlashMessage = {
                        type: 'success',
                        message: 'Möbleringen "' + $scope.location.Name + '" skapades med ett lyckat resultat'
                    };

                    that.redirectToListPage();

                // Something went wrong
                }).catch(function(response) {

                    // If there there was a foreign key reference
                    if (response.status == 409){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Det finns redan en plats som heter "' + $scope.location.Name +
                            '". Två platser kan inte heta lika.'
                        };
                    }

                    // If there was a problem with the in-data
                    else {
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Ett oväntat fel uppstod när platsen skulle sparas'
                        };
                    }
                });
        };

        /* Public methods END */


        /* Initialization START */

            that.initVariables();

        /* Initialization END */
    })

    // Edit Controller
    .controller('LocationEditCtrl', function($scope, $routeParams, $location, $rootScope, Location){

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

            // Save location
            $scope.save = function(){

                // Save location
                Location.save(
                    {
                        LocationId: $routeParams.locationId,
                        Name: $scope.location.Name,
                        MaxPeople: $scope.location.MaxPeople,
                        GPSLatitude: $scope.location.GPSLatitude,
                        GPSLongitude: $scope.location.GPSLongitude,
                        ImageSrc: $scope.location.ImageSrc,
                        BookingPricePerHour: $scope.location.BookingPricePerHour,
                        MinutesMarginAfterBooking: $scope.location.MinutesMarginAfterBooking
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Platsen "' + $scope.location.Name + '" sparades med ett lyckat resultat'
                        };

                        that.redirectToListPage();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Det finns redan en plats som heter "' + $scope.location.Name +
                                '". Två platser kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när platsen skulle sparas'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Platsen "' + $scope.location.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };

                            that.redirectToListPage();
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

            var location = Location.get(
                {
                    locationId: $routeParams.locationId
                }
            );

            // In case locations cannot be fetched, display an error to user.
            location.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Platsen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.location = location;

        /* Initialization END */
    })

    // Delete Controller
    .controller('LocationDeleteCtrl', function($scope, $routeParams, Location, $location, $rootScope){

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

                // Delete location
                Location.delete(
                    {
                        locationId: $routeParams.locationId
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response) {

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Platsen "' + $scope.location.Name + '" raderades med ett lyckat resultat'
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
                                message:    'Platsen kan inte raderas eftersom det finns' +
                                            ' en lokalbokning eller en lokalplats som refererar till platsen'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när platsen skulle tas bort'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Platsen "' + $scope.location.Name + '" existerar inte längre. Hann kanske någon radera den?'
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

            var location = Location.get(
                {
                    locationId: $routeParams.locationId
                }
            );

            // In case locations cannot be fetched, display an error to user.
            location.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Platsen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.location = location;

        /* Initialization END */
    });

})();