/**
 * Created by jopes on 2015-04-12.
 */




var BookingSystem = angular.module('bookingSystem', ['ngRoute']);
BookingSystem.config(function($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'components/start/startView.html',
            controller: 'BookingsController'
        }).
        otherwise({
            redirectTo: '/brax'
        });
});

