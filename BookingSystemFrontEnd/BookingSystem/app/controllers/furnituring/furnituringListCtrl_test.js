/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.furnituring', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.furnituring'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var FurnituringListCtrl, FurnituringCreateCtrl, FurnituringEditCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock booking service module
    beforeEach(function () {
        module(function($provide) {
            $provide.factory('Furnituring', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getFurnituring, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryFurnituring, $q);
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
    beforeEach(inject(function($controller, _Furnituring_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;

        FurnituringListCtrl = $controller('FurnituringListCtrl', {
            $scope: $scope,
            Furnituring: _Furnituring_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests

    describe('FurnituringListCtrl controller', function() {

        // Tests START
        it('should have correct initialization variables', inject(function ($controller, _Furnituring_) {

            // Test if correct scope variables are defined
            expect($scope.furniturings).toEqual(TestHelper.JSON.queryFurnituring);
        }));
    });

});