/**
 * Created by jopes on 2015-05-17.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.customer',

        // Load Dependencies
        [
            'bookingSystem.customerServices',
            'bookingSystem.customFilters',
            'bookingSystem.itemActionButtonsDirective'
        ]
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Show Controller
    .controller('CustomerShowCtrl', function($scope, $routeParams, $location, $rootScope, Customer){

        var that = this;

        /* Private methods START */

        that.redirectToListPage = function(){
            var objectType;

            objectType = $location.path().split('/')[1];

            // Go back to location list
            $location.path(objectType + "/lista");
        };

        /* Private methods END */

        /* Public methods START */

            // Back button
            $scope.back = function(){
                that.redirectToListPage();
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
        });

        $scope.customer = customer;

        /* Initialization END */
    })

    // List Controller
    .controller('CustomerListCtrl', function($scope, Customer, $rootScope){

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
    })

    // Create Controller
    .controller('CustomerCreateCtrl', function($scope, $routeParams, $location, $rootScope, Customer){

            var that = this;

        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

        /* Private methods END */

        /* Public methods START */

            // Abort creating
            $scope.abort = function(){
                that.redirectToListPage();
            };

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
                        Notes: $scope.customer.Notes
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){


                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Kunden "' + $scope.customer.Name + '" skapades med ett lyckat resultat'
                        };

                        that.redirectToListPage();

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
    })

    // Edit Controller
    .controller('CustomerEditCtrl', function($scope, $routeParams, $location, $rootScope, Customer){

            var that = this;

        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

        /* Private methods END */

        /* Public methods START */

            // Abort editing
            $scope.abort = function(){
                that.redirectToListPage();
            };

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
                        Notes: $scope.customer.Notes
                    }
                ).$promise

                    // If everything went ok
                    .then(function(response){

                        $rootScope.FlashMessage = {
                            type: 'success',
                            message: 'Kunden "' + $scope.customer.Name + '" sparades med ett lyckat resultat'
                        };

                        that.redirectToListPage();

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

                            that.redirectToListPage();
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
            });

            $scope.customer = that.customer;

        /* Initialization END */
    })

    // Delete Controller
    .controller('CustomerDeleteCtrl', function($scope, $routeParams, Customer, $location, $rootScope){

            var that = this;

        /* Private methods START */

            that.redirectToListPage = function(){
                var objectType;

                objectType = $location.path().split('/')[1];

                // Go back to location list
                $location.path(objectType + "/lista");
            };

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

                        that.redirectToListPage();
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
                                            ' ett en annan kund eller ett bokningstillfälle som refererar till kunden'
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

                    that.redirectToListPage();
                });
            };

            // Abort deletion
            $scope.abort = function(){
                that.redirectToListPage();
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
            });

            $scope.customer = customer;

        /* Initialization END */
    });

})();