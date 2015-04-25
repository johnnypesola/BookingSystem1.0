/**
 * Created by jopes on 2015-04-24.
 */

describe('bookingSystem.booking module', function() {

    // Load app
    beforeEach(module('bookingSystem'));



    // Load modules
    beforeEach(module('bookingSystem.booking'));
/*

    beforeEach(module('bookingSystem.bookingServices'));
    beforeEach(module('bookingSystem.customFilters'));
    beforeEach(module('bookingSystem.calendarDirective'));
*/



    beforeEach(inject(function($rootScope, _$location_) {
        $scope = $rootScope.$new();
        $location = _$location_;

        Booking = {};
    }));


    describe('BookingCtrl controller', function(){

    it('should ....', inject(function($controller, Booking) {

    }));

    });


});
