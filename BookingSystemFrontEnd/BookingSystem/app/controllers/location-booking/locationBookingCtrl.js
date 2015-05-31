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
    .config(["$routeProvider", function($routeProvider) {

    }])

    // Show Controller
    .controller('LocationBookingShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "LocationBooking", "API_IMG_PATH_URL", "PHOTO_MISSING_SRC", function($scope, $routeParams, $location, $rootScope, LocationBooking, API_IMG_PATH_URL, PHOTO_MISSING_SRC){

        var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

        /* Public methods END */


        /* Initialization START */

        var locationBooking = LocationBooking.get(
            {
                locationBookingId: $routeParams.locationBookingId
            }
        );

        locationBooking.$promise.then(function(){

            // Add path to LocationImageSrc
            locationBooking.LocationImageSrc = (locationBooking.LocationImageSrc === "" ? PHOTO_MISSING_SRC : API_IMG_PATH_URL + locationBooking.LocationImageSrc);
        });

        // In case locationBookings cannot be fetched, display an error to user.
        locationBooking.$promise.catch(function(){

            $rootScope.FlashMessage = {
                type: 'error',
                message: 'Lokal/Plats-bokningen kunde inte hämtas, var god försök igen.'
            };

            $scope.locationBooking = null;
        });

        $scope.locationBooking = locationBooking;

        /* Initialization END */
    }])

    // List Controller
    .controller('LocationBookingListCtrl', ["$scope", "LocationBooking", "$rootScope", "$location", function($scope, LocationBooking, $rootScope, $location){
            var that = this;
            var currentDateObj;

            /* Private methods START */

            that.initDateVariables = function () {

                // Get date strings from url params
                var yearParam = $location.search().ar;
                var monthParam = $location.search().manad;

                // Convert url params to current date object, with fallback.
                if(typeof yearParam !== 'undefined' && typeof monthParam !== 'undefined') {
                    currentDateObj = moment(yearParam + "-" + $BookSysUtil.String.addLeadingZero(+monthParam + 1) + "-01").toDate();
                }
                else {
                    currentDateObj = new Date();
                }

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
                        fromDate: moment(that.currentMonthStartDateObj).format('YYYY-MM-DD'),
                        toDate: moment(that.currentMonthEndDateObj).format('YYYY-MM-DD')
                    });

                // Success
                that.locationBookings.$promise.then(function(){
                    $scope.noItemsFound = !that.locationBookings.length;
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

                // Year overlap adjustment code
                if(that.currentMonth == 0) {
                    that.currentMonth = 11;
                    that.currentYear -= 1;
                }
                else {
                    that.currentMonth -= 1;
                }

                $location.search('ar', that.currentYear);
                $location.search('manad', that.currentMonth);

                that.initDateVariables();
                that.getLocationBookings();
                that.addVarsToScope();
            };

            $scope.changeToNextMonth = function(){

                $location.search('ar', that.currentYear);
                $location.search('manad', that.currentMonth + 1);

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
    }])

    // Create Controller
    .controller('LocationBookingCreateCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "LocationBooking", "LocationFurnituring", "Location", "BookingType", "Customer", "Booking", "$q", function($scope, $routeParams, $location, $rootScope, LocationBooking, LocationFurnituring, Location, BookingType, Customer, Booking, $q) {

            var that = this;
                $scope.furniturings = [];
                $scope.locationBooking = {};

        /* Private methods START */

            that.getLocations = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                // Get locations
                $scope.locations = Location.query();

                // Success
                $scope.locations.$promise.then(function(){

                    // Resolve promise
                    deferred.resolve();
                });

                $scope.locations.$promise.catch(function(){
                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Lokaler kunde inte hämtas.'
                    };
                });

                // Return promise
                return promise;
            };

            that.getBookingTypes = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                // Get booking types
                $scope.bookingTypes = BookingType.query();

                // Success
                $scope.bookingTypes.$promise.then(function(){
                    // Resolve promise
                    deferred.resolve();
                });

                // Could not fetch booking types
                $scope.bookingTypes.$promise.catch(function(){
                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Bokningstyper kunde inte hämtas.'
                    };

                    // Reject promise
                    deferred.reject();
                });

                // Return promise
                return promise;
            };

            that.getCustomers = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                // Get customers
                $scope.customers = Customer.query();

                // Success
                $scope.customers.$promise.then(function(){

                    // Resolve promise
                    deferred.resolve();
                });

                // In case customers cannot be fetched, display an error to user.
                $scope.customers.$promise.catch(function(){
                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Kunder kunde inte hämtas.'
                    };

                    // Reject promise
                    deferred.reject();
                });

                return promise;
            };

            that.getOtherDisplayData = function (){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                that.getBookingTypes()

                    // If booking types were fetched
                    .then(function(){

                        that.getCustomers()

                            // If customers were fetched
                            .then(function(){

                                that.getLocations()

                                    // If locations were fetched
                                    .then(function(){

                                        // Resolve promise
                                        deferred.resolve();
                                    });
                            })
                    });

                return promise;
            };

            // Save booking
            that.saveBooking = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                // Only save booking if needed.
                if($scope.bookingId == 0){

                    // Save booking
                    promise = Booking.save(
                        {
                            BookingId: 0,
                            Name: $scope.booking.Name,
                            BookingTypeId: $scope.booking.BookingTypeId,
                            CustomerId: $scope.booking.CustomerId,
                            Provisional: !!parseInt($scope.booking.Provisional,10),
                            NumberOfPeople: $scope.locationBooking.NumberOfPeople,
                            Discount: 0,
                            CreatedByUserId: 1, //Temporary value, users not implemented
                            ModifiedByUserId: 1, //Temporary value, users not implemented
                            ResponsibleUserId: 1 //Temporary value, users not implemented
                        }
                    ).$promise

                        // If everything went ok
                        .then(function(createdBooking){

                            // Make created booking accessable from other metods
                            $scope.bookingId = createdBooking.BookingId;

                            $rootScope.FlashMessage = {
                                type: 'success',
                                message: 'Bokningstillfället "' + $scope.booking.Name + '" skapades med ett lyckat resultat'
                            };

                            // Resolve promise
                            deferred.resolve();

                            // Something went wrong
                        }).catch(function(response) {

                            // If there there was a foreign key reference
                            if (response.status == 409){
                                $rootScope.FlashMessage = {
                                    type: 'error',
                                    message: 'Det finns redan ett bokningstillfälle som heter "' + $scope.booking.Name +
                                    '". Två bokningstillfällen kan inte heta lika.'
                                };
                            }

                            // If there was a problem with the in-data
                            else {
                                $rootScope.FlashMessage = {
                                    type: 'error',
                                    message: 'Ett oväntat fel uppstod när bokningstillfället skulle sparas'
                                };
                            }
                        });

                } else {

                    // Bookings does not need to be saved. Resolve promise
                    deferred.resolve();
                }

                // Return promise
                return promise;

            };

            // Save locationBooking
            that.saveLocationBooking = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                // Save locationBooking
                LocationBooking.save(
                    {
                        BookingId: $scope.bookingId,
                        LocationBookingId: 0,
                        LocationId: $scope.locationBooking.LocationId,
                        FurnituringId: $scope.locationBooking.SelectedFurnituring.FurnituringId,
                        StartTime: moment($scope.StartDate + " " + $scope.StartTime).format(),
                        EndTime: moment($scope.EndDate + " " + $scope.EndTime).format(),
                        NumberOfPeople: $scope.locationBooking.NumberOfPeople
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Lokal/plats-bokningen skapades med ett lyckat resultat'
                        };

                        // Resolve promise
                        deferred.resolve();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Lokalen är tyvärr redan bokad under vald tidsram.'
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

                return promise;
            };

            that.getLocationsBookingInfo = function(){

                // Check that all dates variables are defined
                if(
                    typeof $scope.StartDate !== 'undefined' &&
                    typeof $scope.StartTime !== 'undefined' &&
                    typeof $scope.EndDate !== 'undefined' &&
                    typeof $scope.EndTime !== 'undefined'
                ){

                    Location.queryFreeForPeriod(
                        {
                            fromDate: $scope.StartDate,
                            fromTime: $scope.StartTime,
                            toDate: $scope.EndDate,
                            toTime: $scope.EndTime
                        }
                    ).$promise

                        // Success
                        .then(function(response) {

                            // Add free locations to scop.e
                            $scope.freeLocations = response;

                            // Replace selectable locations with free locations
                            $scope.locations = response
                        })

                        // Could not get free locations
                        .catch(function(response) {

                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när uppgifter om lediga lokaler skulle hämtas'
                            };
                        });
                }
            };

            that.addDateWatches = function(){

                $scope.$watch('StartDate', function(newValue, oldValue){
                    that.getLocationsBookingInfo();
                }, true); //enable deep dirty checking
                $scope.$watch('StartTime', function(newValue, oldValue){
                    that.getLocationsBookingInfo();
                }, true); //enable deep dirty checking
                $scope.$watch('EndDate', function(newValue, oldValue){
                    that.getLocationsBookingInfo();
                }, true); //enable deep dirty checking
                $scope.$watch('EndTime', function(newValue, oldValue){
                    that.getLocationsBookingInfo();
                }, true); //enable deep dirty checking
            };

        /* Private methods END */

        /* Public methods START */

            // Save booking and location booking
            $scope.save = function(){

                that.saveBooking()

                // If booking was saved
                .then(function(){

                        that.saveLocationBooking()

                            // If location booking was saved
                            .then(function(){

                                history.back();

                            });
                    })
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

            // Get other data used in form
            that.getOtherDisplayData();

            // Get booking id from route params
            $scope.bookingId = $routeParams.bookingId || 0;

            // Get location id from route params
            $scope.locationBooking.LocationId = +$location.search()['lokal-id'];



            // Add watches to all Date and Time input fields

            that.addDateWatches();

        /* Initialization END */
    }])

    // Edit Controller
    .controller('LocationBookingEditCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "LocationBooking", "LocationFurnituring", "Location", "$q", function($scope, $routeParams, $location, $rootScope, LocationBooking, LocationFurnituring, Location, $q){

            var that = this;

        /* Private methods START */

            that.initLocationBooking = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                $scope.locationBooking = LocationBooking.get(
                    {
                        locationBookingId: $routeParams.locationBookingId
                    }
                );

                // Location booking was fetches successfully
                $scope.locationBooking.$promise.then(function(){

                    // Parse date variables
                    $scope.StartDate = moment($scope.locationBooking.StartTime).format('YYYY-MM-DD');
                    $scope.StartTime = moment($scope.locationBooking.StartTime).format('HH:mm');
                    $scope.EndDate = moment($scope.locationBooking.EndTime).format('YYYY-MM-DD');
                    $scope.EndTime = moment($scope.locationBooking.EndTime).format('HH:mm');

                    // Resolve promise
                    deferred.resolve();
                });

                // In case locationBookings cannot be fetched, display an error to user.
                $scope.locationBooking.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Lokal/plats-bokningen kunde inte hämtas, var god försök igen.'
                    };

                    $scope.locationBooking = null;
                });

                return promise;
            };

            that.getLocations = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                // Get locations
                $scope.locations = Location.query();

                // Success
                $scope.locations.$promise.then(function(){
                    // Resolve promise
                    deferred.resolve();
                });

                $scope.locations.$promise.catch(function(){
                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Lokaler kunde inte hämtas.'
                    };
                });

                // Return promise
                return promise;
            };

        /* Private methods END */

        /* Public methods START */

            // Save locationBooking
            $scope.save = function(){

                // Save locationBooking
                LocationBooking.save(
                    {
                        BookingId: $scope.locationBooking.BookingId,
                        LocationBookingId: $routeParams.locationBookingId,
                        LocationId: $scope.locationBooking.LocationId,
                        FurnituringId: $scope.locationBooking.SelectedFurnituring.FurnituringId,
                        StartTime: moment($scope.StartDate + " " + $scope.StartTime).format(),
                        EndTime: moment($scope.EndDate + " " + $scope.EndTime).format(),
                        NumberOfPeople: $scope.locationBooking.NumberOfPeople
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Lokal/plats-bokningen sparades med ett lyckat resultat'
                        };

                        history.back();

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Det finns redan en annan lokal/plats-bokning som krockar med den här bokningen.'
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
                                message: 'Lokal/plats-bokningen existerar inte längre. Hann kanske någon radera den?'
                            };

                            history.back();
                        }
                    });
            };

            $scope.updateFurniturings = function() {

                var i;

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

                            // Show message in view if needed.
                            $scope.showInfoAboutNoFurniturings = !$scope.furniturings.length;

                            // Select correct furnituring which is defined in location booking.
                            for(i = 0; i < $scope.furniturings.length; i++){
                                if($scope.locationBooking.FurnituringId == $scope.furniturings[i].FurnituringId){
                                    $scope.locationBooking.SelectedFurnituring =  $scope.furniturings[i];
                                }
                            }
                        });
                }
                else {
                    $scope.furnituring = [];
                }
            };

        /* Public methods END */


        /* Initialization START */

            that.initLocationBooking().then(function(){

                that.getLocations().then(function(){

                    $scope.updateFurniturings();
                });
            });


        /* Initialization END */
    }])

    // Delete Controller
    .controller('LocationBookingDeleteCtrl', ["$scope", "$routeParams", "LocationBooking", "$location", "$rootScope", "PHOTO_MISSING_SRC", "API_IMG_PATH_URL", function($scope, $routeParams, LocationBooking, $location, $rootScope, PHOTO_MISSING_SRC, API_IMG_PATH_URL){

            var that = this;

        /* Private methods START */

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
                            message: 'Lokal/plats-bokningen raderades med ett lyckat resultat'
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
                                message: 'Lokal/plats-bokningen existerar inte längre. Hann kanske någon radera den?'
                            };
                        }

                        history.back();
                });
            };

        /* Public methods END */

        /* Initialization START */

            var locationBooking = LocationBooking.get(
                {
                    locationBookingId: $routeParams.locationBookingId
                }
            );

            locationBooking.$promise.then(function(){

                // Add path to LocationImageSrc
                locationBooking.LocationImageSrc = (locationBooking.LocationImageSrc === "" ? PHOTO_MISSING_SRC : API_IMG_PATH_URL + locationBooking.LocationImageSrc);
            });


            // In case locationBookings cannot be fetched, display an error to user.
            locationBooking.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Lokal/plats-bokningen kunde inte hämtas, var god försök igen.'
                };

                $scope.locationBooking = null;
            });

            $scope.locationBooking = locationBooking;

        /* Initialization END */
    }]);

})();