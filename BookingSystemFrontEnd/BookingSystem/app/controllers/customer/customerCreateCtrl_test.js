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

            $provide.factory('CustomerImage', function($q) {
                return {
                    upload : jasmine.createSpy('upload').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.fakeHttpResponse({});
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

        CustomerCreateCtrl = $controller('CustomerCreateCtrl', {
            $scope: $scope,
            Customer: _Customer_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('CustomerCreateCtrl controller', function(){

        it('should call history.back() and create a FlashMessage after successful Customer creation', inject(function($rootScope, $controller, _Customer_) {

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.customer = { Name : 'Test' };

            // Exec method to be tested
            $scope.save();

            // Check that customer was saved
            expect(_Customer_.save).toHaveBeenCalledWith({
                CustomerId: 0,
                Name: 'Test'
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after duplicate Customer creation', inject(function($rootScope, $controller, _Customer_, $q) {

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

        it('should create a FlashMessage after unsuccessful Customer creation', inject(function($rootScope, $controller, _Customer_, $q) {

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

        // Tests END
    });
});