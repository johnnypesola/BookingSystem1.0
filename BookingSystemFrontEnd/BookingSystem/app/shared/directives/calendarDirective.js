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
        .controller('BookingCalendarInternalCtrl', ["$scope", "$element", "$attrs", "Booking", "LocationBooking", "ResourceBooking", "$rootScope", "$location", "$q", function($scope, $element, $attrs, Booking, LocationBooking, ResourceBooking, $rootScope, $location, $q) {

            /* Declare variables START */
            var that = this,
                i;
            that.bookingType = $attrs.bookingType;

            /* Declare variables END */

            /* Object methods START */

            that.declareTypeOfBookingService = function(){

                // Find out what type of data to get
                if(that.bookingType == "booking"){
                    that.typeOfBookingService = Booking;
                }
                else if(that.bookingType == "location-booking"){
                    that.typeOfBookingService = LocationBooking;
                }
                else if(that.bookingType == "resource-booking"){
                    that.typeOfBookingService = ResourceBooking;
                }
            };


            that.updateSelectedDateIfNeeded = function(){
                if(typeof that.selectedMonth == 'undefined' || typeof that.selectedDay == 'undefined'){
                    that.selectedMonth = $location.search().manad;
                    that.selectedDay = $location.search().dag;
                }
            };

            that.initDateVariables = function (){

                // Get date strings from url params
                var yearParam = $location.search().ar;
                var monthParam = $location.search().manad;
                var dayParam = $location.search().dag || 1;

                // Convert url params to current date object, with fallback.
                if(
                    typeof yearParam !== 'undefined' &&
                    typeof monthParam !== 'undefined'
                ) {
                    that.currentDateObj = moment(
                        yearParam + "-" +
                        $BookSysUtil.String.addLeadingZero(monthParam) + "-" +
                        $BookSysUtil.String.addLeadingZero(dayParam)
                    ).toDate();
                }
                // Could not convert. Set fall back to defaults.
                else {
                    that.currentDateObj = new Date();
                    that.setDefaultUrlParams();
                }

                // Set a selected date in calendar, if there is none.
                that.updateSelectedDateIfNeeded();

                // Define a lot of values with currentDateObj as base.
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

                // String to display when bookings are showed.
                $scope.dateHeaderString = moment(that.currentDateObj).format('dddd, Do MMMM YYYY');
            };

            // Check if specific day is today.
            that.isSelectedDay = function(dayNumber) {

                return (+that.selectedMonth === +that.currentMonth+1 && +that.selectedDay === dayNumber);
            };

            // Check if a specific day has bookings
            that.dayHasBookings = function(dayNumber) {

                if(typeof dayNumber !== 'undefined') {

                    var monthNumber;

                    // Add leading zero if needed
                    dayNumber = $BookSysUtil.String.addLeadingZero(dayNumber);
                    monthNumber = $BookSysUtil.String.addLeadingZero(that.currentMonth + 1);

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
                            cssClassName: ( that.isSelectedDay(i) ? 'active' : ( that.dayHasBookings(i) ? 'has-events' : ''))
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

            that.getBookingsForMonth = function() {
                var deferred = $q.defer(),
                    promise = deferred.promise;

                // Get bookings
                that.bookingsForMonthArray = that.typeOfBookingService.queryLessForPeriod(
                    {
                        fromDate: moment(that.currentMonthStartDateObj).format('YYYY-MM-DD'),
                        toDate: moment(that.currentMonthEndDateObj).format('YYYY-MM-DD')
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

                    // Resolve promise
                    deferred.resolve();
                });

                return promise;
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

            that.setDefaultUrlParams = function() {

                // Check if url params are not set.
                if(
                    typeof $location.search().ar === 'undefined' &&
                    typeof $location.search().manad === 'undefined' &&
                    typeof $location.search().dag === 'undefined'
                ) {
                    // Set default url params
                    $location.search('ar', moment().format('YYYY'));
                    $location.search('manad', moment().format('M'));
                    $location.search('dag', moment().format('D'));
                }
            };

            that.updateCalendarContent = function() {

                var deferred = $q.defer(),
                    promise = deferred.promise;

                that.initDateVariables();

                that.getBookingsForMonth()

                    // Success
                    .then(function(){

                        $BookSysUtil.Date.convertStringsToDates(that.bookingsForMonthArray);

                        that.prepareCalendarDays();
                        that.addVarsToScope();

                        // Resolve promise
                        deferred.resolve();
                    });

                return promise;
            };

            that.getDataForDay = function(){

                var bookings;

                // Fetch data

                bookings = that.typeOfBookingService.queryMoreForPeriod(
                    {
                        fromDate: moment(that.currentDateObj).format('YYYY-MM-DD'),
                        toDate: moment(that.currentDateObj).format('YYYY-MM-DD')
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
            };

            /* Object methods END */

            /* Scope methods START */

            $scope.changeToPreviousMonth = function(){

                // Year overlap adjustment code
                if(that.currentMonth == 0) {
                    that.currentMonth = 12;
                    that.currentYear -= 1;
                }

                $location.search('ar', that.currentYear);
                $location.search('manad', that.currentMonth);
                $location.search('dag', null);

                that.updateCalendarContent();
            };

            $scope.changeToNextMonth = function(){

                // Year overlap adjustment code
                if(that.currentMonth == 11) {

                    that.currentYear += 1;
                    that.currentMonth = -1;
                }


                $location.search('ar', that.currentYear);
                $location.search('manad', that.currentMonth + 2);
                $location.search('dag', null);

                that.updateCalendarContent();
            };

            $scope.changeToDay = function($element, $attrs, event){

                var clickedDayElement = angular.element(event.target);

                // Only apply click events to this months days
                if(!clickedDayElement.hasClass('inactive')) {

                    // Change selected date variables
                    that.currentDateObj = new Date(that.currentYear, that.currentMonth, $attrs.number);

                    // Url day param
                    $location.search('dag', $attrs.number);

                    that.selectedMonth = $location.search().manad;
                    that.selectedDay = $location.search().dag;

                    // Prevent url change
                    event.preventDefault();

                    // Change bound calendar model data
                    that.initDateVariables();
                    that.prepareCalendarDays();
                    that.addVarsToScope();

                    // Get data for day
                    that.getDataForDay();
                }
            };

            /* Scope methods END */


            /* Initialization START */

                that.declareTypeOfBookingService();
                that.updateCalendarContent()
                    .then(function(){

                        that.getDataForDay();
                    });

            /* Initialization END */

        }])
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
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

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
                }]
            }
        })
        .directive('bookingCalendarDay', function() {
            return {
                restrict: 'A',
                replace: false,
                scope: false,
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

                    $element.bind('click', function(event) {
                        $scope.changeToDay($element, $attrs, event);
                    });
                }]
            }
        });
})();