/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.location', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.location'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var LocationSearchCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock location service module
    beforeEach(function () {
        module(function($provide) {
            $provide.factory('Location', function($q) {
                return {
                    querySearch : jasmine.createSpy('querySearch').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryLocation, $q);
                    })
                }
            });
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _Location_, _$location_, $rootScope, _Redirect_) {
        $location = _$location_;
        $scope = $rootScope;

        LocationSearchCtrl = $controller('LocationSearchCtrl', {
            $scope: $scope,
            Location: _Location_,
            Redirect: _Redirect_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('LocationSearchCtrl controller', function(){

        it('should contain correct search results after search', inject(function($rootScope, $controller, _Location_, Redirect) {

            // Populate values used for search
            $scope.searchColumn = 'Name';
            $scope.searchValue = 'Test';

            // Do search
            $scope.search();

            $scope.$digest();

            expect($scope.searchResults).toEqual(TestHelper.JSON.queryLocation);
        }));

        // Tests END
    });
});