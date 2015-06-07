/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: menuDirective', function() {

    // Load app
    beforeEach(module('bookingSystem'));

    // Dependencies
    beforeEach(module('ngRoute'));

    // Load modules
    beforeEach(module('bookingSystem.commonFilters'));
    beforeEach(module('bookingSystem.menuDirective'));


    // Load template
    //beforeEach(module('ngResource'));
    beforeEach(module('templates'));

    // Root variables
    var testCurrentDateObj;
    var $scope;
    var q;
    var $location;
    var mainMenuElement;
    var mainMenuController;
    var menusArray;
    var $route;
    var $routeParams;

    // Compile directive
    beforeEach(inject(function($route, $routeParams, $controller, $rootScope, $compile, _$q_, _$location_, $httpBackend) {

        // Mock response to http request generated from app.
        $httpBackend.expectGET('controllers/customer/customerList.html').respond(200);

        testCurrentDateObj = new Date();
        $location = _$location_;
        q = _$q_;

        // Mock location
        spyOn($location, 'path').andReturn('/kunder/lista');

        // Bind scope to rootscope
        $scope = $rootScope;

        $scope.flaps = {};

        // Mock menu items
        $scope.menusArray = TestHelper.JSON.MockedMenu;

        // Markup the page header buttons
        var mainMenuElem = angular.element('<main-menu menu-items="menusArray" page-flaps="flaps"></page-header-buttons>');
        // Compile
        mainMenuElement = $compile(mainMenuElem)($scope);

        $scope.$digest();

        // Get the controller
        mainMenuController = mainMenuElement.controller("mainMenu");

        // Rebind scope to the elements isolated scope.
        $scope = mainMenuElement.isolateScope();
    }));

    // Tests START
    it('should have correct menu values after init', function(){

        // Check if it contains correct menu in scope.
        expect($scope.menuItems).toEqual(TestHelper.JSON.MockedMenu);

        // Check if correct main menu is active.
        $scope.menuItems.forEach(function(menuItem, index){
            if(menuItem.title === "Kunder"){

                expect(menuItem.isMenuActive).toEqual(true);
                expect(menuItem.isFlapActive).toEqual(true);
            }
        });
    });

    it('should have correct values after click on main menu', function(){

        // Exec method
        $scope.selectMainMenu($scope.menuItems[0]);

        // Check if correct main menu is active.
        $scope.menuItems.forEach(function(menuItem, index){
            if(menuItem.title === "Start"){

                expect(menuItem.isMenuActive).toEqual(true);
                expect(menuItem.isSubMenusVisible).toEqual(true);
            }
        });
    });

    it('should have correct values after click on sub menu', function(){

        // Exec methods

        // Select main menu
        $scope.selectMainMenu($scope.menuItems[0]);

        // Select sub menu
        $scope.selectSubMenu ($scope.menuItems[0].submenus[0]);

        // Check if correct main menu is active.
        $scope.menuItems.forEach(function(menuItem, index){
            if(menuItem.title === "Start"){

                expect(menuItem.isMenuActive).toEqual(true);
                expect(menuItem.isSubMenusVisible).toEqual(false);
            }
        });
    });
});