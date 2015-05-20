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

        FurnituringEditCtrl = $controller('FurnituringEditCtrl', {
            $scope: $scope,
            Furnituring: _Furnituring_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


     describe('FurnituringEditCtrl controller', function(){

         it('should call redirect() after abort() method', inject(function($controller, _Furnituring_) {

             // Spy on existing controller method
             spyOn(FurnituringEditCtrl, 'redirectToListPage');

             // Exec method to be tested
             $scope.abort();

             // Check that page was redirected was called
             expect(FurnituringEditCtrl.redirectToListPage).toHaveBeenCalled();
         }));

         it('should call redirect() and create a FlashMessage after successful Furnituring editing', inject(function($rootScope, $controller, _Furnituring_, $routeParams) {

             // Spy on existing controller method
             spyOn(FurnituringEditCtrl, 'redirectToListPage');

             // Mock scope variable
             $scope.furnituring = { Name : 'Test'};

             // Mock route parameter variable
             $routeParams.furnituringId = 4;

             // Exec method to be tested
             $scope.save();

             // Check that furnituring was saved
             expect(_Furnituring_.save).toHaveBeenCalledWith({
                FurnituringId: 4,
                Name: 'Test'
             });

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that page was redirected was called
             expect(FurnituringEditCtrl.redirectToListPage).toHaveBeenCalled();
         }));

         it('should create a FlashMessage after duplicate Furnituring editing', inject(function($rootScope, $controller, _Furnituring_, $q) {

             // Alter save to return unsuccessful response
             _Furnituring_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '409', 'There is already a Furnituring with the given name.');
             });

             // Spy on existing controller method
             spyOn(FurnituringEditCtrl, 'redirectToListPage');

             // Mock scope variable
             $scope.furnituring = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Det finns redan en möblering som heter "Test". Två möbleringar kan inte heta lika.');

             // Check that redirection was NOT called
             expect(FurnituringEditCtrl.redirectToListPage).not.toHaveBeenCalled();
         }));

         it('should create a FlashMessage after unsuccessful Furnituring editing', inject(function($rootScope, $controller, _Furnituring_, $q) {

             // Alter save to return unsuccessful response
             _Furnituring_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '500');
             });

             // Spy on existing controller method
             spyOn(FurnituringEditCtrl, 'redirectToListPage');

             // Mock scope variable
             $scope.furnituring = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när möbleringen skulle sparas');

             // Check that redirection was NOT called
             expect(FurnituringEditCtrl.redirectToListPage).not.toHaveBeenCalled();
         }));

         it('should create a FlashMessage after unsuccessful Furnituring editing (furnituring deleted)', inject(function($rootScope, $controller, _Furnituring_, $q) {

             // Alter save to return unsuccessful response
             _Furnituring_.save = jasmine.createSpy('save').andCallFake(function() {

                 // Generate a promise object for mocked return data.
                 return TestHelper.addPromiseToObject({}, $q, '404');
             });

             // Spy on existing controller method
             spyOn(FurnituringEditCtrl, 'redirectToListPage');

             // Mock scope variable
             $scope.furnituring = { Name : 'Test' };

             // Exec method to be tested
             $scope.save();

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage.message).toEqual('Möbleringen "Test" existerar inte längre. Hann kanske någon radera den?');

             // Check that redirection was NOT called
             expect(FurnituringEditCtrl.redirectToListPage).toHaveBeenCalled();
         }));

     // Tests END
     });


});