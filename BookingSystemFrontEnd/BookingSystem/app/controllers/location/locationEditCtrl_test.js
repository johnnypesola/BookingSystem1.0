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

            $provide.factory('LocationFurnituring', function($q) {
                return {

                    queryForLocation : jasmine.createSpy('queryForLocation').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject(TestHelper.JSON.queryForLocation, $q);
                    }),

                    removeForLocation : jasmine.createSpy('removeForLocation').andCallFake(function() {

                        // Generate a promise object for mocked return data.
                        return TestHelper.addPromiseToObject({}, $q);
                    })
                }
            })
        });
    });

    // Shared testing function. avoid DRY

    // Init root test variables
    beforeEach(inject(function($controller, _Location_, _$location_, $rootScope) {
        $location = _$location_;
        $scope = $rootScope;

        LocationEditCtrl = $controller('LocationEditCtrl', {
            $scope: $scope,
            Location: _Location_,
            $rootScope: $rootScope
        });

    }));

    // Actual tests


     describe('LocationEditCtrl controller', function(){

         it('should call history.back() and create a FlashMessage after successful Location editing', inject(function($rootScope, $controller, _Location_, $routeParams) {

             // Spy on existing controller method
             spyOn(history, 'back');

             // Mock scope variable
             $scope.location = { Name : 'Test'};

             // Mock route parameter variable
             $routeParams.locationId = 4;

             // Exec method to be tested
             $scope.save();

             // Check that location was saved
             expect(_Location_.save).toHaveBeenCalledWith({
                LocationId: 4,
                Name: 'Test'
             });

             $scope.$digest();

             // Check that FlashMessage exists
             expect($rootScope.FlashMessage).toBeDefined();

             // Check that page was redirected was called
             expect(history.back).toHaveBeenCalled();
         }));

         it('should create a FlashMessage after duplicate Location editing', inject(function($rootScope, $controller, _Location_, $q) {

             // Alter save to return unsuccessful response
             _Location_.save = jasmine.createSpy('save').andCallFake(function() {

                 // Generate a promise object for mocked return data.
                 return TestHelper.addPromiseToObject({}, $q, '409', 'There is already a Location with the given name.');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Wait until location has been fetched and added to scope before proceeding
             LocationEditCtrl.location.$promise.then(function() {

                 // Mock scope variable
                 $scope.location = {Name: 'Test'};

                 // Exec method to be tested
                 $scope.save();

                 $scope.$digest();

                 //console.log($scope.location);

                 // Check that FlashMessage exists
                 expect($rootScope.FlashMessage).toBeDefined();

                 // Check that FlashMessage exists
                 expect($rootScope.FlashMessage.message).toEqual('Det finns redan en plats som heter "Test". Två platser kan inte heta lika.');

                 // Check that redirection was NOT called
                 expect(history.back).toHaveBeenCalled();

             });
         }));

         it('should create a FlashMessage after unsuccessful Location editing', inject(function($rootScope, $controller, _Location_, $q) {


             // Alter save to return unsuccessful response
             _Location_.save = jasmine.createSpy('save').andCallFake(function() {

             // Generate a promise object for mocked return data.
             return TestHelper.addPromiseToObject({}, $q, '500');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Wait until location has been fetched and added to scope before proceeding
             LocationEditCtrl.location.$promise.then(function(){

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
                 expect(history.back).toHaveBeenCalled();

             });

         }));

         it('should create a FlashMessage after unsuccessful Location editing (location deleted)', inject(function($rootScope, $controller, _Location_, $q) {

             // Alter save to return unsuccessful response
             _Location_.save = jasmine.createSpy('save').andCallFake(function() {

                 // Generate a promise object for mocked return data.
                 return TestHelper.addPromiseToObject({}, $q, '404');
             });

             // Spy on existing controller method
             spyOn(history, 'back');

             // Wait until location has been fetched and added to scope before proceeding
             LocationEditCtrl.location.$promise.then(function() {

                 // Mock scope variable
                 $scope.location = {Name: 'Test'};

                 // Exec method to be tested
                 $scope.save();

                 $scope.$digest();

                 // Check that FlashMessage exists
                 expect($rootScope.FlashMessage).toBeDefined();

                 // Check that FlashMessage exists
                 expect($rootScope.FlashMessage.message).toEqual('Platsen "Test" existerar inte längre. Hann kanske någon radera den?');

                 // Check that redirection was NOT called
                 expect(history.back).toHaveBeenCalled();
             });
         }));

     // Tests END
     });


});