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
    var ResourceDeleteCtrl;
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

        ResourceDeleteCtrl = $controller('ResourceDeleteCtrl', {
            $scope: $scope,
            Resource: _Resource_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


    describe('ResourceDeleteCtrl controller', function(){

        it('should call history.back() and create a FlashMessage after successful Resource Deleting', inject(function($rootScope, $controller, _Resource_, $routeParams) {

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.resource = { Name : 'Test'};

            // Mock route parameter variable
            $routeParams.resourceId = 4;

            // Exec method to be tested
            $scope.confirm();

            // Check that resource was saved
            expect(_Resource_.delete).toHaveBeenCalledWith({
                resourceId: 4
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after protected Resource Deleteing', inject(function($rootScope, $controller, _Resource_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Resource_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400', 'Foreign key references exists');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.resource = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.resourceId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Resursen kan inte raderas eftersom det finns' +
            ' en resursbokning som refererar till resursen');

            // Check that redirection was NOT called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 500) Resource Deleteing', inject(function($rootScope, $controller, _Resource_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Resource_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.resource = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.resourceId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när resursen skulle tas bort');

            // Check that redirection was NOT called
            expect(history.back).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 400) Resource Deleteing', inject(function($rootScope, $controller, _Resource_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Resource_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.resource = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.resourceId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när resursen skulle tas bort');

            // Check that redirection was NOT called
            expect(history.back).toHaveBeenCalled();
        }));


        it('should create a FlashMessage after unsuccessful (status 404) Resource Deleteing', inject(function($rootScope, $controller, _Resource_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Resource_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '404');
            });

            // Spy on existing controller method
            spyOn(history, 'back');

            // Mock scope variable
            $scope.resource = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.resourceId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Resursen "Test" existerar inte längre. Hann kanske någon radera den?');

            // Check that redirection was NOT called
            expect(history.back).toHaveBeenCalled();
        }));

        // Tests END
    });


});