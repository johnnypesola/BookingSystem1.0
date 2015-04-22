/**
 * Created by jopes on 2015-04-15.
 */
    // Controller

(function(){
    var header =  angular.module('bookingSystem.header', []);

    // Routes for startPage
    header.config(function($routeProvider) {

    });

    // Controller
    header.controller('HeaderController', function($scope){

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
                        location: "lokaler/lista"
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
})();


