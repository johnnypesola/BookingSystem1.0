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

        .directive('selectPercentage', function() {
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

        .directive('selectMaxPeople', function(OPTIONS_MAX_PEOPLE) {
            return {
                restrict: 'E',
                replace: true,
                template: '<div><span ng-show="isErrorVisible">Max {{maxPeopleOptions}}</span><select ng-model="model" ng-options="maxPeople for maxPeople in maxPeopleRange"></select></div>',
                scope: {
                    model: '=useModel',
                    maxPeopleOptions: '=maxPeopleOptions'
                },
                controller: function($scope, $element, $attrs) {
                    var i,
                        that = this;

                    $scope.isErrorVisible = false;

                    that.generateOptions = function(){

                        $scope.maxPeopleRange = [];

                        for(i = 0; i <= OPTIONS_MAX_PEOPLE; i++){
                            $scope.maxPeopleRange.push(i);
                        }
                    };

                /* Initialization START */

                    $scope.model = $scope.model || 0;

                    $scope.$watch('maxPeopleOptions', function(){
                        $scope.isErrorVisible = $scope.model > $scope.maxPeopleOptions;

                        //that.generateOptions();
                    });

                    $scope.$watch('model', function(){
                        $scope.isErrorVisible = $scope.model > $scope.maxPeopleOptions;
                    });

                    that.generateOptions();

                /* Initialization END */
                }
            };
        })

        .directive('inputMaxPeople', function() {
            return {
                restrict: 'E',
                replace: true,
                template: '<div><input type="number" ng-model="model" min="0" max="{{maxPeople}}">{{maxPeople}}</div>',
                scope: {
                    model: '=useModel',
                    maxPeople: '=maxPeople'
                },
                controller: function($scope, $element, $attrs) {
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
        })

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

        .directive('validateDateTime', function () {
            return {
                restrict: 'E',
                require: 'ngModel',
                link: function (scope, element, attr, ctrl) {

                    var validateDateTime = function(){
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

            ////////
/*
                link: function(scope, elem, attr, ctrl) {
                    scope.$watch(attr.shareValidate, function(newArr, oldArr) {
                        var sum = 0;
                        angular.forEach(newArr, function(entity, i) {
                            sum += entity.share;
                        });
                        if (sum === 100) {
                            ctrl.$setValidity('share', true);
                            scope.path.offers.invalidShares = false;
                        }
                        else {
                            ctrl.$setValidity('share', false);
                            scope.path.offers.invalidShares = true;
                        }
                    }, true); //enable deep dirty checking
                }


            /////////

            return {
                // restrict to an attribute type.
                restrict: 'A',

                // element must have ng-model attribute.
                require: 'ngModel',

                // scope = the parent scope
                // elem = the element the directive is on
                // attr = a dictionary of attributes on the element
                // ctrl = the controller for ngModel.
                link: function(scope, elem, attr, ctrl) {

                    //get the regex flags from the regex-validate-flags="" attribute (optional)
                    var flags = attr.regexValidateFlags || '';

                    // create the regex obj.
                    var regex = new RegExp(attr.regexValidate, flags);

                    // add a parser that will process each time the value is
                    // parsed into the model when the user updates it.
                    ctrl.$parsers.unshift(function(value) {
                        // test and set the validity after update.
                        var valid = regex.test(value);
                        ctrl.$setValidity('regexValidate', valid);

                        // if it's valid, return the value to the model,
                        // otherwise return undefined.
                        return valid ? value : undefined;
                    });

                    // add a formatter that will process each time the value
                    // is updated on the DOM element.
                    ctrl.$formatters.unshift(function(value) {
                        // validate.
                        ctrl.$setValidity('regexValidate', regex.test(value));

                        // return the value or nothing will be written to the DOM.
                        return value;
                    });
                }
            };
            */
        });


})();