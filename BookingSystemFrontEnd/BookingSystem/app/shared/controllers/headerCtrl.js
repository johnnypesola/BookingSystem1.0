/**
 * Created by jopes on 2015-04-15.
 */
    // Controller

(function(){
    angular.module('bookingSystem.header', [])

    // Routes for startPage
    .config(function($routeProvider) {

    })

    // Header Controller
    .controller('HeaderCtrl', function($scope){

        // Init values
        $scope.selectedSubMenu = 0;

        // Declare Menu
        $scope.menus = [
            {
                title: "Bokningar",
                submenus: [
                    {
                        title: "Bokningstillfällen",
                        location: "bokningstillfallen/lista"
                    },
                    {
                        title: "Lokalbokningar",
                        location: "lokalbokningar/lista"
                    },
                    {
                        title: "Matbokningar",
                        location: "matbokningar/lista"
                    },
                    {
                        title: "Resursbokningar",
                        location: "resursbokningar/lista"
                    }
                ]
            },
            {
                title: "Lokaler / Platser",
                submenus: [
                    {
                        title: "Lokaler / Platser",
                        location: "platser/lista"
                    },
                    {
                        title: "Lokalmöbleringar",
                        location: "lokalmobleringar/lista"
                    }
                ]
            },
            {
                title: "Möbleringar",
                submenus: [
                    {
                        title: "Möbleringar",
                        location: "mobleringar/lista"
                    }
                ]
            },
            {
                title: "Användare"
            },
            {
                title: "Resurser"
            },
            {
                title: "Mat",
                submenus: [
                    {
                        title: "Måltider"
                    },
                    {
                        title: "Måltidsegenskaper"
                    }
                ]
            },
            {
                title: "Kunder"
            }
        ];

        // Method for when a main menu is selected
        $scope.selectMainMenu = function(index) {
            $scope.selectedMainMenu = index;

            $scope.activeSubMenus = $scope.menus[index].submenus;
        };

        // Method for when a sub menu is selected
        $scope.selectSubMenu = function(index) {
            $scope.selectedSubMenu = index;
        };



        // Watch changes on selectedMainMenu variable
        /*
        $scope.$watch('selectedMainMenu', function() {
            console.log('selectedMainMenu is now ' + $scope.selectedMainMenu);

            // Show sub-menus for selected main menu

        });
        */
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


