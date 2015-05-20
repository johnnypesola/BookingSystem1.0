/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.resource', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.resource'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var ResourceListCtrl, ResourceCreateCtrl, ResourceEditCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock booking service module
    beforeEach(function () {
        module(function($provide) {
            $provide.factory('Resource', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getResource, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryResource, $q);
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
    beforeEach(inject(function($controller, _Resource_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;

        ResourceListCtrl = $controller('ResourceListCtrl', {
            $scope: $scope,
            Resource: _Resource_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests

    describe('ResourceListCtrl controller', function() {

        // Tests START
        it('should have correct initialization variables', inject(function ($controller, _Resource_) {

            // Test if correct scope variables are defined
            expect($scope.resources).toEqual(TestHelper.JSON.queryResource);
        }));
    });

});