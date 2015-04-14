/**
 * Created by jopes on 2015-04-13.
 */

(function() {
    var filters = angular.module('bookingSystem.customFilters', []);

    // Custom filters
    filters.filter('kr', function () {
        return function (text) {
            text = text.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
            var t = text + ' kr';
            return t;
        };
    });

    filters.filter('percentage', ['$filter', function ($filter) {
        return function (input, decimals) {
            return $filter('number')(input * 100, decimals) + '%';
        };
    }]);
})();