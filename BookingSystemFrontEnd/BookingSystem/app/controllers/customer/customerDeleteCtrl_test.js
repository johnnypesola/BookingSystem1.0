/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.customer', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.customer'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var CustomerDeleteCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock booking service module
    beforeEach(function () {
        module(function($provide) {
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
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _Customer_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;

        CustomerDeleteCtrl = $controller('CustomerDeleteCtrl', {
            $scope: $scope,
            Customer: _Customer_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


    describe('CustomerDeleteCtrl controller', function(){

        it('should call history.back() and create a FlashMessage after successful Customer Deleting', inject(function($rootScope, $controller, _Customer_, $routeParams) {

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.customer = { Name : 'Test'};

            // Mock route parameter variable
            $routeParams.customerId = 4;

            // Exec method to be tested
            $scope.confirm();

            // Check that customer was saved
            expect(_Customer_.delete).toHaveBeenCalledWith({
                customerId: 4
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after protected Customer Deleteing', inject(function($rootScope, $controller, _Customer_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Customer_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400', 'Foreign key references exists');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.customer = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.customerId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Kunden kan inte raderas eftersom det finns' +
            ' en annan kund eller ett bokningstillfälle som refererar till kunden');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 500) Customer Deleteing', inject(function($rootScope, $controller, _Customer_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Customer_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.customer = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.customerId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när kunden skulle tas bort');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 400) Customer Deleteing', inject(function($rootScope, $controller, _Customer_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Customer_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.customer = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.customerId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när kunden skulle tas bort');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));


        it('should create a FlashMessage after unsuccessful (status 404) Customer Deleteing', inject(function($rootScope, $controller, _Customer_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Customer_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '404');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.customer = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.customerId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Kunden "Test" existerar inte längre. Hann kanske någon radera den?');

            // Check that redirection was called
            expect(history.back).toHaveBeenCalled();
        }));

        // Tests END
    });


});