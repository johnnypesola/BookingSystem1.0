/**
 * Created by jopes on 2015-04-28.
 */

describe('filter: commonFilters', function () {

    var $filter;

    // Load app
    beforeEach(module('bookingSystem'));

    // Load modules
    beforeEach(module('bookingSystem.commonFilters'));

    beforeEach(function () {
        inject(function (_$filter_) {
            $filter = _$filter_;
        });
    });

    it('should display correct percentage', function () {

        // Define testvalue
        var testValue = 0.55;

        // Use filter
        var result = $filter('percentage')(testValue);

        // Check result
        expect(result).toBe('55%');
    });

    it('should display correct boolean', function () {

        // Use filter
        var trueResult = $filter('boolean')(true);
        var falseResult = $filter('boolean')(false);

        // Check result
        expect(trueResult).toBe('Ja');
        expect(falseResult).toBe('Nej');
    });

    it('should display correct count', function () {

        // Define testvalue
        var testValue = 30;

        // Use filter
        var result = $filter('count')(testValue);

        // Check result
        expect(result).toBe('30 st');
    });

    it('should display correct kr', function () {

        // Define testvalue
        var testValue = 300000;

        // Use filter
        var result = $filter('kr')(testValue);

        // Check result
        expect(result).toBe('300 000 kr');
    });

    it('should display correct bookingType', function () {
        // Define testvalue
        var testValue = 'Resource';

        // Use filter
        var resourceResult = $filter('bookingType')('Resource');
        var mealResult = $filter('bookingType')('Meal');
        var locationResult = $filter('bookingType')('Location');

        var wrongResult = $filter('bookingType')('Wrong');

        // Check result
        expect(resourceResult).toBe('Resurs');
        expect(mealResult).toBe('Måltid');
        expect(locationResult).toBe('Lokal/Plats');

        expect(wrongResult).toBe('Wrong');
    });



});