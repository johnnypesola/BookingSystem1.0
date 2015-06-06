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
    var BookingTypeDeleteCtrl;
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

        BookingTypeDeleteCtrl = $controller('BookingTypeDeleteCtrl', {
            $scope: $scope,
            BookingType: _BookingType_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


    describe('BookingTypeDeleteCtrl controller', function(){

        it('should call history.back() and create a FlashMessage after successful BookingType Deleting', inject(function($rootScope, $controller, _BookingType_, $routeParams) {

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.bookingType = { Name : 'Test'};

            // Mock route parameter variable
            $routeParams.bookingTypeId = 4;

            // Exec method to be tested
            $scope.confirm();

            // Check that bookingType was saved
            expect(_BookingType_.delete).toHaveBeenCalledWith({
                bookingTypeId: 4
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after protected BookingType Deleteing', inject(function($rootScope, $controller, _BookingType_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _BookingType_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400', 'Foreign key references exists');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.bookingType = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.bookingTypeId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Bokningstypen kan inte raderas eftersom det finns' +
            ' en bokning eller en resurs som refererar till bokningstypen');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 500) BookingType Deleteing', inject(function($rootScope, $controller, _BookingType_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _BookingType_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.bookingType = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.bookingTypeId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när bokningstypen skulle tas bort');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 400) BookingType Deleteing', inject(function($rootScope, $controller, _BookingType_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _BookingType_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.bookingType = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.bookingTypeId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när bokningstypen skulle tas bort');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));


        it('should create a FlashMessage after unsuccessful (status 404) BookingType Deleteing', inject(function($rootScope, $controller, _BookingType_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _BookingType_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '404');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.bookingType = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.bookingTypeId = 4;

            // Exec method to be tested
            $scope.confirm();

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