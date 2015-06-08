/**
 * Created by jopes on 2015-05-20.
 */

(function(){

    // Shared functions
    var isValueEmpty = function(value) {
        return angular.isUndefined(value) || value === '' || value === null || value !== value;
    };

    // Declare module
    angular.module('bookingSystem.commonDirectives',

        // Dependencies
        [])

        .directive('pageHeaderButtons', ["$location", function($location) {
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
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

                    var that = this;

                    that.testmethod = function(){};

                    $scope.anotherTest = function(){};

                    /* Initialization START */

                    // Get type of object to redirect to
                    $scope.objectType = $location.path().split('/')[1];

                    $scope.activePage = $location.path().split('/')[2];

                    /* Initialization END */

                }]
            };
        }])

        .directive('selectPercentage', function() {
            return {
                restrict: 'E',
                replace: true,
                template: '<select ng-model="model" ng-options="percentage.value as percentage.name for percentage in percentageRange"></select>',
                scope: {
                    model: '=useModel'
                },
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                    var i;
                    $scope.percentageRange = [];

                    /* Initialization START */

                        $scope.model = $scope.model || 0;

                        for(i = 0; i <= 100; i++){
                            $scope.percentageRange.push({
                                name: i + '%',
                                value: (i / 100)
                            })
                        }

                    /* Initialization END */
                }]
            };
        })

        .directive('selectMaxPeople', ["OPTIONS_MAX_PEOPLE", function(OPTIONS_MAX_PEOPLE) {
            return {
                restrict: 'E',
                require: 'ngModel',
                replace: true,
                template: '<div><span ng-show="isErrorVisible">Max {{maxPeopleOptions}}</span><select ng-model="model" ng-options="maxPeople for maxPeople in maxPeopleRange"></select></div>',
                scope: {
                    model: '=useModel',
                    maxPeopleOptions: '=maxPeopleOptions'
                },
                link: function(scope, elem, attr, ctrl) {
                    var i,
                        that = this;

                    scope.isErrorVisible = false;

                    that.generateOptions = function(){

                        scope.maxPeopleRange = [];

                        for(i = 0; i <= OPTIONS_MAX_PEOPLE; i++){
                            scope.maxPeopleRange.push(i);
                        }
                    };

                    /* Initialization START */

                        scope.model = scope.model || 0;

                        scope.$watch('maxPeopleOptions', function(){

                            if(scope.model > scope.maxPeopleOptions){
                                scope.isErrorVisible = true;
                                ctrl.$setValidity('maxPeopleOutOfRange', false);
                            }
                            else {
                                scope.isErrorVisible = false;
                                ctrl.$setValidity('maxPeopleOutOfRange', true);
                            }
                        });

                        scope.$watch('model', function(){

                            if(scope.model > scope.maxPeopleOptions){
                                scope.isErrorVisible = true;
                                ctrl.$setValidity('maxPeopleOutOfRange', false);
                            }
                            else {
                                scope.isErrorVisible = false;
                                ctrl.$setValidity('maxPeopleOutOfRange', true);
                            }
                        });

                        that.generateOptions();

                    /* Initialization END */
                }
            };
        }])

        .directive('inputMaxPeople', function() {
            return {
                restrict: 'E',
                replace: true,
                template: '<div><input type="number" ng-model="model" min="0" max="{{maxPeople}}">{{maxPeople}}</div>',
                scope: {
                    model: '=useModel',
                    maxPeople: '=maxPeople'
                },
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                    var i, that = this;

                    /* Initialization START */

                    $scope.model = $scope.model || 0;

                    if($scope.model > $scope.maxPeople){
                        $scope.model = 0;
                    }

                    $scope.$watch('maxPeople', function(){

                        if($scope.model > $scope.maxPeople){
                            $scope.model = 0;
                        }
                    });

                    /* Initialization END */
                }]
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

        .directive('itemActionButtons', ["$location", function($location) {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: 'shared/directives/itemActionButtons.html',
                scope: {
                    id: '=itemActionButtons',
                    objectType: '@objectType',
                    bookingType: '@bookingType',
                    renderDeleteIcon: '=?renderDeleteIcon',
                    renderEditIcon: '=?renderEditIcon',
                    renderShowIcon: '=?renderShowIcon',
                    renderBookIcon: '=?renderBookIcon'
                },
                link: function(){

                },
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

                    /* Declare variables START */

                        var that = this;

                    /* Declare variables END */

                    /* Private methods START */

                        that.initVariables = function(){

                            $scope.renderDeleteIcon = $scope.renderDeleteIcon || true;
                            $scope.renderEditIcon = $scope.renderEditIcon || true;
                            $scope.renderShowIcon = $scope.renderShowIcon || true;
                            $scope.renderBookIcon = $scope.renderBookIcon || false;
                        };

                        that.bindEvents = function(){

                            $element.bind('click', function(event) {
                                $scope.actionsvisible = true;
                                $scope.$digest();
                            });

                            $element.bind('mouseleave', function(event){
                                $scope.actionsvisible = false;
                                $scope.$digest();
                            });
                        };


                        that.getObjectType = function(){

                            return (typeof $scope.objectType !== 'undefined' ? $scope.objectType : $location.path().split('/')[1])
                        };

                    /* Private methods END */

                    /* Public methods START */

                        $scope.redirectToDeletePage = function(){

                            // Clear eventual url parameters
                            $location.url($location.path());

                            $location.path( that.getObjectType() + "/radera/" + $scope.id );
                        };

                        $scope.redirectToEditPage = function(){

                            // Clear eventual url parameters
                            $location.url($location.path());

                            $location.path( that.getObjectType() + "/redigera/" + $scope.id );
                        };

                        $scope.redirectToShowPage = function(){

                            // Clear eventual url parameters
                            $location.url($location.path());

                            $location.path( that.getObjectType() + "/visa/" + $scope.id );
                        };

                        $scope.redirectToBookingPage = function(){

                            // Clear eventual url parameters
                            $location.url($location.path());

                            $location.path( $scope.bookingType + "/skapa" );
                            $location.search( "lokal-id", $scope.id );
                        };

                    /* Public methods END */

                    /* Initialization START */

                        that.bindEvents();

                        that.initVariables();

                    /* Initialization END */

                }]
            };
        }])

        .directive('backButton', function() {
            return {
                restrict: 'A',
                link: function (scope, element) {

                    // Go one step back on click
                    element[0].addEventListener('click', function(){
                        history.back();
                    });
                }
            }
        })

        .directive('addToContentButton', ["$location", function($location) {
            return {
                restrict: 'A',
                replace: true,
                template: '<a href="" ng-click="redirect()" class="add-to-content-button">+</a>',
                scope: {
                    addArgument: '=addArgument',
                    objectType: '@addToContentButton'
                },
                link: function(){

                },
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

                    $scope.redirect = function(){

                        $location.path( $scope.objectType + "/skapa/" + $scope.addArgument );
                    };
                }]
            };
        }])

        .directive('stopParentEvent', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    element.bind(attr.stopParentEvent, function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                    });
                }
            };
        })

        .directive('ngMin', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elem, attr, ctrl) {
                    scope.$watch(attr.ngMin, function(){
                        ctrl.$setViewValue(ctrl.$viewValue);
                    });
                    var minValidator = function(value) {
                        var min = scope.$eval(attr.ngMin) || 0;
                        if (!isValueEmpty(value) && value < min) {
                            ctrl.$setValidity('ngMin', false);
                            return undefined;
                        } else {
                            ctrl.$setValidity('ngMin', true);
                            return value;
                        }
                    };

                    ctrl.$parsers.push(minValidator);
                    ctrl.$formatters.push(minValidator);
                }
            };
        })

        .directive('ngMax', function() {
                return {
                    restrict: 'A',
                    require: 'ngModel',
                    link: function (scope, elem, attr, ctrl) {

                        function isEmpty(value) {
                            return angular.isUndefined(value) || value === '' || value === null || value !== value;
                        }

                        scope.$watch(attr.ngMax, function () {
                            ctrl.$setViewValue(ctrl.$viewValue);
                        });
                        var maxValidator = function (value) {
                            var max = scope.$eval(attr.ngMax) || Infinity;
                            if (!isValueEmpty(value) && value > max) {
                                ctrl.$setValidity('ngMax', false);
                                return undefined;
                            } else {
                                ctrl.$setValidity('ngMax', true);
                                return value;
                            }
                        };

                        ctrl.$parsers.push(maxValidator);
                        ctrl.$formatters.push(maxValidator);
                    }
                }
        })

        .directive('validateDateTime', function () {
            return {
                restrict: 'E',
                require: 'ngModel',
                link: function (scope, element, attr, ctrl) {

                    var validateDateTime;

                    validateDateTime = function(){
                        var StartDateObj, EndDateObj;

                        // Check that all dates variables are defined
                        if(
                            typeof scope.StartDate !== 'undefined' &&
                            typeof scope.StartTime !== 'undefined' &&
                            typeof scope.EndDate !== 'undefined' &&
                            typeof scope.EndTime !== 'undefined'
                        ){
                            // Convert to date objects
                            StartDateObj = moment(scope.StartDate + " " + scope.StartTime).toDate();
                            EndDateObj = moment(scope.EndDate + " " + scope.EndTime).toDate();

                            if (EndDateObj > StartDateObj){

                                ctrl.$setValidity('dateTimeOutOfRange', true);
                            }
                            else {

                                ctrl.$setValidity('dateTimeOutOfRange', false);
                            }
                        }
                    };

                    // Add watches to all Date and Time input fields
                    scope.$watch('StartDate', function(newValue, oldValue){
                        validateDateTime();
                    }, true); //enable deep dirty checking
                    scope.$watch('StartTime', function(newValue, oldValue){
                        validateDateTime();
                    }, true); //enable deep dirty checking
                    scope.$watch('EndDate', function(newValue, oldValue){
                        validateDateTime();
                    }, true); //enable deep dirty checking
                    scope.$watch('EndTime', function(newValue, oldValue){
                        validateDateTime();
                    }, true); //enable deep dirty checking
                }
            };
        });
})();