/**
 * Created by jopes on 2015-04-24.
 */


/* Mock service test END */
describe('bookingSystem.booking module', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.booking'));
    beforeEach(module('bookingSystem.customFilters'));
    beforeEach(module('bookingSystem.calendarDirective'));

    // Root variables
    var BookingCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var getBookingsJSON = {"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0};
    var queryBookingsJSON = [{"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":10,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":26.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":29,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":5.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":58,"Name":"","BookingTypeId":0,"CustomerId":9,"Provisional":false,"NumberOfPeople":123,"Discount":0.00,"Notes":"En anteckning","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Kajsa Anka","MaxPeople":0,"CalculatedBookingPrice":2.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":60,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":300,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":23.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":61,"Name":"","BookingTypeId":0,"CustomerId":3,"Provisional":false,"NumberOfPeople":20,"Discount":0.00,"Notes":"hej","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Fagersta kommun","MaxPeople":0,"CalculatedBookingPrice":98.0,"TotalBookingValue":0.0,"PayMethodId":0}];
    var queryMoreForPeriodBookingsJSON = [{"StartTime":"2015-04-01T00:00:00","EndTime":"2015-04-01T00:00:00","Type":"location"}];

    // Mock booking service module
    beforeEach(function () {
        module({
            Booking: {
                    get : jasmine.createSpy('get').andCallFake(function() {
                        return getBookingsJSON
                    }),
                    query : jasmine.createSpy('get').andCallFake(function() {
                        return queryBookingsJSON
                    }),
                    queryMoreForPeriod : jasmine.createSpy('get').andCallFake(function() {
                        return queryMoreForPeriodBookingsJSON
                    })
                }
        });
    });


    // Init root test variables
    beforeEach(inject(function($controller, _Booking_, _$location_) {
        $location = _$location_;
        $scope = {};
        testCurrentDateObj = new Date();

        BookingCtrl = $controller('BookingCtrl', {
            $scope: $scope,
            Booking: _Booking_
        });
    }));

    // Actual tests
    describe('BookingCtrl controller', function(){

    // Shared testing function. avoid DRY
        var testDateVars = function() {
            expect($scope.currentYear).toEqual(testCurrentDateObj.getFullYear());
            expect(BookingCtrl.currentMonth).toEqual(testCurrentDateObj.getMonth());
            expect($scope.currentMonthName).toEqual(testCurrentDateObj.monthNamesArray[testCurrentDateObj.getMonth()]);
            expect(BookingCtrl.currentMonthNumberOfDays).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1, 0).getDate());
            expect(BookingCtrl.currentMonthStartDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), 1));
            expect(BookingCtrl.currentMonthEndDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), BookingCtrl.currentMonthNumberOfDays));
        };

    // Tests START
        it('should have correct initialization (date) variables', inject(function($controller, _Booking_) {

            // Test if key variables are defined
            expect(BookingCtrl).toBeDefined();
            expect($scope.currentYear).toBeDefined();

            // Test date init values
            testDateVars();
        }));

        it('should have correct (date) variables after changeToNextMonth() method', inject(function($controller, _Booking_) {

            // Exec method to be tested
            $scope.changeToNextMonth();

            // Change testCurrentDateObj variable to next month.
            testCurrentDateObj = new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1);

            // Test date values
            testDateVars();
        }));

        it('should have correct (date) variables after changeToPreviousMonth() method', inject(function($controller, _Booking_) {

            // Exec method to be tested
            $scope.changeToPreviousMonth();

            // Change testCurrentDateObj variable to next month.
            testCurrentDateObj = new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() - 1);

            // Test date values
            testDateVars();
        }));

        it('should have correct booking data after getBookings() method', inject(function($controller, _Booking_) {

            // Exec method to be tested
            BookingCtrl.getBookings();

            expect($scope.bookings).toEqual(queryMoreForPeriodBookingsJSON);
        }));

    // Tests END
    });


});
