/**
 * Created by jopes on 2015-04-15.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.booking',

        // Load Dependencies
        [
            'bookingSystem.bookingServices',
            'bookingSystem.customFilters',
            'bookingSystem.calendarDirective'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Controller
    .controller('BookingCtrl', function($scope, Booking, $rootScope){
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

                // Store bookigns in private variable
                var bookings = Booking.queryMoreForPeriod(
                    {
                        fromDate: that.currentMonthStartDateObj.BookingSystemGetYearsMonthsDays(),
                        toDate: that.currentMonthEndDateObj.BookingSystemGetYearsMonthsDays(),
                        type: 'all'
                    });

                // In case bookings cannot be fetched, display an error to user.
                bookings.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Bokningarna kunde inte hämtas, var god försök igen.'
                    };
                });

                // Display bookings to user
                $scope.bookings = bookings;
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
    });
})();