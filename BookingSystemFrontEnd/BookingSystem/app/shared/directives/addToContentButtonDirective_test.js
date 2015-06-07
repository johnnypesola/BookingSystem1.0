/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: addToContentButtonDirective', function() {

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
    var addToContentButtonElement;
    var addToContentButtonController;

    // Compile directive
    beforeEach(inject(function($controller, $rootScope, $compile, _$q_, _$location_) {

        testCurrentDateObj = new Date();
        $location = _$location_;
        q = _$q_;

        // Bind scope to rootscope
        $scope = $rootScope;

        // Mock id
        $scope.mockedId = 5;

        // Markup the page header buttons
        var addToContentButtonElem = angular.element('<a add-to-content-button="lokalbokningar" add-argument="mockedId"></a>');
        // Compile
        addToContentButtonElement = $compile(addToContentButtonElem)($scope);

        $scope.$digest();

        // Get the controllers
        addToContentButtonController = addToContentButtonElement.controller("addToContentButton");

        // Rebind scope to the elements isolated scope.
        $scope = addToContentButtonElement.isolateScope();
    }));


    // Tests START
    it('should redirect to correct page', function(){

        // Mock location
        spyOn($location, 'path');

        // Exec method
        $scope.redirect();

        expect($location.path).toHaveBeenCalledWith("lokalbokningar/skapa/5");
    });


});