/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.location', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.location'));
    beforeEach(module('bookingSystem.commonFilters'));
    beforeEach(module('uiGmapgoogle-maps'));

    // Root variables
    var LocationListCtrl, LocationCreateCtrl, LocationEditCtrl;
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

        LocationCreateCtrl = $controller('LocationCreateCtrl', {
            $scope: $scope,
            Location: _Location_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('LocationCreateCtrl controller', function(){

        it('should call redirect() after abort() method', inject(function($controller, _Location_) {

            // Spy on existing controller method
            spyOn(LocationCreateCtrl, 'redirectToListPage');

            // Exec method to be tested
            $scope.abort();

            // Check that page was redirected was called
            expect(LocationCreateCtrl.redirectToListPage).toHaveBeenCalled();
        }));

        it('should call redirect() and create a FlashMessage after successful Location creation', inject(function($rootScope, $controller, _Location_) {

            // Spy on existing controller method
            spyOn(LocationCreateCtrl, 'redirectToListPage');

            // Mock scope variable
            $scope.location = { Name : 'Test' };

            // Exec method to be tested
            $scope.save();

            // Check that location was saved
            expect(_Location_.save).toHaveBeenCalledWith({
                LocationId: 0,
                Name: 'Test'
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(LocationCreateCtrl.redirectToListPage).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after duplicate Location creation', inject(function($rootScope, $controller, _Location_, $q) {

            // Alter save to return unsuccessful response
            _Location_.save = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '409', 'There is already a Location with the given name.');
            });

            // Spy on existing controller method
            spyOn(LocationCreateCtrl, 'redirectToListPage');

            // Mock scope variable
            $scope.location = { Name : 'Test' };

            // Exec method to be tested
            $scope.save();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Det finns redan en plats som heter "Test". Två platser kan inte heta lika.');

            // Check that redirection was NOT called
            expect(LocationCreateCtrl.redirectToListPage).not.toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful Location creation', inject(function($rootScope, $controller, _Location_, $q) {

            // Alter save to return unsuccessful response
            _Location_.save = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(LocationCreateCtrl, 'redirectToListPage');

            // Mock scope variable
            $scope.location = { Name : 'Test' };

            // Exec method to be tested
            $scope.save();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när platsen skulle sparas');

            // Check that redirection was NOT called
            expect(LocationCreateCtrl.redirectToListPage).not.toHaveBeenCalled();
        }));

        // Tests END
    });
});