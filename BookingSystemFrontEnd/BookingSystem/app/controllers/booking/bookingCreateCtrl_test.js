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
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getBooking, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryBooking, $q);
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
    beforeEach(inject(function($controller, _Booking_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;

        BookingCreateCtrl = $controller('BookingCreateCtrl', {
            $scope: $scope,
            Booking: _Booking_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('BookingCreateCtrl controller', function(){

        it('should call history.back() and create a FlashMessage after successful Booking creation', inject(function($rootScope, $controller, _Booking_) {

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.booking = { Name : 'Test' };

            // Exec method to be tested
            $scope.save();

            // Check that booking was saved
            expect(_Booking_.save).toHaveBeenCalledWith({
                BookingId: 0,
                Name: 'Test'
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after duplicate Booking creation', inject(function($rootScope, $controller, _Booking_, $q) {

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
            expect($rootScope.FlashMessage.message).toEqual('Det finns redan en möblering som heter "Test". Två möbleringar kan inte heta lika.');

            // Check that redirection was NOT called
            expect(history.back).not.toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful Booking creation', inject(function($rootScope, $controller, _Booking_, $q) {

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
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när bokningen skulle sparas');

            // Check that redirection was NOT called
            expect(history.back).not.toHaveBeenCalled();
        }));

        // Tests END
    });
});