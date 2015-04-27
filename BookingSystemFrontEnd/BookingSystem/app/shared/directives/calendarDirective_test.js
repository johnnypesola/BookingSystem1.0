/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: calendarDirective', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.customFilters'));
    beforeEach(module('bookingSystem.calendarDirective'));

    // Load template
    //beforeEach(module('ngResource'));
    beforeEach(module('templates'));

    // Root variables
    var BookingCtrl;
    var testCurrentDateObj;
    var $scope;
    var q;
    var $location;
    var getBookingsJSON = {"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0};
    var queryBookingsJSON = [{"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":10,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":26.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":29,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":5.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":58,"Name":"","BookingTypeId":0,"CustomerId":9,"Provisional":false,"NumberOfPeople":123,"Discount":0.00,"Notes":"En anteckning","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Kajsa Anka","MaxPeople":0,"CalculatedBookingPrice":2.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":60,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":300,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":23.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":61,"Name":"","BookingTypeId":0,"CustomerId":3,"Provisional":false,"NumberOfPeople":20,"Discount":0.00,"Notes":"hej","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Fagersta kommun","MaxPeople":0,"CalculatedBookingPrice":98.0,"TotalBookingValue":0.0,"PayMethodId":0}];
    var queryMoreForPeriodBookingsJSON = [{"StartTime":"2015-04-01T00:00:00","EndTime":"2015-04-01T00:00:00","Type":"location"}];
    var queryLessForPeriodBookingsJSON = [{"StartTime":"2015-01-01T00:00:00","EndTime":"2015-01-01T23:00:00","Type":"resource"},{"StartTime":"2015-01-02T00:00:00","EndTime":"2015-01-02T23:00:00","Type":"resource"},{"StartTime":"2015-04-01T00:00:00","EndTime":"2015-04-01T00:00:00","Type":"location"},{"StartTime":"2015-10-01T00:00:00","EndTime":"2015-10-01T00:00:00","Type":"meal"}]
    var queryDayBookingsJSON = [{"BookingId":7,"BookingName":"","CustomerId":1,"NumberOfPeople":10,"Provisional":false,"CustomerName":"Atlas Copco","TypeName":"Whiteboard","Type":"Resource","TypeId":3,"Count":5,"StartTime":"2015-01-01T00:00:00","EndTime":"2015-01-01T23:00:00"}]
    var calendarElement;
    var calendarController;
    var dayElement;
    var dayController;
    var monthElement;


    // Mock booking service module
    beforeEach(function () {
        module({
            Booking: {
                get : jasmine.createSpy('get').andCallFake(function() {
                    return getBookingsJSON
                }),
                query : jasmine.createSpy('query').andCallFake(function() {
                    return queryBookingsJSON
                }),
                queryMoreForPeriod : jasmine.createSpy('queryMoreForPeriod').andCallFake(function() {
                    return queryMoreForPeriodBookingsJSON
                }),
                queryLessForPeriod : jasmine.createSpy('queryLessForPeriod').andCallFake(function() {
                    var deferred, returnValue;
                    deferred = q.defer();
                    deferred.resolve(queryLessForPeriodBookingsJSON);

                    returnValue = queryLessForPeriodBookingsJSON;
                    returnValue.$promise = deferred.promise;

                    return returnValue ;//queryLessForPeriodBookingsJSON
                }),
                queryDay : jasmine.createSpy('queryDay').andCallFake(function() {
                    return queryDayBookingsJSON
                })

            }
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
        var calendarElem = angular.element('<booking-calendar></booking-calendar>');
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


    // Shared testing function. avoid DRY
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

    it('should have correct booking-data after getBookingsForMonth()', function(){

        // Test callback function
        var testCallBack = jasmine.createSpy('testCallBack');

        // Test method
        calendarController.getBookingsForMonth(testCallBack);

        // Expect array to have correct values
        expect(calendarController.bookingsForMonthArray).toEqual(queryLessForPeriodBookingsJSON);

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
        expect($scope.datedata.currentMonthName).toEqual(testCurrentDateObj.monthNamesArray[testCurrentDateObj.getMonth()]);
        expect($scope.datedata.currentDayName).toEqual(calendarController.currentDateObj.dayNamesArray[calendarController.currentMonthDay]);
        expect($scope.datedata.currentMonthNumberOfDays).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1, 0).getDate());
        expect($scope.datedata.calendarDays).toEqual(calendarController.calendarDaysArray);
    });

    it('should have correct scope values after changeToDay() method', function() {

        // Mock event
        var event = $scope.$broadcast("testEvent");

        // Execute method
        $scope.changeToDay(dayElement, {number: 10}, event);

        // Expect bookings to contain right data
        expect($scope.datedata.bookings).toEqual(queryDayBookingsJSON);

        // Expect certain date variables to be right
        expect(calendarController.currentDateObj).toEqual(new Date(calendarController.currentYear, calendarController.currentMonth, 10));
        expect(calendarController.selectedMonth).toEqual(calendarController.currentDateObj.getMonth());
        expect(calendarController.selectedDay).toEqual(calendarController.currentDateObj.getDate());
    });
});