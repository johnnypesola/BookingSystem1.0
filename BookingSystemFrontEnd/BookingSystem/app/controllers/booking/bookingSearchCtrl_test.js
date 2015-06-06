/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.booking', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.booking'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var BookingListCtrl, BookingSearchCtrl, BookingEditCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock booking service module
    beforeEach(function () {
        module(function($provide) {
            $provide.factory('Booking', function($q) {
                return {
                    querySearch : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryBookings, $q);
                    })
                }
            });
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _Booking_, _$location_, $rootScope, _Redirect_) {
        $location = _$location_;
        $scope = $rootScope;

        BookingSearchCtrl = $controller('BookingSearchCtrl', {
            $scope: $scope,
            Booking: _Booking_,
            Redirect: _Redirect_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('BookingSearchCtrl controller', function(){

        it('should contain correct search results after search', inject(function($rootScope, $controller, _Booking_, Redirect) {

            // Populate values used for search
            $scope.searchColumn = 'Name';
            $scope.searchValue = 'Test';

            // Do search
            $scope.search();

            expect($scope.searchResults).toEqual(TestHelper.JSON.queryBookings);
        }));

        // Tests END
    });
});