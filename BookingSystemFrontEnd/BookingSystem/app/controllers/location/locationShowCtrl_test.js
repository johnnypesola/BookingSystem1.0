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
    var LocationShowCtrl;
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
                    }),
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

        LocationShowCtrl = $controller('LocationShowCtrl', {
            $scope: $scope,
            Location: _Location_,
            Redirect: _Redirect_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('LocationShowCtrl controller', function(){

        it('should contain correct data after init', inject(function($rootScope, $controller, _Location_, $routeParams) {

            // Mock route parameter variable
            $routeParams.locationId = 4;

            $scope.$digest();

            // Assert map variables
            expect($scope.map).toEqual({
                center: $rootScope.googleMapsDefaults.center,
                zoom: $rootScope.googleMapsDefaults.zoom,
                bounds: {},
                options: {mapTypeId: google.maps.MapTypeId.SATELLITE}
            });

            // Assert location
            expect($scope.location).toEqual(TestHelper.JSON.getLocation);

            // Assert location furniturings
            expect($scope.location.furniturings).toEqual(TestHelper.JSON.queryForLocation);

        }));

        it('should contain correct map variables convertMarkers() method', inject(function($rootScope, $controller, _Location_, Redirect, $routeParams) {

            // Mock route parameter variable
            $routeParams.locationId = 4;

            // Exec methods
            LocationShowCtrl.initMapVariables();

            LocationShowCtrl.convertMarkers();

            // Assert map zoom
            expect($scope.map.zoom).toEqual(18);

            // Assert map center
            expect($scope.map.center).toEqual(
                {
                    latitude: $scope.location.GPSLatitude,
                    longitude: $scope.location.GPSLongitude
                }
            );

            // Assert map makers
            expect($scope.markers[0]).toEqual(
                {
                    id: $scope.location.LocationId,
                    coords: {
                        latitude: $scope.location.GPSLatitude,
                        longitude: $scope.location.GPSLongitude
                    }
                }
            )
        }));
        // Tests END
    });
});