/**
 * Created by jopes on 2015-04-24.
 */

describe('bookingSystem.bookingServices module', function() {

    // Mock a spy resource
    spyResource = function (name) {
        var resourceSpy = jasmine.createSpy(name + ' resource constructor').and.callFake(function () { angular.copy({}, this); });

        resourceSpy['get'] = resourceSpy.prototype['get'] = jasmine.createSpy('get');
        resourceSpy['$save'] = resourceSpy.prototype['$save'] = jasmine.createSpy('$save');
        resourceSpy['$delete'] = resourceSpy.prototype['$delete'] = jasmine.createSpy('$delete');

        return resourceSpy;
    };

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.bookingServices'));


    beforeEach(function () {
        angular.mock.inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');
            mockUserResource = $injector.get('User');
        })
    });

});