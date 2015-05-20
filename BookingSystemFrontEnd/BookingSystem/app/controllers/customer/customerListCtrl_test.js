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

        CustomerListCtrl = $controller('CustomerListCtrl', {
            $scope: $scope,
            Customer: _Customer_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests

    describe('CustomerListCtrl controller', function() {

        // Tests START
        it('should have correct initialization variables', inject(function ($controller, _Customer_) {

            // Test if correct scope variables are defined
            expect($scope.customers).toEqual(TestHelper.JSON.queryCustomer);
        }));
    });

});