/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.bookingType', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.bookingType'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var BookingTypeListCtrl, BookingTypeCreateCtrl, BookingTypeEditCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock booking service module
    beforeEach(function () {
        module(function($provide) {
            $provide.factory('BookingType', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getBookingType, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryBookingType, $q);
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
    beforeEach(inject(function($controller, _BookingType_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;

        BookingTypeListCtrl = $controller('BookingTypeListCtrl', {
            $scope: $scope,
            BookingType: _BookingType_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests

    describe('BookingTypeListCtrl controller', function() {

        // Tests START
        it('should have correct initialization variables', inject(function ($controller, _BookingType_) {

            // Test if correct scope variables are defined
            expect($scope.bookingTypes).toEqual(TestHelper.JSON.queryBookingType);
        }));
    });

});