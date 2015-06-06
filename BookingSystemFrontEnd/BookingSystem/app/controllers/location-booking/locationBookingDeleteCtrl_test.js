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
    var BookingDeleteCtrl;
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
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _LocationBooking_, _$location_, $rootScope, _Redirect_) {
        $location = _$location_;
        $scope = $rootScope;

        LocationBookingDeleteCtrl = $controller('LocationBookingDeleteCtrl', {
            $scope: $scope,
            LocationBooking: _LocationBooking_,
            $rootScope: $rootScope,
            Redirect: _Redirect_
        });

    }));

    // Actual tests


    describe('LocationBookingDeleteCtrl controller', function(){

        it('should call history.back() and create a FlashMessage after successful LocationBooking Deleting', inject(function($rootScope, $controller, _LocationBooking_, $routeParams, Redirect) {

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.locationBooking = { Name : 'Test'};

            // Mock route parameter variable
            $routeParams.locationBookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            // Check that location booking was saved
            expect(_LocationBooking_.delete).toHaveBeenCalledWith({
                locationBookingId: 4
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after protected LocationBooking Deleteing', inject(function($rootScope, $controller, _LocationBooking_, $q, $routeParams, Redirect) {

            // Alter save to return unsuccessful response
            _LocationBooking_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400', 'Foreign key references exists');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.locationBooking = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.locationBookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Lokal/plats-bokningen kan inte raderas eftersom det finns någonting som refererar till lokal/plats-bokningen');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 500) LocationBooking Deleteing', inject(function($rootScope, $controller, _LocationBooking_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _LocationBooking_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.locationBooking = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.locationBookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när lokal/plats-bokningen skulle tas bort');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 400) LocationBooking Deleteing', inject(function($rootScope, $controller, _LocationBooking_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _LocationBooking_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.locationBooking = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.locationBookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när lokal/plats-bokningen skulle tas bort');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));


        it('should create a FlashMessage after unsuccessful (status 404) LocationBooking Deleteing', inject(function($rootScope, $controller, _LocationBooking_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _LocationBooking_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '404');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.locationBooking = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.locationBookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Lokal/plats-bokningen existerar inte längre. Hann kanske någon radera den?');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        // Tests END
    });


});