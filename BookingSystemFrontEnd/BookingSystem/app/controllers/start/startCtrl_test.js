/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.startPage', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.startPage'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var StartCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

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
                    save : jasmine.createSpy('save').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({}, $q);
                    }),
                    delete : jasmine.createSpy('delete').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({}, $q);
                    }),
                    countEmpty : jasmine.createSpy('countEmpty').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.countEmpty, $q);
                    }),
                    queryMoreForPeriod : jasmine.createSpy('queryMoreForPeriod').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryBookings, $q);
                    })
                }
            });

            $provide.factory('Location', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getLocation, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryLocation, $q);
                    }),
                    queryFreeForPeriod : jasmine.createSpy('queryFreeForPeriod').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryLocation, $q);
                    }),
                    save : jasmine.createSpy('save').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({'LocationId' : 3}, $q);
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
    beforeEach(inject(function($controller, _Booking_, _$location_, $rootScope, _Location_) {
        $location = _$location_;
        $scope = $rootScope;

        StartCtrl = $controller('StartCtrl', {
            $scope: $scope,
            Booking: _Booking_,
            Location: _Location_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('StartPageCtrl controller', function(){

        it('should have correct values after init.', inject(function($rootScope, $controller, _Booking_, _Location_) {

            // Spy on existing controller method
            spyOn(history, 'back');

            $scope.$digest();

            // Count empty check
            expect($scope.emptyBookings).toEqual(TestHelper.JSON.countEmpty);

            // Bookings check
            expect($scope.bookingsForToday).toEqual(TestHelper.JSON.queryBookings);

            // Locations check
            expect($scope.locationsFreeForToday).toEqual(TestHelper.JSON.queryLocation);

        }));

        // Tests END
    });
});