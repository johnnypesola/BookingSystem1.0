/**
 * Created by jopes on 2015-04-15.
 */
    // Controller

(function(){
    angular.module('bookingSystem.header',
        ['bookingSystem.menuDirective']
    )

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Header Controller
    .controller('HeaderCtrl', function($scope, $rootScope, $location){

            // Declare variables
            var that = this;
            var selectedMenus;
            var selectedMainMenu;
            var selectedSubMenu;

            // Declare Menu
            $scope.menus = [

                {
                    title: "Start",
                    submenus: [
                        {
                            title: "Startsidan",
                            location: "/"
                        }
                    ]
                },
                {
                    title: "Bokningar",
                    submenus: [
                        {
                            title: "Bokningstyper",
                            location: "bokningstyper/lista"
                        },
                        {
                            title: "Bokningstillfällen",
                            location: "bokningstillfallen/lista"
                        },
                        {
                            title: "Lokal/Plats-bokningar",
                            location: "lokalbokningar/lista"
                        }/*,
                        {
                            title: "Matbokningar",
                            location: "matbokningar/lista"
                        },
                        {
                            title: "Resursbokningar",
                            location: "resursbokningar/lista"
                        }*/
                    ]
                },
                {
                    title: "Lokaler / Platser",
                    submenus: [
                        {
                            title: "Lokaler / Platser",
                            location: "platser/lista"
                        },/*
                        {
                            title: "Lokalmöbleringar",
                            location: "lokalmobleringar/lista"
                        },*/
                        {
                            title: "Möbleringar",
                            location: "mobleringar/lista"
                        }
                    ]
                },
    /*            {
                    title: "Användare"
                },*/
                {
                    title: "Resurser",
                    submenus: [
                        {
                            title: "Resurser",
                            location: "resurser/lista"
                        }
                    ]
                },/*
                {
                    title: "Mat",
                    submenus: [
                        {
                            title: "Måltider",
                            location: "maltider/lista"
                        },
                        {
                            title: "Måltidsegenskaper",
                            location: "maltidsegenskaper/lista"
                        }
                    ]
                },
                */
                {
                    title: "Kunder",
                    submenus: [
                        {
                            title: "Kunder",
                            location: "kunder/lista"
                        }
                    ]
                }
            ];

        /* Object methods START */

        /* Public methods END */

        /* Initialization START */

            //that.selectCurrentLocationMenus();


        // Watch changes on selectedMainMenu variable
        /*
        $scope.$watch('selectedMainMenu', function() {
            console.log('selectedMainMenu is now ' + $scope.selectedMainMenu);

            // Show sub-menus for selected main menu

        });
        */

        /* Initialization END */
    })


    // Flash Message Controller
    .controller('FlashMessageCtrl', function($rootScope, $scope){

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
    });
})();


