/**
 * Created by jopes on 2015-05-01.
 */

describe('module: bookingSystem.furnituring', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.furnituring'));
    beforeEach(module('bookingSystem.customFilters'));

    // Root variables
    var FurnituringDeleteCtrl;
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

        FurnituringDeleteCtrl = $controller('FurnituringDeleteCtrl', {
            $scope: $scope,
            Furnituring: _Furnituring_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


    describe('FurnituringDeleteCtrl controller', function(){

        it('should call redirect() after abort() method', inject(function($controller, _Furnituring_) {

            // Spy on existing controller method
            spyOn(FurnituringDeleteCtrl, 'redirectToListPage');

            // Exec method to be tested
            $scope.abort();

            // Check that page was redirected was called
            expect(FurnituringDeleteCtrl.redirectToListPage).toHaveBeenCalled();
        }));

        it('should call redirect() and create a FlashMessage after successful Furnituring Deleting', inject(function($rootScope, $controller, _Furnituring_, $routeParams) {

            // Spy on existing controller method
            spyOn(FurnituringDeleteCtrl, 'redirectToListPage');

            // Mock scope variable
            $scope.furnituring = { Name : 'Test'};

            // Mock route parameter variable
            $routeParams.furnituringId = 4;

            // Exec method to be tested
            $scope.confirm();

            // Check that furnituring was saved
            expect(_Furnituring_.delete).toHaveBeenCalledWith({
                furnituringId: 4
            });

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that page was redirected was called
            expect(FurnituringDeleteCtrl.redirectToListPage).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after protected Furnituring Deleteing', inject(function($rootScope, $controller, _Furnituring_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Furnituring_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400', 'Foreign key references exists');
            });

            // Spy on existing controller method
            spyOn(FurnituringDeleteCtrl, 'redirectToListPage');

            // Mock scope variable
            $scope.furnituring = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.furnituringId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Möbleringen kan inte raderas eftersom det finns' +
            ' en lokalbokning eller en lokalmöblering som refererar till möbleringen');

            // Check that redirection was NOT called
            expect(FurnituringDeleteCtrl.redirectToListPage).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 500) Furnituring Deleteing', inject(function($rootScope, $controller, _Furnituring_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Furnituring_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '500');
            });

            // Spy on existing controller method
            spyOn(FurnituringDeleteCtrl, 'redirectToListPage');

            // Mock scope variable
            $scope.furnituring = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.furnituringId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när möbleringen skulle tas bort');

            // Check that redirection was NOT called
            expect(FurnituringDeleteCtrl.redirectToListPage).toHaveBeenCalled();
        }));

        it('should create a FlashMessage after unsuccessful (status 400) Furnituring Deleteing', inject(function($rootScope, $controller, _Furnituring_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Furnituring_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '400');
            });

            // Spy on existing controller method
            spyOn(FurnituringDeleteCtrl, 'redirectToListPage');

            // Mock scope variable
            $scope.furnituring = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.furnituringId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när möbleringen skulle tas bort');

            // Check that redirection was NOT called
            expect(FurnituringDeleteCtrl.redirectToListPage).toHaveBeenCalled();
        }));


        it('should create a FlashMessage after unsuccessful (status 404) Furnituring Deleteing', inject(function($rootScope, $controller, _Furnituring_, $q, $routeParams) {

            // Alter save to return unsuccessful response
            _Furnituring_.delete = jasmine.createSpy('save').andCallFake(function() {

                // Generate a promise object for mocked return data.
                return TestHelper.addPromiseToObject({}, $q, '404');
            });

            // Spy on existing controller method
            spyOn(FurnituringDeleteCtrl, 'redirectToListPage');

            // Mock scope variable
            $scope.furnituring = { Name : 'Test' };

            // Mock route parameter variable
            $routeParams.furnituringId = 4;

            // Exec method to be tested
            $scope.confirm();

            $scope.$digest();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage).toBeDefined();

            // Check that FlashMessage exists
            expect($rootScope.FlashMessage.message).toEqual('Möbleringen "Test" existerar inte längre. Hann kanske någon radera den?');

            // Check that redirection was NOT called
            expect(FurnituringDeleteCtrl.redirectToListPage).toHaveBeenCalled();
        }));

        // Tests END
    });


});