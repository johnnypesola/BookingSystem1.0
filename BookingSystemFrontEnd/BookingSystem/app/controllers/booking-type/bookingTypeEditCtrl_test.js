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

        BookingTypeEditCtrl = $controller('BookingTypeEditCtrl', {
            $scope: $scope,
            BookingType: _BookingType_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


     describe('BookingTypeEditCtrl controller', function(){

          it('should call history.back() and create a FlashMessage after successful BookingType editing', inject(function($rootScope, $controller, _BookingType_, $routeParams) {

             // Spy on existing controller method
              spyOn(history, 'back');

             // Mock scope variable
             $scope.bookingType = TestHelper.JSON.createBookingType;

             // Mock route parameter variable
             $routeParams.bookingTypeId = 0;

             // Exec method to be tested
             $scope.save();

             // Check that bookingType was saved
             expect(_BookingType_.save).toHaveBeenCalledWith(TestHelper.JSON.createBookingType);

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that page was redirected was called
             expect(history.back).toHaveBeenCalled();
         }));

         it('should create a FlashMessage after duplicate BookingType editing', inject(function($rootScope, $controller, _BookingType_, $q) {

             // Alter save to return unsuccessful response
             _BookingType_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '409', 'There is already a BookingType with the given name.');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.bookingType = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Det finns redan en bokningstyp som heter "Test". Två bokningstyper kan inte heta lika.');

             // Check that redirection was NOT called
             expect(history.back).not.toHaveBeenCalled();
         }));

         it('should create a FlashMessage after unsuccessful BookingType editing', inject(function($rootScope, $controller, _BookingType_, $q) {

             // Alter save to return unsuccessful response
             _BookingType_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '500');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.bookingType = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när bokningstypen skulle sparas');

             // Check that redirection was NOT called
             expect(history.back).not.toHaveBeenCalled();
         }));

         it('should create a FlashMessage after unsuccessful BookingType editing (bookingType deleted)', inject(function($rootScope, $controller, _BookingType_, $q) {

             // Alter save to return unsuccessful response
             _BookingType_.save = jasmine.createSpy('save').andCallFake(function() {

                 // Generate a promise object for mocked return data.
                 return TestHelper.addPromiseToObject({}, $q, '404');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.bookingType = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Bokningstypen "Test" existerar inte längre. Hann kanske någon radera den?');

             // Check that redirection was called
             expect(history.back).toHaveBeenCalled();
         }));

     // Tests END
     });


});