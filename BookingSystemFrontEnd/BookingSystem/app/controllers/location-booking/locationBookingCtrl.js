/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.locationBooking',

        // Load Dependencies
        [
            'bookingSystem.locationBookingServices',
            'bookingSystem.commonFilters',
            'bookingSystem.commonDirectives'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Show Controller
    .controller('LocationBookingShowCtrl', function($scope, $routeParams, $location, $rootScope, LocationBooking){

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

            // Back button
            $scope.back = function(){
                that.redirectToListPage();
            };

        /* Public methods END */


        /* Initialization START */

        var locationBooking = LocationBooking.get(
            {
                locationBookingId: $routeParams.locationBookingId
            }
        );

        // In case locationBookings cannot be fetched, display an error to user.
        locationBooking.$promise.catch(function(){

            $rootScope.FlashMessage = {
                type: 'error',
                message: 'Möbleringen kunde inte hämtas, var god försök igen.'
            };
        });

        $scope.locationBooking = locationBooking;

        /* Initialization END */
    })

    // List Controller
    .controller('LocationBookingListCtrl', function($scope, LocationBooking, $rootScope){
            var that = this;
            var currentDateObj;

            /* Private methods START */

            that.initDateVariables = function () {
                that.currentYear = currentDateObj.getFullYear();
                that.currentMonth = currentDateObj.getMonth();
                that.currentMonthName = moment(currentDateObj).format('MMMM');
                that.currentMonthNumberOfDays = new Date(that.currentYear, that.currentMonth + 1, 0).getDate();

                that.currentMonthStartDateObj = new Date(that.currentYear, that.currentMonth, 1);
                that.currentMonthEndDateObj = new Date(that.currentYear, that.currentMonth, that.currentMonthNumberOfDays);
            };

            // Get bookings
            that.getLocationBookings = function(){

                // Store bookings in private variable
                that.locationBookings = LocationBooking.queryMoreForPeriod(
                    {
                        fromDate: that.currentMonthStartDateObj.BookingSystemGetYearsMonthsDays(),
                        toDate: that.currentMonthEndDateObj.BookingSystemGetYearsMonthsDays()
                    });

                // In case bookings cannot be fetched, display an error to user.
                that.locationBookings.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Bokningarna kunde inte hämtas, var god försök igen.'
                    };
                });

                // Display bookings to user
                $scope.locationBookings = that.locationBookings;
            };

            // Make public variables accessible in template
            that.addVarsToScope = function () {

                $scope.currentYear = that.currentYear;
                $scope.currentMonthName = that.currentMonthName;
            };

            /* Private methods END */

            /* Public methods START */
            $scope.changeToPreviousMonth = function(){
                currentDateObj = new Date(that.currentYear, that.currentMonth - 1);

                that.initDateVariables();
                that.getLocationBookings();
                that.addVarsToScope();
            };

            $scope.changeToNextMonth = function(){
                currentDateObj = new Date(that.currentYear, that.currentMonth + 1);

                that.initDateVariables();
                that.getLocationBookings();
                that.addVarsToScope();
            };


            /* Initialization START */

            // Init date to now
            currentDateObj = new Date();

            that.initDateVariables();
            that.getLocationBookings();
            that.addVarsToScope();

            /* Initialization END */
    })

    // Create Controller
    .controller('LocationBookingCreateCtrl', function($scope, $routeParams, $location, $rootScope, LocationBooking, LocationFurnituring, Location){

            var that = this;
            $scope.furniturings = [];

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

            // Save locationBooking
            $scope.save = function(){

                // Save locationBooking
                LocationBooking.save(
                    {
                        LocationBookingId: 0,
                        BookingId: $scope.locationBooking.BookingId,
                        LocationId: $scope.locationBooking.LocationId,
                        FurnituringId: $scope.locationBooking.SelectedFurnituring.FurnituringId,
                        StartTime: moment($scope.StartDate + " " + $scope.StartTime).toDate(),
                        EndTime: moment($scope.EndDate + " " + $scope.EndTime).toDate(),
                        NumberOfPeople: $scope.locationBooking.NumberOfPeople
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){


                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Möbleringen "' + $scope.locationBooking.Name + '" skapades med ett lyckat resultat'
                        };

                        that.redirectToListPage();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Det finns redan en lokal/plats-bokning som heter "' + $scope.locationBooking.Name +
                                '". Två lokal/plats-bokningar kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när lokal/plats-bokningen skulle sparas'
                            };
                        }
                    });
            };

            $scope.updateFurniturings = function() {

                // Get all available furniturings for selected location
                if(!!$scope.locationBooking.LocationId){
                    $scope.furniturings = LocationFurnituring.queryForLocation(
                        {
                            locationId: $scope.locationBooking.LocationId
                        }
                    );

                    // If furniturings could not be fetched
                    $scope.furniturings.$promise.catch(function(){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Möbleringar för vald lokal kunde inte hämtas.'
                        };
                    })

                    // If furniturings were fetch successfully
                    .then(function(){
                        $scope.showInfoAboutNoFurniturings = !$scope.furniturings.length;
                    })
                }
                else {
                    $scope.furnituring = [];
                }
            };

        /* Public methods END */


        /* Initialization START */

            // Get all available locations
            $scope.locations = Location.query();

        /* Initialization END */
    })

    // Edit Controller
    .controller('LocationBookingEditCtrl', function($scope, $routeParams, $location, $rootScope, LocationBooking){

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

            // Save locationBooking
            $scope.save = function(){

                // Save locationBooking
                LocationBooking.save(
                    {
                        LocationBookingId: $routeParams.locationBookingId,
                        Name: $scope.locationBooking.Name
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Lokal/plats-bokningen "' + $scope.locationBooking.Name + '" sparades med ett lyckat resultat'
                        };

                        that.redirectToListPage();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Det finns redan en lokal/plats-bokning som heter "' + $scope.locationBooking.Name +
                                '". Två lokal/plats-bokningar kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när lokal/plats-bokningen skulle sparas'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Lokal/plats-bokningen "' + $scope.locationBooking.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };

                            that.redirectToListPage();
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

            var locationBooking = LocationBooking.get(
                {
                    locationBookingId: $routeParams.locationBookingId
                }
            );

            // In case locationBookings cannot be fetched, display an error to user.
            locationBooking.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Lokal/plats-bokningen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.locationBooking = locationBooking;

        /* Initialization END */
    })

    // Delete Controller
    .controller('LocationBookingDeleteCtrl', function($scope, $routeParams, LocationBooking, $location, $rootScope){

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

                // Delete locationBooking
                LocationBooking.delete(
                    {
                        locationBookingId: $routeParams.locationBookingId
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response) {

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Lokal/plats-bokningen "' + $scope.locationBooking.Name + '" raderades med ett lyckat resultat'
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
                                message:    'Lokal/plats-bokningen kan inte raderas eftersom det finns' +
                                            ' någonting som refererar till lokal/plats-bokningen'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när lokal/plats-bokningen skulle tas bort'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Lokal/plats-bokningen "' + $scope.locationBooking.Name + '" existerar inte längre. Hann kanske någon radera den?'
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

            var locationBooking = LocationBooking.get(
                {
                    locationBookingId: $routeParams.locationBookingId
                }
            );

            // In case locationBookings cannot be fetched, display an error to user.
            locationBooking.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Lokal/plats-bokningen kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.locationBooking = locationBooking;

        /* Initialization END */
    });

})();