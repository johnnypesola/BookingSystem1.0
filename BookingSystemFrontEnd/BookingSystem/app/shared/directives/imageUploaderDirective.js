/**
 * Created by jopes on 2015-05-10.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.imageUploaderDirective',

        // Dependencies
        [
            'bookingSystem.imageResizeServices'
        ])

        // Directive specific controllers START
        .controller('imageUploaderCtrl', ["$scope", "$q", "$element", "$attrs", "$rootScope", "LocationImage", "ImageResize", "API_IMG_PATH_URL", "PHOTO_MISSING_SRC", function($scope, $q, $element, $attrs, $rootScope, LocationImage, ImageResize, API_IMG_PATH_URL, PHOTO_MISSING_SRC) {

            /* Declare variables START */
            var that = this,
                i;
                $scope.file = "";
                $scope.progress = 0;
                $scope.isProgressVisible = false;

            /* Declare variables END */

            /* Object methods START */

                that.onLoad = function(reader, deferred) {
                    return function () {
                        $scope.$apply(function () {

                            // Success

                            // Scale image down to smaller size.
                            ImageResize.scaleImage(reader.result).then(function(imgData){

                                // Add base64 encoded image data to scope, replace current image displayed for user
                                $scope.displayImageSrc = imgData;

                                // Return base64 encoded image from this directive to parent controller.
                                $scope.base64EncodedImage = imgData.replace(/^data:image\/jpeg;base64,/, ""); //Replace unwanted characters for upload

                                // Resolve promise.
                                deferred.resolve();

                            });
                        });
                    };
                };

                that.onError = function (reader, deferred) {
                    return function () {
                        $scope.$apply(function () {
                            // Fail
                            deferred.reject(reader.result);
                        });
                    };
                };

                that.onProgress = function(reader) {
                    return function (event) {

                    };
                };

                that.checkFile = function(file) {
                    if(
                        file.type == "image/png" ||
                        file.type == "image/jpg" ||
                        file.type == "image/jpeg" ||
                        file.type == "image/gif"
                    ){
                        if(file.size < 10000000){ // 10 mb max size
                            return true;
                        }
                    }
                };


            /* Object methods END */

            /* Scope methods START */

                // Add a watch on imageSrc, Controls what image should be displayed to user. Passed from parent controller
                $scope.$watch('imageSrc', function(newValue, oldValue) {

                    if(typeof newValue !== 'undefined' && newValue !== ""){
                        $scope.displayImageSrc = API_IMG_PATH_URL + newValue + "?" + Date.now();
                    }
                    else {
                        $scope.displayImageSrc = PHOTO_MISSING_SRC;
                    }
                });

                // When a file is uploaded, this method is called to process the file
                $scope.readUploadedFile = function (file) {

                    var deferred = $q.defer();
                    var reader = new FileReader();

                    // Check if uploaded file is valid
                    if(that.checkFile(file)) {
                        reader.onload = that.onLoad(reader, deferred);
                        reader.onerror = that.onError(reader, deferred);
                        reader.onprogress = that.onProgress(reader);

                        reader.readAsDataURL(file);

                        return deferred.promise;
                    }
                    // Uploaded file is invalid
                    else {

                        $rootScope.FlashMessage = {
                            type: 'error',
                            message: 'Den uppladdade bilden måste vara av typen: jpg, gif eller png och får inte överstiga 10mb i storlek'
                        };

                        // Return rejected promise
                        deferred.reject();
                        return deferred.promise;
                    }
                };

            /* Scope methods END */


            /* Initialization START */

                // Update progressbar on upload file progress

            /* Initialization END */

        }])
        // Directive specific controllers END

        .directive('imageUploader', ["$http", function ($http) {
            return {
                restrict: 'E',
                link: function (scope, elm, attrs)
                {

                },
                scope: {
                    imageSrc: '=imageSrc',
                    base64EncodedImage: '=base64EncodedImage'
                },
                replace: true,
                templateUrl: 'shared/directives/imageUploaderDirective.html',
                controller: 'imageUploaderCtrl'
            }
        }])

        .directive('imageUploaderFile', function () {
            return {
                restrict: 'A',
                replace: false,
                scope: false,
                controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {

                    $element.bind("change", function(event){
                        var file;

                        // Get file from file input
                        file = (event.srcElement || event.target).files[0];

                        // Process file.
                        $scope.readUploadedFile(file);
                    });
                }]
            }
        })
})();