/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.booking',

        // Load Dependencies
        [
            'bookingSystem.bookingServices',
            'bookingSystem.commonFilters',
            'bookingSystem.calendarDirective',
            'bookingSystem.customerServices'
        ]
    )

    // Routes for startPage
    .config(["$routeProvider", function($routeProvider) {

    }])

    // Controller

    .controller('BookingShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Booking", function($scope, $routeParams, $location, $rootScope, Booking){

        var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

        /* Public methods END */

        /* Initialization START */

            var booking = Booking.get(
                {
                    bookingId: $routeParams.bookingId
                }
            );

            // Success
            booking.$promise.then(function(){

                $scope.noLocationBookingsFound = !booking.LocationBookings.length;
            });

            // In case bookings cannot be fetched, display an error to user.
            booking.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Bokningstillfället kunde inte hämtas, var god försök igen.'
                };

                $scope.booking = null;
            });

            $scope.booking = booking;

        /* Initialization END */
    }])

    .controller('BookingDeleteCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Booking", "Redirect", function($scope, $routeParams, $location, $rootScope, Booking, Redirect){

        var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

            // Confirm deletion
            $scope.confirm = function(){

                // Delete locationBooking
                Booking.delete(
                    {
                        bookingId: $routeParams.bookingId
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response) {

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Bokningstillfället och dess underliggande Lokal/plats-bokningar raderades med ett lyckat resultat'
                        };

                        Redirect.to('lista');

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
                                message:    'Bokningstillfället kan inte raderas eftersom det finns' +
                                ' någonting som refererar till bokningstillfället'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när bokningstillfället skulle tas bort'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Bokningstillfället existerar inte längre. Hann kanske någon radera den?'
                            };
                        }

                        history.back();
                    });
            };


        /* Public methods END */

        /* Initialization START */

            var booking = Booking.get(
                {
                    bookingId: $routeParams.bookingId
                }
            );

            // In case bookings cannot be fetched, display an error to user.
            booking.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Bokningstillfället kunde inte hämtas, var god försök igen.'
                };

                $scope.booking = null;
            });

            $scope.booking = booking;

        /* Initialization END */
    }])

    .controller('BookingListCtrl', ["$scope", "Booking", "$rootScope", "$location", function($scope, Booking, $rootScope, $location){
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
            that.getBookings = function(){

                // Store bookings in private variable
                that.bookings = Booking.queryMoreForPeriod(
                    {
                        fromDate: moment(that.currentMonthStartDateObj).format('YYYY-MM-DD'),
                        toDate: moment(that.currentMonthEndDateObj).format('YYYY-MM-DD')
                    }
                );

                // Success
                that.bookings.$promise.then(function(){

                    $scope.noItemsFound = !that.bookings.length;

                });

                // In case bookings cannot be fetched, display an error to user.
                that.bookings.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Bokningarna kunde inte hämtas, var god försök igen.'
                    };
                });

                // Display bookings to user
                $scope.bookings = that.bookings;
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
                that.getBookings();
                that.addVarsToScope();
            };

            $scope.changeToNextMonth = function(){

                $location.search('ar', that.currentYear);
                $location.search('manad', that.currentMonth + 1);

                that.initDateVariables();
                that.getBookings();
                that.addVarsToScope();
            };

        /* Public methods END */

        /* Initialization START */

                that.initDateVariables();
                that.getBookings();
                that.addVarsToScope();

        /* Initialization END */
    }])

    .controller('BookingCreateCtrl', ["$scope", "Booking", "$rootScope", "Customer", "BookingType", "Redirect", function($scope, Booking, $rootScope, Customer, BookingType, Redirect){
        var that = this;

        /* Private methods START */

            that.getOtherDisplayData = function (){
                // Get customers
                $scope.customers = Customer.query();

                // After customers have been fetched
                $scope.customers.$promise.then(function(){

                    // Get booking types
                    $scope.bookingTypes = BookingType.query();

                    $scope.bookingTypes.$promise.catch(function(){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Bokningstyper kunde inte hämtas.'
                        };
                    });
                });

                // In case locations furniturings cannot be fetched, display an error to user.
                $scope.customers.$promise.catch(function(){
                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Kunder kunde inte hämtas.'
                    };
                });
            };

        /* Private methods END */

        /* Public methods START */

            // Save booking
            $scope.save = function(){

                // Save booking
                Booking.save(
                    {
                        BookingId: 0,
                        Name: $scope.booking.Name,
                        BookingTypeId: $scope.booking.BookingTypeId,
                        CustomerId: $scope.booking.CustomerId,
                        Provisional: !!parseInt($scope.booking.Provisional,10),
                        NumberOfPeople: $scope.booking.NumberOfPeople,
                        Discount: $scope.booking.Discount,
                        Notes: $scope.booking.Notes,
                        CreatedByUserId: 1, //Temporary value, users not implemented
                        ModifiedByUserId: 1, //Temporary value, users not implemented
                        ResponsibleUserId: 1 //Temporary value, users not implemented
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){


                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Bokningstillfället skapades med ett lyckat resultat'
                        };

                        // Redirect to show booking view
                        Redirect.to('visa/', response.BookingId);

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
            };

        /* Public methods END */

        /* Initialization START */

            // Get bookingtypes and customers
            that.getOtherDisplayData();

        /* Initialization END */


    }])

    .controller('BookingEditCtrl', ["$scope", "Booking", "$rootScope", "Customer", "BookingType", "$q", "$routeParams", function($scope, Booking, $rootScope, Customer, BookingType, $q, $routeParams){
        var that = this;

        /* Private methods START */

            that.getBooking = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                $scope.booking = Booking.get(
                    {
                        bookingId: $routeParams.bookingId
                    }
                );

                // Location booking was fetches successfully
                $scope.booking.$promise.then(function(){

                    // Resolve promise
                    deferred.resolve();
                });

                // In case locationBookings cannot be fetched, display an error to user.
                $scope.booking.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Bokningstillfället kunde inte hämtas, var god försök igen.'
                    };

                    $scope.booking = null;
                });

                return promise;
            };

            that.getOtherDisplayData = function (){
                // Get customers
                $scope.customers = Customer.query();

                // After customers have been fetched
                $scope.customers.$promise.then(function(){

                    // Get booking types
                    $scope.bookingTypes = BookingType.query();

                    $scope.bookingTypes.$promise.catch(function(){
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Bokningstyper kunde inte hämtas.'
                        };
                    });
                });

                // In case locations furniturings cannot be fetched, display an error to user.
                $scope.customers.$promise.catch(function(){
                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Kunder kunde inte hämtas.'
                    };
                });
            };

        /* Private methods END */

        /* Public methods START */

            // Save booking
            $scope.save = function(){

                // Save booking
                Booking.save(
                    {
                        BookingId: $scope.booking.BookingId,
                        Name: $scope.booking.Name,
                        BookingTypeId: $scope.booking.BookingTypeId,
                        CustomerId: $scope.booking.CustomerId,
                        Provisional: !!parseInt($scope.booking.Provisional,10),
                        NumberOfPeople: $scope.booking.NumberOfPeople,
                        Discount: $scope.booking.Discount,
                        Notes: $scope.booking.Notes,
                        CreatedByUserId: 1, //Temporary value, users not implemented
                        ModifiedByUserId: 1, //Temporary value, users not implemented
                        ResponsibleUserId: 1 //Temporary value, users not implemented
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){


                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Bokningstillfället sparades med ett lyckat resultat'
                        };

                        history.back();

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

                        // If the entry was not found
                        else if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Bokningstillfället "' + $scope.booking.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };

                            history.back();
                        }

                        // If there was a unknown problem
                        else {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när bokningstillfället skulle sparas'
                            };
                        }
                    });
            };

        /* Initialization START */

            // Get booking
            that.getBooking().then(function(){

                // Get bookingtypes and customers
                that.getOtherDisplayData();

            });

        /* Initialization END */


    }])

    .controller('BookingSearchCtrl', ["$scope", "Booking", "$rootScope", function($scope, Booking, $rootScope){
        var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

            $scope.search = function(){

                $scope.searchResults = Booking.querySearch(
                    {
                        column: $scope.searchColumn,
                        value: $scope.searchValue
                    }
                );

                $scope.searchResults.$promise

                    .then(function(){
                        $scope.noSearchResultsFound = !$scope.searchResults.length;
                    })

                    .catch(function(response) {
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Ett oväntat fel uppstod när sökresultaten hämtades. Var god försök igen.'
                        };
                    })
            };

        /* Initialization START */

            $scope.searchColumn = "Name";

        /* Initialization END */

    }])

    .controller('BookingListEmptyCtrl', ["$scope", "Booking", "$rootScope", "$location", function($scope, Booking, $rootScope, $location){
        var that = this;
        var currentDateObj;

        /* Private methods START */

        // Get bookings
        that.getBookings = function(){

            // Store bookings in private variable
            that.bookings = Booking.queryEmpty();

            // Success
            that.bookings.$promise.then(function(){

                $scope.noItemsFound = !that.bookings.length;
            });

            // In case bookings cannot be fetched, display an error to user.
            that.bookings.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Bokningarna kunde inte hämtas, var god försök igen.'
                };
            });

            // Display bookings to user
            $scope.bookings = that.bookings;
        };

        /* Private methods END */

        /* Public methods START */

        /* Public methods END */

        /* Initialization START */

        that.getBookings();

        /* Initialization END */
    }])
})();