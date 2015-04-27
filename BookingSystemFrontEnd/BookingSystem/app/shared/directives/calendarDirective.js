/**
 * Created by jopes on 2015-04-16.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.calendarDirective',

        // Dependencies
        [
            'bookingSystem.bookingServices'
        ])

    // Directive specific controllers START
        .controller('BookingCalendarCtrl', function($scope, $element, $attrs, Booking) {

        /* Declare variables START */
        var that = this;
        var i;

        /* Declare variables END */

        /* Object methods START */

        that.initDateVariables = function (){

            that.currentYear = that.currentDateObj.getFullYear();
            that.currentMonth = that.currentDateObj.getMonth();
            that.currentMonthName = that.currentDateObj.monthNamesArray[that.currentMonth];
            that.currentMonthDay = that.currentDateObj.getDate();
            that.currentMonthDayName = that.currentDateObj.dayNamesArray[that.currentMonthDay];
            that.currentMonthNumberOfDays = new Date(that.currentYear, that.currentMonth + 1, 0).getDate();

            that.currentMonthStartDateObj = new Date(that.currentYear, that.currentMonth, 1);
            that.currentMonthEndDateObj = new Date(that.currentYear, that.currentMonth, that.currentMonthNumberOfDays);

            that.currentMonthStartWeekDay = (that.currentMonthStartDateObj.getDay() === 0 ? 7 : that.currentMonthStartDateObj.getDay());
            that.currentMonthEndWeekDay = (that.currentMonthEndDateObj.getDay() === 0 ? 7 : that.currentMonthEndDateObj.getDay());

            that.prevMonthNumberOfDays = new Date(that.currentYear, that.currentMonth, 0).getDate();
        };

        // Check if specific day is today.
        that.isToday = function(dayNumber) {
            return (that.selectedMonth === that.currentMonth && that.selectedDay === dayNumber);
        };

        // Check if a specific day has bookings
        that.dayHasBookings = function(dayNumber) {

            // Loop through bookings for month
            return  that.bookingsForMonthArray.some(function(element){
                var _startDay = element.StartTime.getDate(),
                    _endDay = element.EndTime.getDate();

                // Check if days overlap
                return (
                _startDay == dayNumber || _endDay == dayNumber || // Days match
                _startDay < dayNumber && _endDay > dayNumber // Overlaps
                )
            });
        };

        that.prepareCalendarDays = function (){
            that.calendarDaysArray = [];

            // Add calendar days from previous month
            for(i = 1; i < that.currentMonthStartWeekDay; i++) {
                that.calendarDaysArray.push(
                    {
                        number: that.prevMonthNumberOfDays-(that.currentMonthStartWeekDay-i-1),
                        cssClassName: 'inactive'
                    }
                );
            }

            // Add calendar days for current month
            for(i = 1; i <= that.currentMonthNumberOfDays; i++) {
                that.calendarDaysArray.push(
                    {
                        number: i,
                        cssClassName: ( that.isToday(i) ? 'active' : ( that.dayHasBookings(i) ? 'has-events' : ''))
                    }
                );
            }

            // Add calendar days for next month
            for(i = 1; i <= 7-that.currentMonthEndWeekDay; i++) {
                that.calendarDaysArray.push(
                    {
                        number: i,
                        cssClassName: 'inactive'
                    }
                );
            }
        };

        that.getBookingsForMonth = function(callback) {
            var returnResource;

            // Get bookings
            that.bookingsForMonthArray = Booking.queryLessForPeriod(
                {
                    fromDate: that.currentMonthStartDateObj.BookingSystemGetYearsMonthsDays(),
                    toDate: that.currentMonthEndDateObj.BookingSystemGetYearsMonthsDays(),
                    type: 'all'
                }
            );

            // Convert date strings to date objects
            that.bookingsForMonthArray.$promise.then(function(bookings){

                // Execute callback
                callback();
            });
        };

        // Make public variables accessible in template
        that.addVarsToScope = function () {

            $scope.datedata = {
                currentYear: that.currentYear,
                currentMonth: that.currentMonth,
                currentMonthName: that.currentMonthName,
                currentDayName: that.currentMonthDayName,
                currentMonthNumberOfDays: that.currentMonthNumberOfDays,
                calendarDays: that.calendarDaysArray
            };

        };

        that.updateCalendarContent = function() {

            that.initDateVariables();

            that.getBookingsForMonth(function(){

                that.currentDateObj.convertDateStringsToDates(that.bookingsForMonthArray);

                that.prepareCalendarDays();
                that.addVarsToScope();
            });
        };

        /* Object methods END */

        /* Scope methods START */

        $scope.changeToPreviousMonth = function(){
            that.currentDateObj = new Date(that.currentYear, that.currentMonth - 1);

            that.updateCalendarContent();
        };

        $scope.changeToNextMonth = function(){
            that.currentDateObj = new Date(that.currentYear, that.currentMonth + 1);

            that.updateCalendarContent();
        };

        $scope.changeToDay = function($element, $attrs, event){

            var clickedDayElement = angular.element(event.target);

            // Only apply click events to this months date
            if(!clickedDayElement.hasClass('inactive')) {

                // Change selected date variables
                that.currentDateObj = new Date(that.currentYear, that.currentMonth, $attrs.number);
                that.selectedMonth = that.currentDateObj.getMonth();
                that.selectedDay = that.currentDateObj.getDate();

                // Prevent url change
                event.preventDefault();

                // Change bound calendar model data
                that.initDateVariables();
                that.prepareCalendarDays();
                that.addVarsToScope();

                // Fetch data
                $scope.datedata.bookings = Booking.queryDay({date: that.currentDateObj.BookingSystemGetYearsMonthsDays()});
            }
        };

        /* Scope methods END */


        /* Initialization START */

        // Init date to now
        that.currentDateObj = new Date();
        that.selectedMonth = that.currentDateObj.getMonth();
        that.selectedDay = that.currentDateObj.getDate();

        that.updateCalendarContent();

        /* Initialization END */

    })
    // Directive specific controllers END

    // Directives START
        .directive('bookingCalendar', ['Booking', function(Booking) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'shared/directives/calendarDirective.html',
                scope: true,
                link: function(){

                },
                controller: 'BookingCalendarCtrl'
            };
        }])
        .directive('changeMonthButton', function() {
            return {
                restrict: 'A',
                replace: false,
                scope: false,
                controller: function($scope, $element, $attrs) {

                    if($attrs.direction === 'next') {
                        $element.bind('click', function(){
                            $scope.changeToNextMonth();
                            $scope.$digest();
                        });
                    }
                    else if($attrs.direction === 'prev') {
                        $element.bind('click', function(){
                            $scope.changeToPreviousMonth();
                            $scope.$digest();
                        });
                    }
                }
            }
        })
        .directive('bookingCalendarDay', function() {
            return {
                restrict: 'A',
                replace: false,
                scope: false,
                controller: function($scope, $element, $attrs) {

                    $element.bind('click', function(event) {
                        $scope.changeToDay($element, $attrs, event);
                    });
                }
            }
        });
})();
