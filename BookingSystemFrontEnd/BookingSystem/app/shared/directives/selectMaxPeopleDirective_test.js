/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: selectMaxPeopleDirective', function() {

    // Load app
    //beforeEach(module('bookingSystem'));

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
    var selectMaxPeopleElement;
    var selectMaxPeopleController;

    // Mock Dependencies
    beforeEach(function () {
        module(function ($provide) {
            $provide.constant('OPTIONS_MAX_PEOPLE', 100);
        })
    });

    // Compile directive
    beforeEach(inject(function($controller, $rootScope, $compile, _$q_) {

        q = _$q_;

        // Bind scope to rootscope
        $scope = $rootScope;

        // Define testmodel
        $scope.testmodel = 10;
        $scope.testMaxPeopleOptions = 20;

        // Markup the page header buttons
        var selectMaxPeopleElem = angular.element('<select-max-people ng-model="testmodel" use-model="testmodel" max-people-options="testMaxPeopleOptions"></select-max-people>');

        // Compile
        selectMaxPeopleElement = $compile(selectMaxPeopleElem)($scope);

        $scope.$digest();

        // Get the controller
        selectMaxPeopleController = selectMaxPeopleElement.controller("selectMaxPeople");

        // Rebind scope to the elements isolated scope.
        $scope = selectMaxPeopleElement.isolateScope();
    }));

    // Tests START
    it('should have correct values after init', function(){

        // Check that directive uses OPTIONS_MAX_PEOPLE constant
        expect($scope.maxPeopleRange.length - 1).toEqual(100);
    });

    it('should have correct values after watched model is changed above maximum allowed value', function(){

        // Change watched values
        $scope.model = 20000;

        $scope.$digest();

        // Check that watch works
        expect($scope.isErrorVisible).toEqual(true);
    });

    it('should have correct values after watched model is changed above maximum allowed value', function(){

        // Change watched values
        $scope.maxPeopleOptions = 1;

        $scope.$digest();

        // Check that watch works
        expect($scope.isErrorVisible).toEqual(true);
    });
});