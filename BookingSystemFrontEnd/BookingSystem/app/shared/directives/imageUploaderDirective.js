/**
 * Created by jopes on 2015-05-10.
 */

(function(){
    // Declare module
    angular.module('bookingSystem.imageUploaderDirective',

        // Dependencies
        [])

        // Directive specific controllers START
        .controller('imageUploaderCtrl', function($scope, $q, $element, $attrs, Booking, $rootScope) {

            /* Declare variables START */
            var that = this,
                i;
                $scope.file = "";
                $scope.progress = 0;
                $scope.isProgressVisible = false;
                $scope.imageSrc = 'img/icons/photo_missing.svg';


            /* Declare variables END */

            /* Object methods START */

                that.onLoad = function(reader, deferred) {
                    return function () {
                        $scope.$apply(function () {
                            // Success
                            deferred.resolve(reader.result);
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
                         var progress;
                        // Calculate progress
                        progress = event.loaded / event.total;

                        // Show progressbar if it hasn't finished.
                        $scope.isProgressVisible = (progress !== 0 && progress !== 1);

                        // Add progress to scope.
                        $scope.progress = progress
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
            /*
                $scope.$on("fileProgress", function(e, progress) {
                    $scope.progress = progress.loaded / progress.total;
                });
            */
            /* Initialization END */

        })
        // Directive specific controllers END

        .directive('imageUploader', function ($http) {
            return {
                restrict: 'E',
                link: function (scope, elm, attrs)
                {

                },
                replace: true,
                templateUrl: 'shared/directives/imageUploaderDirective.html',
                scope: true,
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

                        file = (event.srcElement || event.target).files[0];

                        $scope.readUploadedFile(file).then(function(result) {
                            $scope.imageSrc = result;
                        });
                    });
                }
            }
        })
})();