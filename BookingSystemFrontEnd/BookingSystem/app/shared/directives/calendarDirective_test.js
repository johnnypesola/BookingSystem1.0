/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: calendarDirective', function() {

    // Load app
    //beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.commonFilters'));
    beforeEach(module('bookingSystem.calendarDirective'));

    // Load template
    //beforeEach(module('ngResource'));
    beforeEach(module('templates'));

    // Root variables
    var testCurrentDateObj;
    var $scope;
    var q;
    var $location;
    var calendarElement;
    var calendarController;
    var dayElement;
    var dayController;
    var monthElement;


    // Mock booking service module
    beforeEach(function () {
        module(function($provide) {

            $provide.factory('Booking', function($q) {
                return {
                    get: jasmine.createSpy('get').andCallFake(function () {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getBookings, q);
                    }),
                    query: jasmine.createSpy('query').andCallFake(function () {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryBookings, q);
                    }),
                    queryMoreForPeriod: jasmine.createSpy('queryMoreForPeriod').andCallFake(function () {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryMoreForPeriodBookings, q);
                    }),
                    queryLessForPeriod: jasmine.createSpy('queryLessForPeriod').andCallFake(function () {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryLessForPeriodBookings, q);

                    }),
                    queryDay: jasmine.createSpy('queryDay').andCallFake(function () {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryDayBookings, q);
                    })
                }
            });

            $provide.constant('API_URL', "http://localhost:6796/api/");
        });
    });


    // Compile directive
    beforeEach(inject(function($controller, $rootScope, $compile, _$q_, _Booking_, _$location_) {

        testCurrentDateObj = new Date();
        $location = _$location_;
        q = _$q_;

        // Bind scope to rootscope
        $scope = $rootScope;

        // Markup the calendar element
        var calendarElem = angular.element('<booking-calendar booking-type="booking"></booking-calendar>');
        // Compile
        calendarElement = $compile(calendarElem)($scope);

        // Markup the day element
        var dayElem = angular.element('<a bookingCalendarDay="10"></div>');
        // Compile
        dayElement = $compile(dayElem)($scope);

        // Markup the change month button element
        var monthElem = angular.element('<a change-month-button direction="next" class="next-month">&#8594;</a>');
        // Compile
        monthElement = $compile(monthElem)($scope);

        $scope.$digest();

        // Get the controllers
        calendarController = calendarElement.controller("bookingCalendar");
        dayController = dayElement.controller("bookingCalendarDay");


        // Rebind scope to the elements isolated scope.
        $scope = calendarElement.scope();

    }));

    /*
    var testDateVars = function() {


        expect(calendarController.currentYear).toEqual(testCurrentDateObj.getFullYear());

        expect(calendarController.currentMonth).toEqual(testCurrentDateObj.getMonth());
        expect(calendarController.currentMonthName).toEqual(testCurrentDateObj.monthNamesArray[testCurrentDateObj.getMonth()]);
        expect(calendarController.currentMonthNumberOfDays).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1, 0).getDate());
        expect(calendarController.currentMonthStartDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), 1));
        expect(calendarController.currentMonthEndDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), calendarController.currentMonthNumberOfDays));

        expect(calendarController.currentMonthDay).toEqual(testCurrentDateObj.getDate());
        expect(calendarController.currentMonthDayName).toEqual(calendarController.currentDateObj.dayNamesArray[calendarController.currentMonthDay]);
        expect(calendarController.currentMonthStartWeekDay).toEqual(calendarController.currentMonthStartDateObj.getDay() === 0 ? 7 : calendarController.currentMonthStartDateObj.getDay());

        expect(calendarController.currentMonthEndWeekDay).toEqual(calendarController.currentMonthEndDateObj.getDay() === 0 ? 7 : calendarController.currentMonthEndDateObj.getDay());
        expect(calendarController.prevMonthNumberOfDays).toEqual(new Date(calendarController.currentYear, calendarController.currentMonth, 0).getDate());

    };

    // Tests START
    it('should have correct initialization (date) variables', function() {
        testDateVars();
    });

    it('should have correct (date) variables after changeToNextMonth() method', function() {
        $scope.changeToNextMonth();

        // Change testCurrentDateObj variable to next month.
        testCurrentDateObj = new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1);

        // Test date values
        testDateVars();
    });


    it('should have correct (date) variables after changeToPreviousMonth() method', function() {
        $scope.changeToPreviousMonth();

        // Change testCurrentDateObj variable to next month.
        testCurrentDateObj = new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() - 1);

        // Test date values
        testDateVars();
    });
     */

    it('should have correct booking-data after getBookingsForMonth()', function(){

        // Test callback function
        var testCallBack = jasmine.createSpy('testCallBack');

        // Test method
        calendarController.getBookingsForMonth(testCallBack);

        // Expect array to have correct values
        expect(calendarController.bookingsForMonthArray).toEqual(TestHelper.JSON.queryLessForPeriodBookings);

        // Expect callback to have been called
        calendarController.bookingsForMonthArray.$promise.then(function(){
            expect(testCallBack).toHaveBeenCalled();
        });
    });

    it('should have correct values after initDateVariables() and prepareCalendarDays()', function() {
        calendarController.initDateVariables();
        calendarController.prepareCalendarDays();

        var calendarDaysArrayExpectedLength = (calendarController.currentMonthStartWeekDay-1) + calendarController.currentMonthNumberOfDays + (7-calendarController.currentMonthEndWeekDay);

        expect(calendarDaysArrayExpectedLength).toEqual(calendarController.calendarDaysArray.length);
    });

    it('should have correct scope values after prepareCalendarDays() and addVarsToScope()', function() {

        calendarController.prepareCalendarDays();
        calendarController.addVarsToScope();

        expect($scope.datedata.currentYear).toEqual(testCurrentDateObj.getFullYear());
        expect($scope.datedata.currentMonth).toEqual(testCurrentDateObj.getMonth());
        expect($scope.datedata.currentMonthName).toEqual(moment(testCurrentDateObj).format('MMMM'));
        expect($scope.datedata.currentDayName).toEqual(moment(testCurrentDateObj).format('dddd'));
        expect($scope.datedata.currentMonthNumberOfDays).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1, 0).getDate());
        expect($scope.datedata.calendarDays).toEqual(calendarController.calendarDaysArray);
    });

    it('should have correct scope values after changeToDay() method', function() {

        // Expect booking type to be of correct type. (given in element attribute)
        expect(calendarController.bookingType).toEqual("booking");

        // Mock event
        var event = $scope.$broadcast("testEvent");

        // Execute method
        $scope.changeToDay(dayElement, {number: 10}, event);

        // Expect bookings to contain right data
        expect($scope.datedata.bookings).toEqual(TestHelper.JSON.queryMoreForPeriodBookings);

        // Expect certain date variables to be right
        expect(calendarController.currentDateObj).toEqual(new Date(calendarController.currentYear, calendarController.currentMonth, 10));
        expect(+calendarController.selectedMonth).toEqual(calendarController.currentDateObj.getMonth()+1);
        expect(calendarController.selectedDay).toEqual(calendarController.currentDateObj.getDate());
    });
});