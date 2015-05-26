/**
 * Created by jopes on 2015-04-16.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.calendarDirective',

        // Dependencies
        [
            'bookingSystem.bookingServices',
            'bookingSystem.locationBookingServices',
            'bookingSystem.resourceBookingServices'
        ])

        // Directive specific controllers START
        .controller('BookingCalendarInternalCtrl', function($scope, $element, $attrs, Booking, LocationBooking, ResourceBooking, $rootScope) {

            /* Declare variables START */
            var that = this,
                i;
            that.bookingType = $attrs.bookingType;

            /* Declare variables END */

            /* Object methods START */

            that.declareBookingTypeService = function(){

                // Find out what type of data to get
                if(that.bookingType == "booking"){
                    that.bookingTypeService = Booking;
                }
                else if(that.bookingType == "location-booking"){
                    that.bookingTypeService = LocationBooking;
                }
                else if(that.bookingType == "resource-booking"){
                    that.bookingTypeService = ResourceBooking;
                }
            };

            that.initDateVariables = function (){

                that.currentYear = that.currentDateObj.getFullYear();
                that.currentMonth = that.currentDateObj.getMonth();
                that.currentMonthName = moment(that.currentDateObj).format('MMMM');
                that.currentMonthDay = that.currentDateObj.getDate();
                that.currentMonthDayName = moment(that.currentDateObj).format('dddd');
                that.currentMonthNumberOfDays = moment(that.currentDateObj).daysInMonth();

                that.currentMonthStartDateObj = new Date(that.currentYear, that.currentMonth, 1);
                that.currentMonthEndDateObj = new Date(that.currentYear, that.currentMonth, that.currentMonthNumberOfDays);

                that.currentMonthStartWeekDay = (that.currentMonthStartDateObj.getDay() === 0 ? 7 : that.currentMonthStartDateObj.getDay());
                that.currentMonthEndWeekDay = (that.currentMonthEndDateObj.getDay() === 0 ? 7 : that.currentMonthEndDateObj.getDay());

                that.prevMonthNumberOfDays = new Date(that.currentYear, that.currentMonth, 0).getDate();

                $scope.dateHeaderString = moment(that.currentDateObj).format('dddd, Do MMMM YYYY');
            };

            // Check if specific day is today.
            that.isToday = function(dayNumber) {
                return (that.selectedMonth === that.currentMonth && that.selectedDay === dayNumber);
            };

            // Check if a specific day has bookings
            that.dayHasBookings = function(dayNumber) {

                if(typeof dayNumber !== 'undefined') {

                    var monthNumber;

                    // Add leading zero if needed
                    dayNumber = ("0" + dayNumber).slice(-2);
                    monthNumber = ("0" + (that.currentMonth + 1)).slice(-2);

                    // Generate start of day date and end of day date objects.
                    var startOfDay = moment(that.currentYear + "-" + monthNumber + "-" + dayNumber + " 00:00").toDate();
                    var endOfDay = moment(that.currentYear + "-" + monthNumber + "-" + dayNumber + " 23:59").toDate();

                    // Loop through bookings for month
                    return that.bookingsForMonthArray.some(function (element) {

                        // Check if days overlap
                        return (
                        element.StartTime >= startOfDay &&
                        element.StartTime <= endOfDay ||

                        element.EndTime >= startOfDay &&
                        element.EndTime <= endOfDay ||

                        element.StartTime < startOfDay &&
                        element.EndTime > endOfDay
                        );
                    });
                }
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
                that.bookingsForMonthArray = that.bookingTypeService.queryLessForPeriod(
                    {
                        fromDate: that.currentMonthStartDateObj.BookingSystemGetYearsMonthsDays(),
                        toDate: that.currentMonthEndDateObj.BookingSystemGetYearsMonthsDays()
                    }
                );

                // In case bookings cannot be fetched, display an error to user.
                that.bookingsForMonthArray.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Bokningarna kunde inte hämtas, var god försök igen.'
                    };
                });

                // Convert date strings to date objects
                that.bookingsForMonthArray.$promise.then(function(){

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
                var bookingTypeService;

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
                    bookings = that.bookingTypeService.queryMoreForPeriod(
                        {
                            fromDate: moment(that.currentDateObj).startOf('day').format('YYYY-MM-DD'),
                            toDate: moment(that.currentDateObj).endOf('day').format('YYYY-MM-DD')
                        }
                    );

                    // In case bookings cannot be fetched, display an error to user.
                    bookings.$promise.catch(function(){

                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Bokningarna kunde inte hämtas, var god försök igen.'
                        };
                    });

                    $scope.datedata.bookings = bookings;
                }
            };

            /* Scope methods END */


            /* Initialization START */

            // Init date to now
            that.currentDateObj = new Date();
            that.selectedMonth = that.currentDateObj.getMonth();
            that.selectedDay = that.currentDateObj.getDate();

            that.declareBookingTypeService();
            that.updateCalendarContent();

            /* Initialization END */

        })
        // Directive specific controllers END

        // Directives START
        .directive('bookingCalendar', ['Booking', function(Booking) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: function(element, attr){
                    if(attr.bookingType == "booking") {
                        return 'shared/directives/calendarDirectiveBooking.html';
                    }
                    else if (attr.bookingType == "location-booking") {
                        return 'shared/directives/calendarDirectiveLocationBooking.html';
                    }
                    else if (attr.bookingType == "resource-booking") {
                        return 'shared/directives/calendarDirectiveResourceBooking.html';
                    }
                },
                scope: true,
                link: function(){

                },
                controller: 'BookingCalendarInternalCtrl'
            };
        }])
        .directive('changeMonthButton', function() {
            return {
                restrict: 'A',
                replace: false,
                scope: false,
                link: function (scope, element, attr) {
                    // Prevent select element on double click
                    element.bind("mousedown", function (e) {
                        e.preventDefault();
                    });
                },
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