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
    var element;
    var controller;


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

        // Markup the element
        var elem = angular.element('<booking-calendar></booking-calendar>');

        // Compile the element
        element = $compile(elem)($scope);

        $scope.$digest();

        // Get the controller
        controller = element.controller("bookingCalendar");

        // Rebind scope to the elements isolated scope.
        $scope = element.scope();

    }));


    // Shared testing function. avoid DRY
    var testDateVars = function() {

        expect(controller.currentYear).toEqual(testCurrentDateObj.getFullYear());
        expect(controller.currentMonth).toEqual(testCurrentDateObj.getMonth());
        expect(controller.currentMonthName).toEqual(testCurrentDateObj.monthNamesArray[testCurrentDateObj.getMonth()]);
        expect(controller.currentMonthNumberOfDays).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1, 0).getDate());
        expect(controller.currentMonthStartDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), 1));
        expect(controller.currentMonthEndDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), controller.currentMonthNumberOfDays));

        expect(controller.currentMonthDay).toEqual(testCurrentDateObj.getDate());
        expect(controller.currentMonthDayName).toEqual(controller.currentDateObj.dayNamesArray[controller.currentMonthDay]);
        expect(controller.currentMonthStartWeekDay).toEqual(controller.currentMonthStartDateObj.getDay() === 0 ? 7 : controller.currentMonthStartDateObj.getDay());

        expect(controller.currentMonthEndWeekDay).toEqual(controller.currentMonthEndDateObj.getDay() === 0 ? 7 : controller.currentMonthEndDateObj.getDay());
        expect(controller.prevMonthNumberOfDays).toEqual(new Date(controller.currentYear, controller.currentMonth, 0).getDate());

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

});