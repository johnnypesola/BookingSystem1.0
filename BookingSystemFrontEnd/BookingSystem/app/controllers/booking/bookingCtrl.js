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
    .config(function($routeProvider) {

    })

    // Controller
    .controller('BookingListCtrl', function($scope, Booking, $rootScope){
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
            that.getBookings = function(){

                // Store bookings in private variable
                that.bookings = Booking.queryMoreForPeriod(
                    {
                        fromDate: that.currentMonthStartDateObj.BookingSystemGetYearsMonthsDays(),
                        toDate: that.currentMonthEndDateObj.BookingSystemGetYearsMonthsDays()
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
                currentDateObj = new Date(that.currentYear, that.currentMonth - 1);

                that.initDateVariables();
                that.getBookings();
                that.addVarsToScope();
            };

            $scope.changeToNextMonth = function(){
                currentDateObj = new Date(that.currentYear, that.currentMonth + 1);

                that.initDateVariables();
                that.getBookings();
                that.addVarsToScope();
            };


            /* Initialization START */

            // Init date to now
            currentDateObj = new Date();

            that.initDateVariables();
            that.getBookings();
            that.addVarsToScope();

            /* Initialization END */
    })

    .controller('BookingCreateCtrl', function($scope, Booking, $rootScope, Customer, BookingType, $location){
        var that = this;
        var currentDateObj;

        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
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

            $scope.abort = function(){
                that.redirectToListPage();
            };

            // Save bookingType
            $scope.save = function(){

                // Save bookingType
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
                            message: 'Bokningstillfället "' + $scope.booking.Name + '" skapades med ett lyckat resultat'
                        };

                        that.redirectToListPage();

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

        /* Initialization START */

            // Get bookingtypes and customers
            that.getOtherDisplayData();


        /* Initialization END */


    });
})();