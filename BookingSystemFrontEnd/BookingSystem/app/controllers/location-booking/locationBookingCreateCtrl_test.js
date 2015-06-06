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

            $provide.factory('Booking', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getBooking, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryBooking, $q);
                    }),
                    save : jasmine.createSpy('save').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({BookingId: 85}, $q);
                    }),
                    delete : jasmine.createSpy('delete').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({}, $q);
                    })
                }
            });

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

            $provide.factory('Customer', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getCustomer, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryCustomer, $q);
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
                    save : jasmine.createSpy('save').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({'LocationId' : 3}, $q);
                    }),
                    delete : jasmine.createSpy('delete').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({}, $q);
                    }),
                    queryFreeForPeriod : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryLocation, $q);
                    })
                }
            });

            $provide.factory('LocationFurnituring', function($q) {
                return {
                    queryForLocation : jasmine.createSpy('queryForLocation').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryFurnituring, $q);
                    })
                }
            });
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _LocationBooking_, _$location_, $rootScope, _Redirect_, _Booking_) {
        $location = _$location_;
        $scope = $rootScope;

        LocationBookingCreateCtrl = $controller('LocationBookingCreateCtrl', {
            $scope: $scope,
            LocationBooking: _LocationBooking_,
            $rootScope: $rootScope,
            Redirect: _Redirect_,
            Booking: _Booking_
        });
    }));

    // Actual tests
    describe('LocationBookingCreateCtrl controller', function(){

        it('should call history.back() and create a FlashMessage after successful LocationBooking creation', inject(function($rootScope, $controller, _LocationBooking_, Redirect, _Booking_) {

            var exprectedLocationBookingResult;

            // Spy on existing controller methods
            spyOn(history, 'back');

            // Mock booking variables
            $scope.booking = TestHelper.JSON.createBookingForLocation;
            $scope.locationBooking = TestHelper.JSON.createLocationBooking;

            // Mock furnituring variables
            $scope.locationBooking.SelectedFurnituring = {};
            $scope.locationBooking.SelectedFurnituring.FurnituringId = 2;

            // Mock Date variables
            $scope.StartDate = "2015-05-05";
            $scope.StartTime = "10:00";
            $scope.EndDate = "2015-05-05";
            $scope.EndTime = "10:30";

            // Exec method to be tested
            $scope.save();

            $rootScope.$apply();

            // Check that booking was saved
            expect(_Booking_.save).toHaveBeenCalledWith(TestHelper.JSON.createBookingForLocation);

            // Check that locationBooking was saved
            expect(_LocationBooking_.save).toHaveBeenCalledWith(TestHelper.JSON.createdLocationBooking);

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));



        it('should create a FlashMessage after duplicate LocationBooking creation', inject(function($rootScope, $controller, _LocationBooking_, $q) {

            // Alter save to return unsuccessful response
            _LocationBooking_.save = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '409', '');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock booking variables
            $scope.booking = TestHelper.JSON.createBookingForLocation;
            $scope.locationBooking = TestHelper.JSON.createLocationBooking;

            // Mock furnituring variables
            $scope.locationBooking.SelectedFurnituring = {};
            $scope.locationBooking.SelectedFurnituring.FurnituringId = 2;

            // Mock Date variables
            $scope.StartDate = "2015-05-05";
            $scope.StartTime = "10:00";
            $scope.EndDate = "2015-05-05";
            $scope.EndTime = "10:30";

            // Exec method to be tested
            $scope.save();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Lokalen är tyvärr redan bokad under vald tidsram.');

            // Check that redirection was NOT called
            expect(history.back).not.toHaveBeenCalled();
        }));


        it('should create a FlashMessage after unsuccessful LocationBooking creation', inject(function($rootScope, $controller, _LocationBooking_, $q) {

            // Alter save to return unsuccessful response
            _LocationBooking_.save = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock booking variables
            $scope.booking = TestHelper.JSON.createBookingForLocation;
            $scope.locationBooking = TestHelper.JSON.createLocationBooking;

            // Mock furnituring variables
            $scope.locationBooking.SelectedFurnituring = {};
            $scope.locationBooking.SelectedFurnituring.FurnituringId = 2;

            // Mock Date variables
            $scope.StartDate = "2015-05-05";
            $scope.StartTime = "10:00";
            $scope.EndDate = "2015-05-05";
            $scope.EndTime = "10:30";

            // Exec method to be tested
            $scope.save();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när lokal/plats-bokningen skulle sparas');

            // Check that redirection was NOT called
            expect(history.back).not.toHaveBeenCalled();
        }));

        it('should have correct furniturings after fetched update furniturings', inject(function($rootScope, $controller, _LocationBooking_, $q) {

            // Mock variables
            $scope.locationBooking.LocationId = 3;

            $scope.updateFurniturings();

            expect($scope.furniturings).toEqual(TestHelper.JSON.queryFurnituring);

        }));
        // Tests END
    });
});