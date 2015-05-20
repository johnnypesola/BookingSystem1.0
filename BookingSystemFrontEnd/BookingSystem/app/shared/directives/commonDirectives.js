/**
 * Created by jopes on 2015-05-20.
 */


(function(){
    // Declare module
    angular.module('bookingSystem.commonDirectives',

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
        })

        .directive('selectPercentage', function($route, $routeParams, $location) {
            return {
                restrict: 'E',
                replace: true,
                template: '<select ng-model="model" ng-options="percentage.value as percentage.name for percentage in percentageRange"></select>',
                scope: {
                    model: '=useModel'
                },
                controller: function($scope, $element, $attrs) {
                    var i;
                    $scope.percentageRange = [];

                    /* Initialization START */

                        $scope.model = $scope.model || 0;

                        for(i = 0; i <= 100; i++){
                            $scope.percentageRange.push({
                                name: i + '%',
                                value: i
                            })
                        }

                    /* Initialization END */
                }
            };
        })

        .directive('loading',   ['$http' ,function ($http)
        {
            return {
                restrict: 'A',
                link: function (scope, elm, attrs)
                {
                    // Method for checking if http has pending ajax requests. Return status.
                    scope.isLoading = function () {
                        return $http.pendingRequests.length > 0;
                    };

                    // Add watch on isLoading method. Show element if true
                    scope.$watch(scope.isLoading, function (v)
                    {
                        if(v){
                            scope.showPreLoader = true;
                        }else{
                            scope.showPreLoader = false;
                        }
                    });
                }
            };
        }])

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


})();