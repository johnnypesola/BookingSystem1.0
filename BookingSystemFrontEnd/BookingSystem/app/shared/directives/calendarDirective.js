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

        .directive('bookingCalendar', ['Booking', function(Booking) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'shared/directives/calendarDirective.html',
                scope: true,
                link: function(){

                },
                controller: function($scope, $element, $attrs) {

        /* Declare variables START */
                    var i, currentYear, currentMonth, currentMonthName, currentMonthDay, currentMonthDayName,
                        currentMonthNumberOfDays, currentMonthStartDateObj, currentMonthEndDateObj, currentMonthStartWeekDay,
                        currentMonthEndWeekDay, prevMonthNumberOfDays, currentMonthStartTime, currentMonthEndTime,
                        currentDateObj, selectedMonth, selectedDay,

                        calendarDaysArray = [],

                        monthNamesArray = ["Januari", "Februari", "Mars", "April", "Maj", "Juni",
                            "Juli", "Augusti", "September", "Oktober", "November", "December"],

                        dayNamesArray = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

        /* Declare variables END */

        /* Private methods START */

                    var initDateVariables = function (){

                        currentYear = currentDateObj.getFullYear();
                        currentMonth = currentDateObj.getMonth();
                        currentMonthName = monthNamesArray[currentMonth];
                        currentMonthDay = currentDateObj.getDate();
                        currentMonthDayName = dayNamesArray[currentMonthDay];
                        currentMonthNumberOfDays = new Date(currentYear, currentMonth + 1, 0).getDate();

                        currentMonthStartDateObj = new Date(currentYear, currentMonth, 1);
                        currentMonthEndDateObj = new Date(currentYear, currentMonth, currentMonthNumberOfDays);

                        currentMonthStartWeekDay = (currentMonthStartDateObj.getDay() === 0 ? 7 : currentMonthStartDateObj.getDay());
                        currentMonthEndWeekDay = (currentMonthEndDateObj.getDay() === 0 ? 7 : currentMonthEndDateObj.getDay());

                        prevMonthNumberOfDays = new Date(currentYear, currentMonth, 0).getDate();

                        currentMonthStartTime = currentMonthStartDateObj.getTime() / 1000;
                        currentMonthEndTime = currentMonthEndDateObj.getTime() / 1000;
                    };

                    var isToday = function(dayNumber) {
                        return (selectedMonth === currentMonth && selectedDay === dayNumber);
                    };

                    var prepareCalendarDays = function (){
                        calendarDaysArray = [];

                        // Add calendar days from previous month
                        for(i = 1; i < currentMonthStartWeekDay; i++) {
                            calendarDaysArray.push(
                                {
                                    number: prevMonthNumberOfDays-(currentMonthStartWeekDay-i-1),
                                    cssClassName: 'inactive'
                                }
                            );
                        }

                        // Add calendar days for current month
                        for(i = 1; i <= currentMonthNumberOfDays; i++) {
                            calendarDaysArray.push(
                                {
                                    number: i,
                                    cssClassName: ( isToday(i) ? 'active' : '')
                                }
                            );
                        }

                        // Add calendar days for next month
                        for(i = 1; i <= 7-currentMonthEndWeekDay; i++) {
                            calendarDaysArray.push(
                                {
                                    number: i,
                                    cssClassName: 'inactive'
                                }
                            );
                        }
                    };

                    // Make public variables accessible in template
                    var addVarsToScope = function () {

                        $scope.datedata = {
                            currentYear: currentYear,
                            currentMonth: currentMonth,
                            currentMonthName: currentMonthName,
                            currentDayName: currentMonthDayName,
                            currentMonthNumberOfDays: currentMonthNumberOfDays,
                            calendarDays: calendarDaysArray
                        };

                    };
        /* Private methods END */

        /* Public methods START */

                    $scope.changeToPreviousMonth = function(){
                        currentDateObj = new Date(currentYear, currentMonth - 1);

                        initDateVariables();
                        prepareCalendarDays();
                        addVarsToScope();
                    };

                    $scope.changeToNextMonth = function(){
                        currentDateObj = new Date(currentYear, currentMonth + 1);

                        initDateVariables();
                        prepareCalendarDays();
                        addVarsToScope();
                    };

                    $scope.changeToDay = function($element, $attrs, event){

                        var clickedDayElement = angular.element(event.target);

                        // Only apply click events to this months date
                        if(!clickedDayElement.hasClass('inactive')) {

                            // Change selected date variables
                            currentDateObj = new Date(currentYear, currentMonth, $attrs.number);
                            selectedMonth = currentDateObj.getMonth();
                            selectedDay = currentDateObj.getDate();

                            // Prevent url change
                            event.preventDefault();

                            // Change bound calendar model data
                            initDateVariables();
                            prepareCalendarDays();
                            addVarsToScope();

                            // Fetch data
                            $scope.datedata.bookings = Booking.queryPeriod({date: currentDateObj.getYearsMonthsDays()});
                        }
                    };

        /* Public methods END */


        /* Initialization START */

                    // Init date to now
                    currentDateObj = new Date();
                    selectedMonth = currentDateObj.getMonth();
                    selectedDay = currentDateObj.getDate();

                    initDateVariables();
                    prepareCalendarDays();
                    addVarsToScope();

        /* Initialization END */

                }
            };
        }])
        .directive('bookingCalendarChangeMonthButton', function() {
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
