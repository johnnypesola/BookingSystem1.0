/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.locationBooking', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.locationBooking'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var LocationBookingListCtrl, LocationBookingCreateCtrl, LocationBookingEditCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock booking service module
    beforeEach(function () {
        module(function($provide) {
            $provide.factory('LocationBooking', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getLocationBooking, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryLocationBooking, $q);
                    }),
                    queryMoreForPeriod : jasmine.createSpy('queryMoreForPeriod').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryLocationBooking, $q);
                    }),
                    save : jasmine.createSpy('save').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({}, $q);
                    }),
                    delete : jasmine.createSpy('delete').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({}, $q);
                    })
                }
            });
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _LocationBooking_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;
        testCurrentDateObj = new Date();

        LocationBookingListCtrl = $controller('LocationBookingListCtrl', {
            $scope: $scope,
            LocationBooking: _LocationBooking_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests
    describe('LocationBookingListCtrl controller', function() {

        var testDateVars = function() {
            expect($scope.currentYear).toEqual(testCurrentDateObj.getFullYear());
            expect(LocationBookingListCtrl.currentMonth).toEqual(testCurrentDateObj.getMonth());
            expect($scope.currentMonthName).toEqual(moment(testCurrentDateObj).format('MMMM'));
            expect(LocationBookingListCtrl.currentMonthNumberOfDays).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1, 0).getDate());
            expect(LocationBookingListCtrl.currentMonthStartDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), 1));
            expect(LocationBookingListCtrl.currentMonthEndDateObj).toEqual(new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth(), LocationBookingListCtrl.currentMonthNumberOfDays));
        };

        // Tests START
        it('should have correct initialization (date) variables', inject(function($controller, _Booking_) {

            $scope.$digest();

            // Test if key variables are defined
            expect(LocationBookingListCtrl).toBeDefined();
            expect($scope.currentYear).toBeDefined();

            // Test date init values
            testDateVars();

        }));

        it('should have correct variables after change to next month', inject(function ($controller, _LocationBooking_) {

            // Exec method to be tested
            $scope.changeToNextMonth();

            // Change testCurrentDateObj variable to next month.
            testCurrentDateObj = new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() + 1);

            // Test date values
            testDateVars();
        }));

        it('should have correct (date) variables after changeToPreviousMonth() method', inject(function($controller, _LocationBooking_) {

            // Exec method to be tested
            $scope.changeToPreviousMonth();

            // Change testCurrentDateObj variable to next month.
            testCurrentDateObj = new Date(testCurrentDateObj.getFullYear(), testCurrentDateObj.getMonth() - 1);

            // Test date values
            testDateVars();
        }));

        it('should have correct booking data after getLocationBookings() method', inject(function($controller, _LocationBooking_) {

            // Exec method to be tested
            LocationBookingListCtrl.getLocationBookings();

            // Check that service method has been called
            expect(_LocationBooking_.queryMoreForPeriod).toHaveBeenCalled();

            // Check that the data after call is correct.
            expect($scope.locationBookings).toEqual(TestHelper.JSON.queryLocationBooking);
        }));
    });

});