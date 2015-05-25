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
    var CustomerListCtrl, CustomerCreateCtrl, CustomerEditCtrl;
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

        CustomerEditCtrl = $controller('CustomerEditCtrl', {
            $scope: $scope,
            Customer: _Customer_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


     describe('CustomerEditCtrl controller', function(){


         it('should call history.back() and create a FlashMessage after successful Customer editing', inject(function($rootScope, $controller, _Customer_, $routeParams) {

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.customer = { Name : 'Test'};

             // Mock route parameter variable
             $routeParams.customerId = 4;

             // Exec method to be tested
             $scope.save();

             // Check that customer was saved
             expect(_Customer_.save).toHaveBeenCalledWith({
                CustomerId: 4,
                Name: 'Test'
             });

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that page was redirected was called
             expect(history.back).toHaveBeenCalled();
         }));

         it('should create a FlashMessage after duplicate Customer editing', inject(function($rootScope, $controller, _Customer_, $q) {

             // Alter save to return unsuccessful response
             _Customer_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '409', 'There is already a Customer with the given name.');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.customer = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Det finns redan en kund som heter "Test". Två kunder kan inte heta lika.');

             // Check that redirection was NOT called
             expect(history.back).not.toHaveBeenCalled();
         }));

         it('should create a FlashMessage after unsuccessful Customer editing', inject(function($rootScope, $controller, _Customer_, $q) {

             // Alter save to return unsuccessful response
             _Customer_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '500');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.customer = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när kunden skulle sparas');

             // Check that redirection was NOT called
             expect(history.back).not.toHaveBeenCalled();
         }));

         it('should create a FlashMessage after unsuccessful Customer editing (customer deleted)', inject(function($rootScope, $controller, _Customer_, $q) {

             // Alter save to return unsuccessful response
             _Customer_.save = jasmine.createSpy('save').andCallFake(function() {

                 // Generate a promise object for mocked return data.
                 return TestHelper.addPromiseToObject({}, $q, '404');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.customer = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Kunden "Test" existerar inte längre. Hann kanske någon radera den?');

             // Check that redirection was NOT called
             expect(history.back).toHaveBeenCalled();
         }));

     // Tests END
     });


});