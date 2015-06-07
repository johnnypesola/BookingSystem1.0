/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: pageHeaderButtonsDirective', function() {

    // Load modules
    beforeEach(module('bookingSystem.commonFilters'));
    beforeEach(module('bookingSystem.commonDirectives'));

    // Load template
    //beforeEach(module('ngResource'));
    beforeEach(module('templates'));

    // Root variables
    var testCurrentDateObj;
    var $scope;
    var q;
    var $location;
    var pageHeaderButtonsElement;
    var pageHeaderButtonsController;

    // Compile directive
    beforeEach(inject(function($controller, $rootScope, $compile, _$q_, _$location_) {

        testCurrentDateObj = new Date();
        $location = _$location_;
        q = _$q_;

        // Mock location
        spyOn($location, 'path').andReturn('/lokaler/lista');

        // Bind scope to rootscope
        $scope = $rootScope;

        // Markup the page header buttons
        var pageHeaderButtonsElem = angular.element('<page-header-buttons show-list="true" show-calendar="true" show-map="true" show-add="true" show-search="true"></page-header-buttons>');
        // Compile
        pageHeaderButtonsElement = $compile(pageHeaderButtonsElem)($scope);

        $scope.$digest();

        // Get the controllers
        pageHeaderButtonsController = pageHeaderButtonsElement.controller("pageHeaderButtons");

        // Rebind scope to the elements isolated scope.
        $scope = pageHeaderButtonsElement.isolateScope();
    }));



    // Tests START
    it('should have correct values after init', function(){

        expect($scope.objectType).toEqual("lokaler");
        expect($scope.activePage).toEqual("lista");

    });
});