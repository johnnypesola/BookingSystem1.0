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
    var LocationDeleteCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;
    var $rootScope;

    // Mock booking service module
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
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _Location_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;

        LocationDeleteCtrl = $controller('LocationDeleteCtrl', {
            $scope: $scope,
            Location: _Location_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


    describe('LocationDeleteCtrl controller', function(){

        it('should call redirect() and create a FlashMessage after successful Location Deleting', inject(function($rootScope, $controller, _Location_, $routeParams) {

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.location = { Name : 'Test'};

            // Mock route parameter variable
            $routeParams.locationId = 4;

            // Exec method to be tested
            $scope.confirm();

            // Check that location was saved
            expect(_Location_.delete).toHaveBeenCalledWith({
                locationId: 4
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after protected Location Deleteing', inject(function($rootScope, $controller, _Location_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Location_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400', 'Foreign key references exists');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.location = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.locationId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Platsen kan inte raderas eftersom det finns' +
            ' en lokalbokning eller en annan lokal/plats som refererar till platsen');

            // Check that redirection was NOT called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 500) Location Deleteing', inject(function($rootScope, $controller, _Location_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Location_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.location = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.locationId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när platsen skulle tas bort');

            // Check that redirection was NOT called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 400) Location Deleteing', inject(function($rootScope, $controller, _Location_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Location_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.location = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.locationId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när platsen skulle tas bort');

            // Check that redirection was NOT called
            expect(history.back).toHaveBeenCalled();
        }));


        it('should create a FlashMessage after unsuccessful (status 404) Location Deleteing', inject(function($rootScope, $controller, _Location_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Location_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '404');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.location = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.locationId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Platsen "Test" existerar inte längre. Hann kanske någon radera den?');

            // Check that redirection was NOT called
            expect(history.back).toHaveBeenCalled();
        }));

        // Tests END
    });


});