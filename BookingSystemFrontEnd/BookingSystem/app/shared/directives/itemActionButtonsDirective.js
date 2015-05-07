/**
 * Created by jopes on 2015-04-16.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.itemActionButtonsDirective',

        // Dependencies
        [])

        .directive('itemActionButtons', function($route, $routeParams, $location) {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'shared/directives/itemActionButtons.html',
                scope: {
                    id: '=itemActionButtons'
                },
                link: function(){

                },
                controller: function($scope, $element, $attrs) {

                    $element.bind('click', function(event) {
                        $scope.actionsvisible = true;
                        $scope.$digest();
                    });

                    $element.bind('mouseleave', function(event){
                        $scope.actionsvisible = false;
                        $scope.$digest();
                    });

        /* Declare variables START */

        /* Declare variables END */

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

                    $scope.redirectToDeletePage = function(){

                        var objectType;

                        // Get type of object to redirect to
                        objectType = $location.path().split('/')[1];

                        $location.path( objectType + "/radera/" + $scope.id );
                    };

                    $scope.redirectToEditPage = function(){

                        var objectType;

                        // Get type of object to redirect to
                        objectType = $location.path().split('/')[1];

                        $location.path( objectType + "/redigera/" + $scope.id );
                    };

                    $scope.redirectToShowPage = function(){

                        var objectType;

                        // Get type of object to redirect to
                        objectType = $location.path().split('/')[1];

                        $location.path( objectType + "/visa/" + $scope.id );
                    };

        /* Public methods END */

        /* Initialization START */

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
