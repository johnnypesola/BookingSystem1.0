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
            'bookingSystem.itemActionButtonsDirective',
            'bookingSystem.pageHeaderButtonsDirective',
            'bookingSystem.imageUploaderDirective',
            'bookingSystem.imageResizeServices',
            'uiGmapgoogle-maps' // Google maps API
        ]
    )

    // Config for module
    .config(function($routeProvider, uiGmapGoogleMapApiProvider) {

        // Google maps API
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.17',
            libraries: 'weather,geometry,visualization',
            language: 'sv'
        });
    })

    // Show Controller
    .controller('LocationShowCtrl', function($scope, Location, $routeParams, $location, $rootScope){

            var that = this;
            $scope.markers = [];

        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

            // Add default map variables to scope
            that.initMapVariables = function() {

                $scope.map = {
                    center: $rootScope.googleMapsDefaults.center,
                    zoom: $rootScope.googleMapsDefaults.zoom,
                    bounds: {},
                    options: { mapTypeId: google.maps.MapTypeId.SATELLITE } // Make satellite view default
                };
            };

            // Convert markers from data fetched from backend to match google maps format.
            that.convertMarkers = function() {

                $scope.markers.push(
                    {
                        id: that.location.LocationId,
                        coords: {
                            latitude: that.location.GPSLatitude,
                            longitude: that.location.GPSLongitude
                        }
                    }
                );
            };

        /* Private methods END */

        /* Public methods START */

            // Abort editing
            $scope.back = function(){
                that.redirectToListPage();
            };

        /* Public methods END */

        /* Initialization START */

            that.location = Location.get(
                {
                    locationId: $routeParams.locationId
                }
            );

            // In case locations cannot be fetched, display an error to user.
            that.location.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Platsen kunde inte hämtas, var god försök igen.'
                };
            })

            // When location has been fetched
            .then(function(){

                // Add locations to public scope
                $scope.location = that.location;

                // Init map variables
                that.initMapVariables();

                // Add watch on $scope.map.bounds to check (every time it changes) if return boundary data is received from google maps
                $scope.$watch(
                    // Get $scope.map.bounds on change
                    function() {return $scope.map.bounds;},

                    // Do the following on change
                    function(nv, ov) {

                        // Only need to regenerate once
                        if (!ov.southwest && nv.southwest) {

                            that.convertMarkers();
                        }
                    },
                    true
                );
            });


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
    .controller('LocationEditCtrl', function($scope, $routeParams, $location, $rootScope, $timeout, Location){

            var that = this;
                $scope.markers = [];

        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

            // Add default map variables to scope
            that.initMapVariables = function() {

                $scope.map = {
                    center: $rootScope.googleMapsDefaults.center,
                    zoom: $rootScope.googleMapsDefaults.zoom,
                    bounds: {},
                    options: { mapTypeId: google.maps.MapTypeId.SATELLITE }, // Make satellite view default
                    events: {
                        click: function (map, eventName, args) {
                            that.moveMarkerOnClick(map, eventName, args);
                        }
                    }
                };
            };


            that.moveMarkerOnClick = function(map, eventName, args) {

                // Refresh location variables
                $scope.location.GPSLatitude = args[0].latLng.lat();
                $scope.location.GPSLongitude = args[0].latLng.lng();

                // Refresh map marker variables
                $scope.markers[0].coords = {
                    latitude : args[0].latLng.lat(),
                    longitude : args[0].latLng.lng()
                };

                $scope.$apply();
            };

            // Convert markers from data fetched from backend to match google maps format.
            that.convertMarkers = function() {

                $scope.markers.push(
                    {
                        id: that.location.LocationId,
                        coords: {
                            latitude: that.location.GPSLatitude,
                            longitude: that.location.GPSLongitude
                        }
                    }
                );
            };

        /* Private methods END */

        /* Public methods START */

            // On marker drag end
            $scope.onMarkerDragEnd = function($event) {
                $scope.location.GPSLatitude = $event.position.lat();
                $scope.location.GPSLongitude = $event.position.lng();
            };

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

            that.location = Location.get(
                {
                    locationId: $routeParams.locationId
                }
            );

            // In case locations cannot be fetched, display an error to user.
            that.location.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Platsen kunde inte hämtas, var god försök igen.'
                };
            })


            // When location has been fetched
            .then(function(){

                // Add locations to public scope
                    $scope.location = that.location;

                // Init map variables
                that.initMapVariables();


                // Add watch on $scope.map.bounds to check (every time it changes) if return boundary data is received from google maps
                $scope.$watch(
                    // Get $scope.map.bounds on change
                    function() {return $scope.map.bounds;},

                    // Do the following on change
                    function(nv, ov) {

                        // Only need to regenerate once
                        if (!ov.southwest && nv.southwest) {

                            that.convertMarkers();
                        }
                    },
                    true
                );
            });

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
    })

    // Map Controller
    .controller('LocationMapCtrl', function($scope, Location, $rootScope, $location, uiGmapGoogleMapApi){

            var that = this;
                $scope.markers = [];
                that.locations = [];

        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

            that.redirectToEditPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/redigera/" + $scope.visibleLocation.LocationId);
            };

            // Convert markers from data fetched from backend to match google maps format.
            that.convertMarkers = function() {
                that.locations.forEach(function(location, index, array){
                    $scope.markers.push(
                        {
                            id : location.LocationId,
                            coords : { latitude : location.GPSLatitude, longitude : location.GPSLongitude },
                            title : location.Name
                        }
                    );
                    // Define OnClick function, show more info about the location to the user.
                    $scope.markers[index].showLocation = function() {

                        $scope.markers[index].show = true;
                        $scope.visibleLocation = location;
                    };
                    $scope.markers[index].hideLocation = function() {

                        $scope.visibleLocation = null;
                    }

                });
            };

            // Add default map variables to scope
            that.initMapVariables = function() {

                $scope.map = {
                    center: $rootScope.googleMapsDefaults.center,
                    zoom: $rootScope.googleMapsDefaults.zoom,
                    bounds: {}
                };
            };


        /* Private methods END */


        /* Public methods START */

            // Back
            $scope.back = function(){
                that.redirectToListPage();
            };

            // Back
            $scope.edit = function(){
                that.redirectToEditPage();
            };

        /* Public methods END */

        /* Initialization START */

            var locations = Location.query();

            // In case location cannot be fetched, display an error to user.
            locations.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Platser kunde inte hämtas, var god försök igen.'
                };
            })

            // When locations have been fetched
            .then(function(){

                // Add locations to private scope
                that.locations = locations;

                // Init map variables
                that.initMapVariables();

                // Add watch on $scope.map.bounds to check (every time it changes) if return boundary data is received from google maps
                $scope.$watch(
                    // Get $scope.map.bounds on change
                    function() {return $scope.map.bounds;},

                    // Do the following on change
                    function(nv, ov) {

                        // Only need to regenerate once
                        if (!ov.southwest && nv.southwest) {

                            that.convertMarkers();
                        }
                    },
                    true
                );
            });

        /* Initialization END */
    });

})();