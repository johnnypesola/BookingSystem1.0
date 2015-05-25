/**
 * Created by jopes on 2015-04-24.
 */


describe('module: bookingSystem.booking', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.booking'));
    beforeEach(module('bookingSystem.commonFilters'));
    beforeEach(module('bookingSystem.calendarDirective'));

    // Root variables
    var BookingCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;

    // Mock booking service module
    beforeEach(function () {
        module(function($provide) {
            $provide.factory('Booking', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getBookings, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryBookings, $q);
                    }),
                    queryMoreForPeriod : jasmine.createSpy('queryMoreForPeriod').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryMoreForPeriodBookings, $q);
                    })
                }
            });
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _Booking_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;
        testCurrentDateObj = new Date();

        BookingCtrl = $controller('BookingListCtrl', {
            $scope: $scope,
            Booking: _Booking_,
            $rootScope: $rootScope
        });
    }));

    // Actual tests
    describe('BookingListCtrl controller', function(){

        // Shared testing function. avoid DRY
        var testDateVars = function() {
            expect($scope.currentYear).toEqual(testCurrentDateObj.getFullYear());
            expect(BookingCtrl.currentMonth).toEqual(testCurrentDateObj.getMonth());
            expect($scope.currentMonthName).toEqual(moment(testCurrentDateObj).format('MMMM'));
            expect(BookingCtrl.currentMonthNumberOfDays).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1, 0).getDate());
            expect(BookingCtrl.currentMonthStartDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), 1));
            expect(BookingCtrl.currentMonthEndDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), BookingCtrl.currentMonthNumberOfDays));
        };

        // Tests START
        it('should have correct initialization (date) variables', inject(function($controller, _Booking_) {

            $scope.$digest();

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

            // Check that service method has been called
            expect(_Booking_.queryMoreForPeriod).toHaveBeenCalled();

            // Check that the data after call is correct.
            expect($scope.bookings).toEqual(TestHelper.JSON.queryMoreForPeriodBookings);
        }));

        // Tests END
    });
});