/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: validateDateTimeDirective', function() {

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
    var form;
    var validateDateTimeElement;
    var validateDateTimeController;

    // Compile directive
    beforeEach(inject(function($controller, $rootScope, $compile, _$q_) {

        q = _$q_;

        // Bind scope to rootscope
        $scope = $rootScope;

        // Define testmodel
        $scope.StartDate = "2015-06-06";
        $scope.StartTime = "12:00";
        $scope.EndDate = "2015-06-07";
        $scope.EndTime = "13:00";

        // Markup the page header buttons
        var validateDateTimeElem = angular.element(
            '<form name="form">' +
                '<validate-date-time ng-model="$scope"></validate-date-time>' +
            '</form>'
        );

        // Compile
        validateDateTimeElement = $compile(validateDateTimeElem)($scope);

        form = $scope.form;

        // Get the controller
        validateDateTimeController = validateDateTimeElement.controller("validateDateTime");

        // Rebind scope to the elements isolated scope.
        $scope = validateDateTimeElement.scope();
    }));

    // Tests START
    it('should have correct values after init', function(){

        // Check values
        expect($scope.StartDate).toEqual("2015-06-06");
        expect($scope.StartTime).toEqual("12:00");

        expect($scope.EndDate).toEqual("2015-06-07");
        expect($scope.EndTime).toEqual("13:00");

        // Form should be valid
        expect(form.$valid).toEqual(true);
    });

    it('should have set invalid validity for dateTimeOutOfRange if StartDateTime > EndDateTime', function(){

        // Form should be valid
        expect(form.$valid).toEqual(true);

        // Set invalid start date.
        $scope.StartDate = "2015-06-08";

        $scope.$digest();

        // Form should not be valid
        expect(form.$valid).toEqual(false);

        // Set valid start date.
        $scope.StartDate = "2015-06-05";

        $scope.$digest();

        // Form should be valid
        expect(form.$valid).toEqual(true);
    });
});