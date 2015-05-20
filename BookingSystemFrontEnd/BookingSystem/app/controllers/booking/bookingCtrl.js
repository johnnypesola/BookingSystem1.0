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
                that.currentMonthName = currentDateObj.monthNamesArray[that.currentMonth];
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
                        toDate: that.currentMonthEndDateObj.BookingSystemGetYearsMonthsDays(),
                        type: 'all'
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

    .controller('BookingCreateCtrl', function($scope, Booking, $rootScope, Customer, $location){
        var that = this;
        var currentDateObj;
            $scope.discountRange = [];

            // Init discount range
            for(i = 0; i <= 100; i++){
                $scope.discountRange.push(i);
            }
        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

            that.initDateVariables = function () {
                that.currentYear = currentDateObj.getFullYear();
                that.currentMonth = currentDateObj.getMonth();
                that.currentMonthName = currentDateObj.monthNamesArray[that.currentMonth];
                that.currentMonthNumberOfDays = new Date(that.currentYear, that.currentMonth + 1, 0).getDate();

                that.currentMonthStartDateObj = new Date(that.currentYear, that.currentMonth, 1);
                that.currentMonthEndDateObj = new Date(that.currentYear, that.currentMonth, that.currentMonthNumberOfDays);
            };

        /* Private methods END */

        /* Public methods START */

            $scope.abort = function(){
                that.redirectToListPage();
            };

        /* Initialization START */

            // Get customers
            $scope.customers = Customer.query();

            // In case locations furniturings cannot be fetched, display an error to user.
            $scope.customers.$promise.catch(function(){
                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Kunder kunde inte hämtas.'
                };
            });

            // Init date to now
            currentDateObj = new Date();

            that.initDateVariables();

        /* Initialization END */


    });
})();