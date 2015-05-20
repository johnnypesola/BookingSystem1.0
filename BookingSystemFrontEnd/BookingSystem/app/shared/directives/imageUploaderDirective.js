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
        .controller('imageUploaderCtrl', function($scope, $q, $element, $attrs, $rootScope, LocationImage, ImageResize, API_IMG_PATH_URL, PHOTO_MISSING_SRC) {

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

                            ImageResize.scaleImage(reader.result).then(function(imgData){
                                var UploadObj;
                                var UploadString;


                                if($attrs.type === "Location"){

                                    // Remove invalid string
                                    UploadString = imgData.replace(/^data:image\/jpeg;base64,/, "");

                                    UploadObj = LocationImage.upload(UploadString, $attrs.id);
                                }

                                UploadObj
                                    .success(function(data){

                                        $rootScope.FlashMessage = {
                                            type: 'success',
                                            message: 'Bilden laddades upp och sparades.'
                                        };

                                        // Use the returned imgpath value from post request in parent scope image source
                                        $scope.imageSrc = data.imgpath;

                                        // Resolve promise
                                        deferred.resolve(imgData)


                                    })
                                    .error(function(){

                                        $rootScope.FlashMessage = {
                                            type: 'error',
                                            message: 'Det gick inte att ladda upp och spara den önskade bilden.'
                                        };

                                        deferred.reject();
                                    })
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

                // Add a watch on imageSrc, Controls what image should be displayed to user.
                $scope.$watch('imageSrc', function(newValue, oldValue) {

                    if(typeof newValue !== 'undefined' && newValue !== ""){
                        $scope.displayImageSrc = API_IMG_PATH_URL + newValue;
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

        })
        // Directive specific controllers END

        .directive('imageUploader', function ($http) {
            return {
                restrict: 'E',
                link: function (scope, elm, attrs)
                {

                },
                scope: {
                    imageSrc: '=imageSrc'
                },
                replace: true,
                templateUrl: 'shared/directives/imageUploaderDirective.html',
                controller: 'imageUploaderCtrl'
            }
        })

        .directive('imageUploaderFile', function () {
            return {
                restrict: 'A',
                replace: false,
                scope: false,
                controller: function($scope, $element, $attrs) {

                    $element.bind("change", function(event){
                        var file;

                        // Get file from file input
                        file = (event.srcElement || event.target).files[0];

                        // Prcess file.
                        $scope.readUploadedFile(file).then(function(result) {

                            // When image has been uploaded. Display new image to user
                            $scope.displayImageSrc = result;
                        });
                    });
                }
            }
        })
})();