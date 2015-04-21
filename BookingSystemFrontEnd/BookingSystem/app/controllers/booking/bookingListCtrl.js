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
    .controller('BookingCtrl', function($scope, Booking){


            var currentYear, currentMonth, currentMonthName, currentMonthDay, currentMonthDayName,
                currentMonthNumberOfDays, currentMonthStartDateObj, currentMonthEndDateObj, currentMonthStartWeekDay,
                currentMonthEndWeekDay, prevMonthNumberOfDays, currentMonthStartTime, currentMonthEndTime, currentDateObj;

        /* Private methods START */

            var initDateVariables = function () {
                currentYear = currentDateObj.getFullYear();
                currentMonth = currentDateObj.getMonth();
                currentMonthName = currentDateObj.monthNamesArray[currentMonth];
                currentMonthDayName = currentDateObj.dayNamesArray[currentMonthDay];
                currentMonthNumberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();

                currentMonthStartDateObj = new Date(currentYear, currentMonth, 1);
                currentMonthEndDateObj = new Date(currentYear, currentMonth, currentMonthNumberOfDays);
            };

            // Get bookings
            var getBookings = function(){
                $scope.bookings = Booking.queryMoreForPeriod(
                    {
                        fromDate: currentMonthStartDateObj.BookingSystemGetYearsMonthsDays(),
                        toDate: currentMonthEndDateObj.BookingSystemGetYearsMonthsDays(),
                        type: 'all'
                    }
                );
            };

            // Make public variables accessible in template
            var addVarsToScope = function () {

                $scope.currentYear = currentYear;
                $scope.currentMonthName = currentMonthName;
            };

        /* Private methods END */



            /* Public methods START */
            $scope.changeToPreviousMonth = function(){
                currentDateObj = new Date(currentYear, currentMonth - 1);

                initDateVariables();
                getBookings();
                addVarsToScope();
            };

            $scope.changeToNextMonth = function(){
                currentDateObj = new Date(currentYear, currentMonth + 1);

                initDateVariables();
                getBookings();
                addVarsToScope();
            };


            /* Initialization START */

            // Init date to now
            currentDateObj = new Date();

            initDateVariables();
            getBookings();
            addVarsToScope();

            /* Initialization END */
    });

})();