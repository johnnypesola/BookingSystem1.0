/**
 * Created by jopes on 2015-04-15.
 */
    // Controller

(function(){
    angular.module('bookingSystem.header',
        ['bookingSystem.menuDirective']
    )

    // Routes for startPage
    .config(["$routeProvider", function($routeProvider) {

    }])

    // Header Controller
    .controller('HeaderCtrl', ["$scope", "$rootScope", "$location", function($scope, $rootScope, $location){

            // Declare Menu
            $scope.menus = [

                {
                    title: "Start",
                    submenus: [
                        {
                            title: "Startsidan",
                            location: "#/start"
                        },
                        {
                            title: "Information",
                            location: "#/information"
                        }
                    ]
                },
                {
                    title: "Bokningar",
                    submenus: [
                        {
                            title: "Bokningstyper",
                            location: "#/bokningstyper/lista"
                        },
                        {
                            title: "Bokningstillfällen",
                            location: "#/bokningstillfallen/lista"
                        },
                        {
                            title: "Lokal/Plats-bokningar",
                            location: "#/lokalbokningar/lista"
                        }/*,
                        {
                            title: "Matbokningar",
                            location: "#/matbokningar/lista"
                        },
                        {
                            title: "Resursbokningar",
                            location: "#/resursbokningar/lista"
                        }*/
                    ]
                },
                {
                    title: "Lokaler / Platser",
                    submenus: [
                        {
                            title: "Möbleringar",
                            location: "#/mobleringar/lista"
                        },
                        {
                            title: "Lokaler / Platser",
                            location: "#/platser/lista"
                        }/*
                        {
                            title: "Lokalmöbleringar",
                            location: "lokalmobleringar/lista"
                        },*/
                    ]
                },
                /*{
                    title: "Användare"
                },*/
                {
                    title: "Resurser",
                    location: "#/resurser/lista"
                },
                /*{
                    title: "Mat",
                    submenus: [
                        {
                            title: "Måltider",
                            location: "#/maltider/lista"
                        },
                        {
                            title: "Måltidsegenskaper",
                            location: "#/maltidsegenskaper/lista"
                        }
                    ]
                },
                */
                {
                    title: "Kunder",
                    location: "#/kunder/lista"
                }
            ];

        /* Object methods START */

        /* Object methods END */

        /* Public methods START */

        /* Public methods END */

        /* Initialization START */

        /* Initialization END */
    }])


    // Flash Message Controller
    .controller('FlashMessageCtrl', ["$rootScope", "$scope", function($rootScope, $scope){

        $scope.hideMessage = function(){
            $scope.messageVisible = false;
        };

        $rootScope.$watch('FlashMessage', function(newValue, oldValue) {

            // Check that the value contains data
            if ((typeof(newValue) !== 'undefined') && (newValue !== null) && (typeof newValue.type !== 'undefined')) {
                // Add class
                if(newValue.type === 'error'){
                    $scope.messageClass = 'error';
                }
                if(newValue.type === 'success'){
                    $scope.messageClass = 'success';
                }
                if(newValue.type === 'warning'){
                    $scope.messageClass = 'warning';
                }

                // Add message
                $scope.messageText = newValue.message;
                $scope.messageVisible = true;
            }
        });
    }]);
})();


