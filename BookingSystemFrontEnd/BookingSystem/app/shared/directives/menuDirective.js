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
                    menuItems: '=menuItems',
                    selectedFlap: '=selectedFlap',
                    pageFlaps: '=?pageFlaps'
                },
                controller: function($scope, $element, $attrs) {

                    var that = this,
                        locationObjType,
                        subMenuLocation,
                        i, j,
                        subMenu,
                        mainMenu;


                    /* Initialization START */

                        // Get type of object to redirect to
                        $scope.objectType = $location.path().split('/')[1];

                        $scope.activePage = $location.path().split('/')[2];

                        // Add watch to selectedMainMenu. Mark right menu in case it changes
                        $scope.$watch('selectedMainMenu', function(){

                            that.deActivateMenusAndActivate($scope.menuItems, $scope.selectedMainMenu);
                        });

                        // Add watch to selectedFlap. Update page flaps with correct data
                        $scope.$watch('selectedFlap', function(){

                            if(typeof($scope.pageFlaps) !== 'undefined' && typeof $scope.selectedFlap !== 'undefined'){
                                that.deActivateMenusAndActivate($scope.pageFlaps, $scope.selectedFlap);
                            }
                        });

                    /* Initialization END */

                    /* Object methods START */

                        that.hideSubMenusAndShow = function(targetMenu){

                            $scope.menuItems.forEach(function(menu){
                                menu.isSubMenusVisible = (targetMenu == menu);
                            })
                        };

                        that.deActivateMenusAndActivate = function(menuItems, targetMenu){
                            menuItems.forEach(function(menu){

                                menu.isMenuActive = (targetMenu == menu);
                            })
                        };

                        that.initMenu = function (menuContext, menu){

                        };

                        // Find out selected main menu and sub menu from url location and select them
                        that.selectCurrentLocationMenus = function(){

                            // Check that we aren't on he index page.
                            if($location.path().length > 2){

                                locationObjType = $location.path().split('/')[1];

                                // Loop through main menu items
                                for(i = 0; i < $scope.menuItems.length; i+=1) {

                                    mainMenu = $scope.menuItems[i];

                                    // Loop through sub menu items, if there is such
                                    if(typeof mainMenu.submenus !== 'undefined'){

                                        // Loop through sub menu items
                                        for(j = 0; j < mainMenu.submenus.length; j+=1) {
                                            subMenu = mainMenu.submenus[j];

                                            // Get location url string from submenu
                                            subMenuLocation = subMenu.location.split('/')[1];

                                            // If this menus location string matches with location url string
                                            if(subMenuLocation === locationObjType){

                                                // Set selected main menu
                                                $scope.selectedMainMenu = mainMenu;

                                                // Activate selected menu, deactivate the other siblings.
                                                that.deActivateMenusAndActivate(mainMenu.submenus, subMenu);

                                                // Populate the outgoing pageFlaps object
                                                $scope.pageFlaps = mainMenu.submenus;

                                                // Avoid unnecessary iterations
                                                break;
                                            }
                                        }
                                    }
                                    // Main menu does not have any sub menus
                                    else {
                                        // Get location url string from mainmenu
                                        subMenuLocation = mainMenu.location.split('/')[1];

                                        // If this menus location string matches with location url string
                                        if(subMenuLocation === locationObjType){
                                            $scope.selectedMainMenu = mainMenu;

                                            // Activate selected menu, deactivate the other siblings.
                                            that.deActivateMenusAndActivate($scope.menuItems, mainMenu);

                                            // Populate the outgoing pageFlaps object
                                            $scope.pageFlaps = [mainMenu];

                                            // Avoid unnecessary iterations
                                            break;
                                        }
                                    }
                                }
                            }
                        };

                    /* Object methods END */

                    /* Public methods START */

                        // Method for when a main menu is selected
                        $scope.selectMainMenu = function(menu) {
                            $scope.selectedMainMenu = menu;

                            // If there are any sub menus
                            if(typeof menu.submenus !== 'undefined' ){

                                // Display active sub menus for clicked main menu
                                $scope.visibleSubMenus = menu.submenus;

                                // Mark sub menu as visible and hide other sub menus
                                that.hideSubMenusAndShow(menu);
                            }
                            // No sub menus.
                            else {
                                // Populate the outgoing pageFlaps object with the main menu itself
                                $scope.pageFlaps = [$scope.selectedMainMenu];

                                // Hide all sub menus
                                that.hideSubMenusAndShow();
                            }
                        };

                        // Method for when a sub menu is selected
                        $scope.selectSubMenu = function(submenu) {

                            // Activate selected menu, deactivate the other siblings.
                            that.deActivateMenusAndActivate($scope.selectedMainMenu.submenus, submenu);

                            // Populate the outgoing pageFlaps object
                            $scope.pageFlaps = $scope.selectedMainMenu.submenus;

                            // Set selected flap
                            $scope.selectedFlap = submenu;

                            // Hide all sub menus
                            that.hideSubMenusAndShow();
                        };

                    /* Public methods END */

                    /* Initialization START */

                        that.selectCurrentLocationMenus();

                    /* Initialization END */
                }
            };
        });
})();