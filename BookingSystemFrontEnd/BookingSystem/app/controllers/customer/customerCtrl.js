/**
 * Created by jopes on 2015-05-17.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.customer',

        // Load Dependencies
        [
            'bookingSystem.customerServices',
            'bookingSystem.commonFilters',
            'bookingSystem.commonDirectives'
        ]
    )

    // Routes for startPage
    .config(["$routeProvider", function($routeProvider) {

    }])

    // Show Controller
    .controller('CustomerShowCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Customer", "PHOTO_MISSING_SRC", "API_IMG_PATH_URL", function($scope, $routeParams, $location, $rootScope, Customer, PHOTO_MISSING_SRC, API_IMG_PATH_URL){

        var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */


        /* Public methods END */


        /* Initialization START */

        $scope.customer = Customer.get(
            {
                customerId: $routeParams.customerId
            }
        );

        $scope.customer.$promise.then(function(){

                // Add path to imageSrc
                $scope.customer.ImageSrc = ($scope.customer.ImageSrc === "" ? PHOTO_MISSING_SRC : API_IMG_PATH_URL + $scope.customer.ImageSrc);
        })

            // In case customers cannot be fetched, display an error to user.
            .catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Kunden kunde inte hämtas, var god försök igen.'
                };

                $scope.customer = null;
            });

        /* Initialization END */
    }])

    // List Controller
    .controller('CustomerListCtrl', ["$scope", "Customer", "$rootScope", function($scope, Customer, $rootScope){

        /* Private methods START */


        /* Private methods END */



            /* Public methods START */


            /* Public methods END */

            /* Initialization START */

            var customers = Customer.query();

            // In case customer cannot be fetched, display an error to user.
            customers.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Kunder kunde inte hämtas, var god försök igen.'
                };
            });

            $scope.customers = customers;

            /* Initialization END */
    }])

    // Create Controller
    .controller('CustomerCreateCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Customer", "Redirect", "CustomerImage", function($scope, $routeParams, $location, $rootScope, Customer, Redirect, CustomerImage){

            var that = this;

        /* Private methods START */

            // Upload image
            that.uploadImage = function(CustomerId) {
                var customerImageHttp;

                customerImageHttp = CustomerImage.upload($scope.customer.ImageForUpload, CustomerId);

                return customerImageHttp;
            };

            // Display success message
            that.saveSuccess = function() {

                // Display success message
                $rootScope.FlashMessage = {
                    type: 'success',
                    message: 'Kunden "' + $scope.customer.Name + '" sparades med ett lyckat resultat'
                };

                // Redirect
                history.back();
            };

        /* Private methods END */

        /* Public methods START */

            // Save customer
            $scope.save = function(){

                // Save customer
                Customer.save(
                    {
                        CustomerId: 0,
                        Name: $scope.customer.Name,
                        Address: $scope.customer.Address,
                        PostNumber: $scope.customer.PostNumber,
                        City: $scope.customer.City,
                        EmailAddress: $scope.customer.EmailAddress,
                        PhoneNumber: $scope.customer.PhoneNumber,
                        CellPhoneNumber: $scope.customer.CellPhoneNumber,
                        ParentCustomerId: $scope.customer.ParentCustomerId,
                        ImageSrc: $scope.customer.ImageSrc,
                        Notes: $scope.customer.Notes
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        if(typeof $scope.customer.ImageForUpload !== 'undefined') {

                            // Upload image
                            that.uploadImage(response.CustomerId)

                                // Image upload successful
                                .success(function (data) {

                                    that.saveSuccess();
                                })
                                // Image upload failed
                                .error(function () {

                                    $rootScope.FlashMessage = {
                                        type: 'error',
                                        message: 'Kunden "' + $scope.customer.Name + '" skapades, men det gick inte att ladda upp och spara den önskade bilden.'
                                    };

                                    // Redirect
                                    history.back();
                                });

                        } else {
                            that.saveSuccess();
                        }

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Det finns redan en kund som heter "' + $scope.customer.Name +
                                '". Två kunder kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när kunden skulle sparas'
                            };
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

            // Get simple list of all customers (for parent customer field)
            $scope.customers = Customer.query();

        /* Initialization END */
    }])

    // Edit Controller
    .controller('CustomerEditCtrl', ["$scope", "$routeParams", "$location", "$rootScope", "Customer", "CustomerImage", function($scope, $routeParams, $location, $rootScope, Customer, CustomerImage){

            var that = this;

        /* Private methods START */

            that.uploadImage = function(CustomerId) {
                var customerImageHttp;

                customerImageHttp = CustomerImage.upload($scope.customer.ImageForUpload, CustomerId);

                return customerImageHttp;
            };


            that.saveSuccess = function() {

                // Display success message
                $rootScope.FlashMessage = {
                    type: 'success',
                    message: 'Kunden "' + $scope.customer.Name + '" sparades med ett lyckat resultat'
                };

                // Redirect
                history.back();
            };

        /* Private methods END */

        /* Public methods START */

            // Save customer
            $scope.save = function(){

                // Save customer
                Customer.save(
                    {
                        CustomerId: $routeParams.customerId,
                        Name: $scope.customer.Name,
                        Address: $scope.customer.Address,
                        PostNumber: $scope.customer.PostNumber,
                        City: $scope.customer.City,
                        EmailAddress: $scope.customer.EmailAddress,
                        PhoneNumber: $scope.customer.PhoneNumber,
                        CellPhoneNumber: $scope.customer.CellPhoneNumber,
                        ParentCustomerId: $scope.customer.ParentCustomerId,
                        ImageSrc: $scope.customer.ImageSrc,
                        Notes: $scope.customer.Notes
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        // Upload image
                        if(typeof $scope.customer.ImageForUpload !== 'undefined'){

                            that.uploadImage(response.CustomerId)

                                // Image upload successful
                                .success(function(){
                                    that.saveSuccess();
                                })
                                // Image upload failed
                                .error(function () {

                                    $rootScope.FlashMessage = {
                                        type: 'error',
                                        message: 'Kunden sparades, men det gick inte att ladda upp och spara den önskade bilden.'
                                    };
                                });
                        }
                        else {

                            that.saveSuccess();
                        }

                    // Something went wrong
                    }).catch(function(response) {

                        // If there there was a foreign key reference
                        if (response.status == 409){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Det finns redan en kund som heter "' + $scope.customer.Name +
                                '". Två kunder kan inte heta lika.'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när kunden skulle sparas'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Kunden "' + $scope.customer.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };

                            history.back();
                        }
                    });
            };

        /* Public methods END */


        /* Initialization START */

            // Get customer data
            that.customer = Customer.get(
                {
                    customerId: $routeParams.customerId
                }
            );

            // Get simple list of all customers (for parent customer field)
            $scope.customers = Customer.query();

            // In case customers cannot be fetched, display an error to user.
            that.customer.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Kunden kunde inte hämtas, var god försök igen.'
                };

                $scope.customer = null;
            });

            $scope.customer = that.customer;

        /* Initialization END */
    }])

    // Delete Controller
    .controller('CustomerDeleteCtrl', ["$scope", "$routeParams", "Customer", "$location", "$rootScope", function($scope, $routeParams, Customer, $location, $rootScope){

            var that = this;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

            // Confirm deletion
            $scope.confirm = function(){

                // Delete customer
                Customer.delete(
                    {
                        customerId: $routeParams.customerId
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response) {

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Kunden "' + $scope.customer.Name + '" raderades med ett lyckat resultat'
                        };

                        history.back();
                    })
                    // Something went wrong
                    .catch(function(response) {

                        // If there there was a foreign key reference
                        if (
                            response.status == 400 &&
                            response.data.Message !== 'undefined' &&
                            response.data.Message === 'Foreign key references exists'
                        ){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message:    'Kunden kan inte raderas eftersom det finns' +
                                            ' en annan kund eller ett bokningstillfälle som refererar till kunden'
                            };
                        }

                        // If there was a problem with the in-data
                        else if (response.status == 400 || response.status == 500){
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Ett oväntat fel uppstod när kunden skulle tas bort'
                            };
                        }

                        // If the entry was not found
                        if (response.status == 404) {
                            $rootScope.FlashMessage = {
                                type: 'error',
                                message: 'Kunden "' + $scope.customer.Name + '" existerar inte längre. Hann kanske någon radera den?'
                            };
                        }

                        history.back();
                });
            };

        /* Public methods END */

        /* Initialization START */

            var customer = Customer.get(
                {
                    customerId: $routeParams.customerId
                }
            );

            // In case customers cannot be fetched, display an error to user.
            customer.$promise.catch(function(){

                $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Kunden kunde inte hämtas, var god försök igen.'
                };

                $scope.customer = null;
            });

            $scope.customer = customer;

        /* Initialization END */
    }])

    // Search Controller
    .controller('CustomerSearchCtrl', ["$scope", "Customer", "$rootScope", function($scope, Customer, $rootScope){
        var that = this;
        var currentDateObj;

        /* Private methods START */

        /* Private methods END */

        /* Public methods START */

            $scope.search = function(){

                $scope.searchResults = Customer.querySearch(
                    {
                        column: $scope.searchColumn,
                        value: $scope.searchValue
                    }
                );

                $scope.searchResults.$promise

                    .then(function(){
                        $scope.noSearchResultsFound = !$scope.searchResults.length;
                    })

                    .catch(function(response) {
                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Ett oväntat fel uppstod när sökresultaten hämtades. Var god försök igen.'
                        };
                    })
            };

        /* Initialization START */

           $scope.searchColumn = "Name";

        /* Initialization END */

    }])

})();