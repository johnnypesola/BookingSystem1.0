/**
 * Created by jopes on 2015-04-16.
 */
(function(){
    angular.module('booking.calendarDirective', [])
        .controller('CalendarCtrl', ['$scope', function($scope) {

        // Init variables
            var i, currentYear, currentMonth, currentMonthName, currentMonthDay, currentMonthDayName,
                currentMonthNumberOfDays, currentMonthStartDateObj, currentMonthEndDateObj, currentMonthStartWeekDay,
                currentMonthEndWeekDay, prevMonthNumberOfDays, currentMonthStartTime, currentMonthEndTime,

                calendarDaysArray = [],

                monthNamesArray = ["Januari", "Februari", "Mars", "April", "Maj", "Juni",
                    "Juli", "Augusti", "September", "Oktober", "November", "December"],

                dayNamesArray = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

            // Init date to now
            var currentDateObj = new Date();

        // Private methods
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

            var prepareCalendarDays = function (){
                calendarDaysArray = [];

                // Add calendar days from previous month
                for(i = 1; i < currentMonthStartWeekDay; i++) {
                    calendarDaysArray.push(
                        {
                            num: prevMonthNumberOfDays-(currentMonthStartWeekDay-i-1),
                            inactive: true
                        }
                    );
                }

                // Add calendar days for current month
                for(i = 1; i <= currentMonthNumberOfDays; i++) {
                    calendarDaysArray.push(
                        {
                            num: i,
                            inactive: false
                        }
                    );
                }

                // Add calendar days for next month
                for(i = 1; i <= 7-currentMonthEndWeekDay; i++) {
                    calendarDaysArray.push(
                        {
                            num: i,
                            inactive: true
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

        // Process data
            initVariables();
            prepareCalendarDays();
            addVarsToScope();

        // Public methods for template
            $scope.changeToPreviousMonth = function(){
                currentDateObj = new Date(currentYear, currentMonth - 1);

                initVariables();
                prepareCalendarDays();
                addVarsToScope();

                console.log(currentMonthStartDateObj.getDay());
                console.log(currentMonthStartWeekDay);
            };

            $scope.changeToNextMonth = function(){
                currentDateObj = new Date(currentYear, currentMonth + 1);
                initVariables();
                prepareCalendarDays();
                addVarsToScope();
            }
        }])
        .directive('bookingCalendar', function() {
            return {
                restrict: 'E',
                templateUrl: 'shared/calendarTemplate.html'
            };
        });
})();
