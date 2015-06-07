/**
 * Created by jopes on 2015-04-26.
 */

describe('directive: itemActionButtonsDirective', function() {

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
    var itemActionButtonsElement;
    var itemActionButtonsController;

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
        var itemActionButtonsElem = angular.element('<div item-action-buttons="mockedId" object-type="platser" booking-type="lokalbokningar" render-delete-icon="true" render-edit-icon="true" render-show-icon="true" render-book-icon="true"></div>');
        // Compile
        itemActionButtonsElement = $compile(itemActionButtonsElem)($scope);

        $scope.$digest();

        // Get the controllers
        itemActionButtonsController = itemActionButtonsElement.controller("itemActionButtons");

        // Rebind scope to the elements isolated scope.
        $scope = itemActionButtonsElement.isolateScope();
    }));


    // Tests START
    it('should have correct values after init', function(){

        expect($scope.renderDeleteIcon ).toEqual(true);
        expect($scope.renderEditIcon).toEqual(true);
        expect($scope.renderShowIcon).toEqual(true);
        expect($scope.renderBookIcon).toEqual(true);
    });

    it('should redirect to delete page', function(){

        // Mock location
        spyOn($location, 'path');

        // Execute method
        $scope.redirectToDeletePage();

        expect($location.path).toHaveBeenCalledWith("platser/radera/5");
    });

    it('should redirect to edit page', function(){

        // Mock location
        spyOn($location, 'path');

        // Execute method
        $scope.redirectToEditPage();

        expect($location.path).toHaveBeenCalledWith("platser/redigera/5");
    });

    it('should redirect to show page', function(){

        // Mock location
        spyOn($location, 'path');

        // Execute method
        $scope.redirectToShowPage();

        expect($location.path).toHaveBeenCalledWith("platser/visa/5");
    });

    it('should redirect to booking page', function(){

        // Mock location
        spyOn($location, 'path');

        // Execute method
        $scope.redirectToBookingPage();

        expect($location.path).toHaveBeenCalledWith("lokalbokningar/skapa");
    });

    it('should make action icons visible after click and hide them after blur', function(){

        itemActionButtonsElement.triggerHandler('click');

        expect($scope.actionsvisible).toEqual(true);

        itemActionButtonsElement.triggerHandler('mouseout');

        expect($scope.actionsvisible).toEqual(false);
    });
});