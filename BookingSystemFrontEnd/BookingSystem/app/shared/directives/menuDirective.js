/**
 * Created by jopes on 2015-05-28.
 */


(function(){

    // Declare module
    angular.module('bookingSystem.menuDirective',

        // Dependencies
        [])

        .directive('mainMenu', function($route, $routeParams, $location, $rootScope) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'shared/directives/menuDirective.html',
                scope: {
                    menuItems: '=menuItems',
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

                        // Add watch to selectedMainMenu. Mark right menu in case it changes
                        $scope.$watch('selectedMainMenu', function(something){

                            that.disableAllButOne($scope.menuItems, 'isMenuActive', $scope.selectedMainMenu);
                        });

                        // Detect when location / route / url is changed. For example when a <a> link is pressed.

                        $rootScope.$on("$routeChangeStart", function (event, next, current) {

                            // Select correct menu
                            that.selectCurrentLocationMenus();

                        });


                    /* Initialization END */

                    /* Object methods START */

                        that.disableAllButOne = function(menuItems, property, targetMenu){
                            menuItems.forEach(function(menu){
                                menu[property] = (targetMenu == menu);
                            })
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


                                                // Populate the outgoing pageFlaps object
                                                $scope.pageFlaps = mainMenu.submenus;

                                                // Disable other flaps
                                                that.disableAllButOne($scope.pageFlaps, 'isFlapActive', subMenu);

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
                                            that.disableAllButOne($scope.menuItems, 'isMenuActive', mainMenu);

                                            // Disable other flaps
                                            that.disableAllButOne($scope.menuItems, 'isFlapActive', mainMenu);

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
                                that.disableAllButOne($scope.menuItems, 'isSubMenusVisible', menu);

                            } else {

                                //$scope.visibleSubMenus = menu;
                                that.disableAllButOne($scope.menuItems, 'isSubMenusVisible');

                                $scope.pageFlaps = [$scope.selectedMainMenu];

                                that.disableAllButOne($scope.menuItems, 'isFlapActive', menu);
                            }
                        };

                        // Method for when a sub menu is selected
                        $scope.selectSubMenu = function(submenu) {

                             // Populate the outgoing pageFlaps object
                            $scope.pageFlaps = $scope.selectedMainMenu.submenus;

                            // Hide all sub menus
                            that.disableAllButOne($scope.menuItems, 'isSubMenusVisible');

                            // Disable other flaps
                            that.disableAllButOne($scope.pageFlaps, 'isFlapActive', submenu);
                        };

                    /* Public methods END */

                    /* Initialization START */

                        that.selectCurrentLocationMenus();

                    /* Initialization END */
                }
            };
        });
})();