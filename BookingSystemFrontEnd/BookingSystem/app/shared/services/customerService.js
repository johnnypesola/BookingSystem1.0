/**
 * Created by jopes on 2015-04-12.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.customerServices',

        // Dependencies
        [
            'ngResource'
        ])

        .factory('Customer', function($resource, API_URL){

            return $resource(
                API_URL + 'Customer/:customerId',
                {customerId: '@customerId'},
                {
                    // Search for customer
                    querySearch: {
                        url: API_URL + 'Customer/search/:column',
                        id: '@id',
                        method: 'GET',
                        isArray: true,
                        params: {
                            column: '@column'
                        }
                    }
                }
            );
        })

        .factory('CustomerImage', function($http, API_URL) {

            return {
                upload : function(imageData, customerId) {

                    return $http(
                        {
                            method: 'POST',
                            url: API_URL + 'Customer/image/' + customerId,
                            data: imageData,
                            headers: {'Content-Type': undefined}
                        }
                    );
                }
            }
        })
})();
