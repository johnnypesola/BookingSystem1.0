/**
 * Created by jopes on 2015-04-12.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.resourceServices',

        // Dependencies
        [
            'ngResource'
        ])

        .factory('Resource', ["$resource", "API_URL", function($resource, API_URL){

            return $resource(
                API_URL + 'Resource/:resourceId',
                {resourceId: '@resourceId'}
            );
        }]);

})();
