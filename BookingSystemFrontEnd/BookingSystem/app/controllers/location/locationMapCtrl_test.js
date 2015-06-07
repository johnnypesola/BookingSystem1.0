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
    var LocationMapCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock location service module
    beforeEach(function () {
        module(function($provide) {
            $provide.factory('Location', function($q) {
                return {
                    get : jasmine.createSpy('get').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.getLocation, $q);
                    }),
                    query : jasmine.createSpy('query').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryLocation, $q);
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

            $provide.factory('LocationFurnituring', function($q) {
                return {

                    queryForLocation : jasmine.createSpy('queryForLocation').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryForLocation, $q);
                    })
                }
            })
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _Location_, _$location_, $rootScope, _Redirect_) {
        $location = _$location_;
        $scope = $rootScope;

        LocationMapCtrl = $controller('LocationMapCtrl', {
            $scope: $scope,
            Location: _Location_,
            Redirect: _Redirect_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('LocationMapCtrl controller', function(){

        it('should contain correct data after init', inject(function($rootScope, $controller, _Location_, $routeParams) {

            $scope.$digest();

            // Assert map variables
            expect($scope.map).toEqual({
                center: $rootScope.googleMapsDefaults.center,
                zoom: $rootScope.googleMapsDefaults.zoom,
                bounds: {}
            });


            // Assert location
            expect(LocationMapCtrl.locations).toEqual(TestHelper.JSON.queryLocation);

        }));

        it('should contain correct map variables convertMarkers() method', inject(function($rootScope, $controller, _Location_, Redirect, $routeParams) {


            // Exec methods
            LocationMapCtrl.initMapVariables();

            LocationMapCtrl.convertMarkers();

            // Assert map makers


            LocationMapCtrl.locations.forEach(function(location, index, array) {

                // Assert cordinates
                expect(location.GPSLatitude).toEqual($scope.markers[index].coords.latitude);
                expect(location.GPSLongitude).toEqual($scope.markers[index].coords.longitude);

                // Assert id
                expect(location.LocationId).toEqual($scope.markers[index].id);

                // Assert title
                expect(location.Name).toEqual($scope.markers[index].title);
            });
        }));

        // Tests END
    });
});