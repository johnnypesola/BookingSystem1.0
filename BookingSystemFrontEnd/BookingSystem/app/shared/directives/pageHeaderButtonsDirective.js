/**
 * Created by jopes on 2015-05-07.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.pageHeaderButtonsDirective',

        // Dependencies
        [])

        .directive('pageHeaderButtons', function($route, $routeParams, $location) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'shared/directives/pageHeaderButtons.html',
                scope: {
                    showList: '=showList',
                    showCalendar: '=showCalendar',
                    showMap: '=showMap',
                    showAdd: '=showAdd',
                    showSearch: '=showSearch'
                },
                controller: function($scope, $element, $attrs) {

                    /* Initialization START */

                        // Get type of object to redirect to
                        $scope.objectType = $location.path().split('/')[1];

                        $scope.activePage = $location.path().split('/')[2];

                    /* Initialization END */

                }
            };
        });

    /*

     .directive('itemActionButtonDelete', function() {
     return {
     restrict: 'A',
     replace: true,
     templateUrl: 'shared/directives/itemActionButtons.html',
     scope: true,
     link: function(){

     },
     controller: function($scope, $element, $attrs) {

     $element.bind('click', function (event) {

     });
     }
     }
     })

     */
})();
