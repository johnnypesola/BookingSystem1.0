/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: inputMaxPeopleDirective', function() {

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
    var inputMaxPeopleElement;
    var inputMaxPeopleController;

    // Compile directive
    beforeEach(inject(function($controller, $rootScope, $compile, _$q_) {

        q = _$q_;

        // Bind scope to rootscope
        $scope = $rootScope;

        // Define testmodel
        $scope.testmodel = 10;
        $scope.testMaxPeople = 20;

        // Markup the page header buttons
        var inputMaxPeopleElem = angular.element('<input-max-people use-model="testmodel" max-people="testMaxPeople" />');

        // Compile
        inputMaxPeopleElement = $compile(inputMaxPeopleElem)($scope);

        $scope.$digest();

        // Get the controller
        inputMaxPeopleController = inputMaxPeopleElement.controller("inputMaxPeople");

        // Rebind scope to the elements isolated scope.
        $scope = inputMaxPeopleElement.isolateScope();
    }));

    // Tests START
    it('should have correct values after init', function(){

        // Check values
        expect($scope.model).toEqual(10);
        expect($scope.maxPeople).toEqual(20);
    });

    it('should set "model value" to 0 if model value is > max people', function(){

        // Change value
        $scope.maxPeople = 1;

        $scope.$digest();

        // Check values
        expect($scope.model).toEqual(0);
    });

});