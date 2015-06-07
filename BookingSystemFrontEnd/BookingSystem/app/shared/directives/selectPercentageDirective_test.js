/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: percentageDirective', function() {

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
    var percentageElement;
    var percentageController;

    // Compile directive
    beforeEach(inject(function($controller, $rootScope, $compile, _$q_) {

        q = _$q_;

        // Bind scope to rootscope
        $scope = $rootScope;

        // Define testmodel
        $scope.testmodel = 0;

        // Markup the page header buttons
        var percentageElem = angular.element('<select-percentage use-model="testmodel"></page-header-buttons>');

        // Compile
        percentageElement = $compile(percentageElem)($scope);

        $scope.$digest();

        // Get the controller
        percentageController = percentageElement.controller("percentage");

        // Rebind scope to the elements isolated scope.
        $scope = percentageElement.isolateScope();
    }));

    // Tests START
    it('should have correct menu values after init', function(){

        var i, testPercentageRangeArray = [];

        // Build up test array
        for(i = 0; i <= 100; i++){
            testPercentageRangeArray.push({
                name: i + '%',
                value: (i / 100)
            });
        }

        // Should be equal to testarray
        expect($scope.percentageRange).toEqual(testPercentageRangeArray);
    });
});