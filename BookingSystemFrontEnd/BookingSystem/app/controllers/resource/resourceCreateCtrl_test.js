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

        ResourceCreateCtrl = $controller('ResourceCreateCtrl', {
            $scope: $scope,
            Resource: _Resource_,
            $rootScope: $rootScope
        });

    }));


    // Actual tests

    describe('ResourceCreateCtrl controller', function(){

        it('should call redirect() and create a FlashMessage after successful Resource creation', inject(function($rootScope, $controller, _Resource_) {

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.resource = { Name : 'Test' };

            // Exec method to be tested
            $scope.save();

            // Check that resource was saved
            expect(_Resource_.save).toHaveBeenCalledWith({
                ResourceId: 0,
                Name: 'Test'
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after duplicate Resource creation', inject(function($rootScope, $controller, _Resource_, $q) {

            // Alter save to return unsuccessful response
            _Resource_.save = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '409', 'There is already a Resource with the given name.');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.resource = { Name : 'Test' };

            // Exec method to be tested
            $scope.save();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Det finns redan en resurs som heter "Test". Två resurser kan inte heta lika.');

            // Check that redirection was NOT called
            expect(history.back).not.toHaveBeenCalled()
        }));

        it('should create a FlashMessage after unsuccessful Resource creation', inject(function($rootScope, $controller, _Resource_, $q) {

            // Alter save to return unsuccessful response
            _Resource_.save = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.resource = { Name : 'Test' };

            // Exec method to be tested
            $scope.save();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när resursen skulle sparas');

            // Check that redirection was NOT called
            expect(history.back).not.toHaveBeenCalled();
        }));

        // Tests END
    });
});