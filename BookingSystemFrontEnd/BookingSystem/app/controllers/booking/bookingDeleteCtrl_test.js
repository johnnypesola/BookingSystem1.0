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
    var BookingDeleteCtrl;
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

        BookingDeleteCtrl = $controller('BookingDeleteCtrl', {
            $scope: $scope,
            Booking: _Booking_,
            $rootScope: $rootScope,
            Redirect: _Redirect_
        });

    }));

    // Actual tests


    describe('BookingDeleteCtrl controller', function(){

        it('should call history.back() and create a FlashMessage after successful Booking Deleting', inject(function($rootScope, $controller, _Booking_, $routeParams, Redirect) {

            // Spy on existing controller method
            spyOn(Redirect, 'to');

            // Mock scope variable
            $scope.booking = { Name : 'Test'};

            // Mock route parameter variable
            $routeParams.bookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            // Check that booking was saved
            expect(_Booking_.delete).toHaveBeenCalledWith({
                bookingId: 4
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(Redirect.to).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after protected Booking Deleteing', inject(function($rootScope, $controller, _Booking_, $q, $routeParams, Redirect) {

            // Alter save to return unsuccessful response
            _Booking_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400', 'Foreign key references exists');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.booking = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.bookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Bokningstillfället kan inte raderas eftersom det finns' +
            ' någonting som refererar till bokningstillfället');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 500) Booking Deleteing', inject(function($rootScope, $controller, _Booking_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Booking_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.booking = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.bookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när bokningstillfället skulle tas bort');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 400) Booking Deleteing', inject(function($rootScope, $controller, _Booking_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Booking_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.booking = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.bookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när bokningstillfället skulle tas bort');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));


        it('should create a FlashMessage after unsuccessful (status 404) Booking Deleteing', inject(function($rootScope, $controller, _Booking_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Booking_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '404');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.booking = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.bookingId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Bokningstillfället existerar inte längre. Hann kanske någon radera den?');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        // Tests END
    });


});