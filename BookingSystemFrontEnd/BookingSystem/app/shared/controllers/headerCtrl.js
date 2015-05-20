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
    .controller('HeaderCtrl', function($scope, $rootScope, $location){

            // Declare variables
            var that = this;
            var selectedMenus;
            var selectedMainMenu;
            var selectedSubMenu;

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
                            title: "Bokningstyper",
                            location: "bokningstyper/lista"
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
                        },
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

            // Find out selected main menu and sub menu and select them
            that.selectCurrentLocationMenus = function(){

                // Check that we aren't on he index page.
                if($location.path().length > 2){

                    var iteratedMainMenu;

                    selectedMenus = $location.path().split('/');
                    selectedMainMenu = selectedMenus[1];
                    selectedSubMenu = selectedMenus[2];

                    $scope.menus.forEach(function(mainmenu, mindex, array){

                        mainmenu.submenus.forEach(function(submenu, sindex, array){
                            if(typeof submenu.location !== 'undefined'){

                                iteratedMainMenu = submenu.location.split('/')[0];

                                if(iteratedMainMenu === selectedMainMenu){
                                    $scope.selectedMainMenu = mindex;

                                    $scope.activeSubMenus = $scope.menus[mindex].submenus;

                                    $scope.selectedSubMenu = sindex;

                                    // Avoid unnecessary iterations
                                    return;
                                }
                            }
                        });

                        // Avoid unnecessary iterations
                        if($scope.selectedSubMenu) {
                            return;
                        }
                    });

                }
                // No menu is selected, set index to 0.
                else {
                    $scope.selectedSubMenu = 0;
                }
            };

        /* Object methods END */

        /* Public methods START */

            // Method for when a main menu is selected
            $scope.selectMainMenu = function(index) {
                $scope.selectedMainMenu = index;

                // Display active sub menus for clicked main menu
                $scope.activeSubMenus = $scope.menus[index].submenus;

                // Deselect sub menu when main menu is clicked
                $scope.selectedSubMenu = -1;
            };

            // Method for when a sub menu is selected
            $scope.selectSubMenu = function(index) {
                $scope.selectedSubMenu = index;
            };

            $scope.displayAddForm = function(value) {
                $rootScope.addFormIsVisible = value;
                $rootScope.searchFormIsVisible = false;
            };

            $scope.displaySearchForm = function(value) {
                $rootScope.searchFormIsVisible = value;
                $rootScope.addFormIsVisible = false;
            };

        /* Public methods END */

        /* Initialization START */

            that.selectCurrentLocationMenus();


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


