/**
 * Created by jopes on 2015-04-27.
 */


describe('module: bookingSystem.header HeaderCtrl', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.header'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var HeaderCtrl;
    var testCurrentDateObj;
    var $scope;
    var $location;


    // Init root test variables
    beforeEach(inject(function($controller, _$location_) {
        $location = _$location_;
        $scope = {};

        HeaderCtrl = $controller('HeaderCtrl', {
            $scope: $scope
        });
    }));

    // Actual tests
    describe('HeaderCtrl controller', function(){
        it('should have correct scope variables', inject(function($controller) {
            expect($scope.menus).toBeDefined();

            expect($scope.menus[0].title).toBeDefined();

            expect($scope.menus[0].title).toEqual("Start");

        }));

        // Tests END
    });


});

describe('module: bookingSystem.header FlashMessageCtrl', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.header'));
    beforeEach(module('bookingSystem.commonFilters'));

    // Root variables
    var FlashMessageCtrl;
    var $scope;
    var $location;


    // Init root test variables
    beforeEach(inject(function($controller, _$location_) {
        $location = _$location_;
        $scope = {};

        FlashMessageCtrl = $controller('FlashMessageCtrl', {
            $scope: $scope
        });
    }));

    // Actual tests
    describe('FlashMessageCtrl controller', function(){

        it('should have correct scope variables after hideMessage() method', inject(function($controller) {
            $scope.hideMessage();
            expect($scope.messageVisible).toEqual(false);
        }));

        it('should have correct scope variables after $rootScope.FlashMessage object is defined with "error"', inject(function($rootScope, $controller) {
            // Set rootscope flashmessage object
            $rootScope.FlashMessage = {
                type: 'error',
                message: 'error message'
            };

            $rootScope.$digest();

            expect($scope.messageText).toEqual('error message');
            expect($scope.messageVisible).toEqual(true);

        }));

        it('should have correct scope variables after $rootScope.FlashMessage object is defined with "success"', inject(function($rootScope, $controller) {
            // Set rootscope flashmessage object
            $rootScope.FlashMessage = {
                type: 'success',
                message: 'success message'
            };

            $rootScope.$digest();

            expect($scope.messageText).toEqual('success message');
            expect($scope.messageVisible).toEqual(true);

        }));

        it('should have correct scope variables after $rootScope.FlashMessage object is defined with "warning"', inject(function($rootScope, $controller) {
            // Set rootscope flashmessage object
            $rootScope.FlashMessage = {
                type: 'warning',
                message: 'warning message'
            };

            $rootScope.$digest();

            expect($scope.messageText).toEqual('warning message');
            expect($scope.messageVisible).toEqual(true);

        }));

        it('should have correct scope variables after $rootScope.FlashMessage object is defined with empty object', inject(function($rootScope, $controller) {
            // Set rootscope flashmessage object
            $rootScope.FlashMessage = {};

            $rootScope.$digest();

            expect($scope.messageText).toBeUndefined();
            expect($scope.messageVisible).toBeUndefined();

        }));

        // Tests END
    });




});