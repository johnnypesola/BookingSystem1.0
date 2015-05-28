/**
 * Created by jopes on 2015-05-28.
 */


(function(){

    // Declare module
    angular.module('bookingSystem.menuDirective',

        // Dependencies
        [])

        .directive('mainMenu', function($route, $routeParams, $location) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'shared/directives/menuDirective.html',
                scope: {
                    menuItems: '=menuItems'
                },
                controller: function($scope, $element, $attrs) {

                    var that = this;

                    /* Initialization START */

                    // Get type of object to redirect to
                    $scope.objectType = $location.path().split('/')[1];

                    $scope.activePage = $location.path().split('/')[2];

                    /* Initialization END */


                    // Find out selected main menu and sub menu and select them
                    that.selectCurrentLocationMenus = function(){



                        // Check that we aren't on he index page.
                        if($location.path().length > 2){

                            var iteratedMainMenu,
                                i,
                                j,
                                submenu,
                                menu;

                            selectedMenus = $location.path().split('/');
                            selectedMainMenu = selectedMenus[1];
                            selectedSubMenu = selectedMenus[2];


                            for(i = 0; i < $scope.menuItems.length; i+=1) {

                                menu = $scope.menuItems[i];

                                for(j = 0; j < $scope.menuItems[i].submenus.length; j+=1) {
                                    submenu = $scope.menuItems[i].submenus[j];

                                    if(typeof submenu.location !== 'undefined'){
                                        iteratedMainMenu = submenu.location.split('/')[0];

                                        if(iteratedMainMenu === selectedMainMenu){
                                            $scope.selectedMainMenu = i;

                                            //$scope.activeSubMenus = $scope.menus[i].submenus;

                                            $scope.selectedSubMenu = j;

                                            // Avoid unnecessary iterations
                                            break;
                                        }
                                    }

                                    // Avoid unnecessary iterations
                                    if($scope.selectedSubMenu) {
                                        break;
                                    }
                                }
                            }
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
                        $scope.activeSubMenus = $scope.menuItems[index].submenus;

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
                }
            };
        });
})();