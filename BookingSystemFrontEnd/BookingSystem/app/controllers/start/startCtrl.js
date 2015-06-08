/**
 * Created by jopes on 2015-04-12.
 */

(function(){

    // Declare module
    angular.module('bookingSystem.startPage',

        // Dependencies
        [
            'bookingSystem.bookingServices',
            'bookingSystem.commonFilters'
        ]
    )

    // Routes for startPage
    .config(["$routeProvider", function($routeProvider) {

    }])

    // Controller
    .controller('StartCtrl', ["$rootScope", "$scope", "Booking", "$q", "Location", function($rootScope, $scope, Booking, $q, Location){

            var that = this;

        /* Private methods START */

            // Check if there are any empty bookings
            that.getEmptyBookings = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                $scope.emptyBookings = Booking.countEmpty();

                $scope.emptyBookings.$promise.then(function(){

                    // Resolve promise
                    deferred.resolve();
                });

                $scope.emptyBookings.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Tomma bokningstillfällen kunde inte hämtas, var god försök igen.'
                    };
                });

                return promise;
            };

            that.getBookingsForToday = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                $scope.bookingsForToday = Booking.queryMoreForPeriod(
                    {
                        fromDate: that.todayDate,
                        toDate: that.todayDate
                    }
                );

                // Success
                $scope.bookingsForToday.$promise.then(function(){

                    $scope.noBookingsForTodayFound = !$scope.bookingsForToday.length;

                    // Resolve promise
                    deferred.resolve();
                });

                // Something went wrong
                $scope.bookingsForToday.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Dagens bokningstillfällen kunde inte hämtas, var god försök igen.'
                    };
                });

                return promise;
            };

            that.getFreeLocationsForToday = function(){

                var deferred = $q.defer(),
                    promise = deferred.promise;

                $scope.locationsFreeForToday = Location.queryFreeForPeriod(
                    {
                        fromDate: that.todayDate,
                        toDate: that.todayDate
                    }
                );

                // Success
                $scope.locationsFreeForToday.$promise.then(function(){

                    $scope.noLocationsFreeForTodayFound = !$scope.locationsFreeForToday.length;

                    // Resolve promise
                    deferred.resolve();
                });

                // Something went wrong
                $scope.locationsFreeForToday.$promise.catch(function(){

                    $rootScope.FlashMessage = {
                        type: 'error',
                        message: 'Lediga lokaler för idag kunde inte hämtas, var god försök igen.'
                    };
                });

                return promise;
            };

        /* Private methods END */

        /* Public methods START */
        /* Public methods END */

        /* Initialization START */

            that.todayDate = moment().format('YYYY-MM-DD');

            // Get data
            that.getEmptyBookings()

                .then(function() {

                    that.getBookingsForToday()

                        .then(function(){
                            that.getFreeLocationsForToday();
                        }
                    )
                }
            );

        /* Initialization END */

    }]);
})();



