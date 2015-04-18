/**
 * Created by jopes on 2015-04-16.
 */

(function(){
    angular.module('booking.calendarDirective', [])
        .directive('bookingCalendar', function($http) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'shared/calendarTemplate.html',
                scope: true,
                link: function(){

                },
                controller: function($scope, $element, $attrs) {

                /* Declare variables START */
                    var i, currentYear, currentMonth, currentMonthName, currentMonthDay, currentMonthDayName,
                        currentMonthNumberOfDays, currentMonthStartDateObj, currentMonthEndDateObj, currentMonthStartWeekDay,
                        currentMonthEndWeekDay, prevMonthNumberOfDays, currentMonthStartTime, currentMonthEndTime, todayMonth,

                        calendarDaysArray = [],

                        monthNamesArray = ["Januari", "Februari", "Mars", "April", "Maj", "Juni",
                            "Juli", "Augusti", "September", "Oktober", "November", "December"],

                        dayNamesArray = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

                    // Init date to now
                    var currentDateObj = new Date();
                    var todayMonth = currentDateObj.getMonth();
                    var todayDay = currentDateObj.getDate();

                    /* Declare variables END */

                /* Private methods START */

                    var initVariables = function (){

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
                        return (todayMonth === currentMonth && todayDay === dayNumber);
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

                        initVariables();
                        prepareCalendarDays();
                        addVarsToScope();
                    };

                    $scope.changeToNextMonth = function(){
                        currentDateObj = new Date(currentYear, currentMonth + 1);

                        initVariables();
                        prepareCalendarDays();
                        addVarsToScope();
                    };
                /* Public methods END */


                /* Initialization START */

                    initVariables();
                    prepareCalendarDays();
                    addVarsToScope();

                /* Initialization END */
                }
            };
        })
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
                scope: false,
                controller: function($scope, $element, $attrs) {

                    $element.bind('click', function() {
                        console.log($attrs.number);
                    });
                }
            }
        });
})();
