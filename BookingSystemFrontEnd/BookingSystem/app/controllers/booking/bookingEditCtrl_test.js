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
    var BookingListCtrl, BookingCreateCtrl, BookingEditCtrl;
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
                    save : jasmine.createSpy('save').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({}, $q);
                    })
                }
            });

            $provide.factory('BookingType', function($q) {
                return {
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryBookingType, $q);
                    })
                }
            });

            $provide.factory('Customer', function($q) {
                return {
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryCustomer, $q);
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

        BookingEditCtrl = $controller('BookingEditCtrl', {
            $scope: $scope,
            Booking: _Booking_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


     describe('BookingEditCtrl controller', function(){

          it('should call history.back() and create a FlashMessage after successful Booking editing', inject(function($rootScope, $controller, _Booking_, $routeParams) {

             // Spy on existing controller method
              spyOn(history, 'back');

             // Mock scope variable
             $scope.booking = TestHelper.JSON.createBooking;

             // Mock route parameter variable
             $routeParams.bookingId = 0;

             // Exec method to be tested
             $scope.save();

             // Check that booking was saved
             expect(_Booking_.save).toHaveBeenCalledWith(TestHelper.JSON.createBooking);

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that page was redirected was called
             expect(history.back).toHaveBeenCalled();
         }));

         it('should create a FlashMessage after duplicate Booking editing', inject(function($rootScope, $controller, _Booking_, $q) {

             // Alter save to return unsuccessful response
             _Booking_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '409', 'There is already a Booking with the given name.');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.booking = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Det finns redan ett bokningstillfälle som heter "Test". Två bokningstillfällen kan inte heta lika.');

             // Check that redirection was NOT called
             expect(history.back).not.toHaveBeenCalled();
         }));

         it('should create a FlashMessage after unsuccessful Booking editing', inject(function($rootScope, $controller, _Booking_, $q) {

             // Alter save to return unsuccessful response
             _Booking_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '500');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.booking = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när bokningstillfället skulle sparas');

             // Check that redirection was NOT called
             expect(history.back).not.toHaveBeenCalled();
         }));

         it('should create a FlashMessage after unsuccessful Booking editing (booking deleted)', inject(function($rootScope, $controller, _Booking_, $q) {

             // Alter save to return unsuccessful response
             _Booking_.save = jasmine.createSpy('save').andCallFake(function() {

                 // Generate a promise object for mocked return data.
                 return TestHelper.addPromiseToObject({}, $q, '404');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.booking = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Bokningstillfället "Test" existerar inte längre. Hann kanske någon radera den?');

             // Check that redirection was called
             expect(history.back).toHaveBeenCalled();
         }));

     // Tests END
     });


});