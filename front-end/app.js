'use strict';

var familyApp = angular.module('FamilyApp', ['restangular', 'notifications']).
config(['$httpProvider','$routeProvider', 'RestangularProvider', function($httpProvider, $routeProvider, RestangularProvider) {
    // Provide some credentials with every request
    $httpProvider.defaults.headers.common['X_REST_USERNAME'] = 'admin@restuser';
    $httpProvider.defaults.headers.common['X_REST_PASSWORD'] = 'admin@Access';

    // Let's setup the RestAngular library to handle our REST calls
    RestangularProvider.setBaseUrl("back-end/api");
    RestangularProvider.setResponseExtractor(function (data, response, operation) {
        return data.data[operation];
    });

    // Routing config
    $routeProvider.
    when('/family', {
        templateUrl: 'front-end/views/partials/family.html',
        controller: 'FamilyController',
        resolve: {
            people: familyController.loadData
        }
    }).
    when('/family/update/:personId', {
        templateUrl: 'front-end/views/partials/update.html',
        controller: 'ProfileController',
        resolve: {
            person: profileController.loadPerson
        }
    }).
    when('/family/create', {
        templateUrl: 'front-end/views/partials/create.html',
        controller: 'ProfileController'
    }).
    when('/family/:personId', {
        templateUrl: 'front-end/views/partials/profile.html',
        controller: 'ProfileController',
        resolve: {
            person: profileController.loadPerson
        }
    }).

    otherwise({
        redirectTo: '/family'
    });
}]);

familyApp.directive('header', function(){
    return {
        restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
        replace: true,
        scope: true, // This is one of the cool things :). Will be explained in post.
        templateUrl: "front-end/views/partials/header.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
            var App = {
                name: 'The Skeltons and Co.'
            }

            $scope.app = App;
        }]
    }
});

familyApp.directive('footer', function(){
    return{
        restrict: "A",
        replace: true,
        templateUrl: 'front-end/views/partials/footer.html'
    }
});


familyApp.directive('datepicker', function() {
    return {
        link: function(scope, el, attr) {
            $(el).datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'yy-mm-dd',
                onSelect: function(dateText) {
                    var expression = attr.ngModel + " = " + "'" + dateText + "'";
                    scope.$apply(expression);
                }
            });
        }
    };
});

familyApp.directive('fileUpload', ['$notification', function($notification) {
    return {
        require: '^?form',
        restrict: 'EA',
        replace: false,
        scope: {
            action: '@',
            btnLabel: '@',
            btnClass: '@',
            inputName: '@',
            progressClass: '@',
            onSuccess: '&'
        },
        link: function(scope, elem, attrs, ctrl) {
            attrs.btnLabel = attrs.btnLabel || "Choose File";
            attrs.inputName = attrs.inputName || "file";
            attrs.btnClass = attrs.btnClass || "btn";
            attrs.progressClass = attrs.progressClass || "btn";
            scope.formController = ctrl;

            elem.find('.fake-uploader').click(function() {
                elem.find('input[type="file"]').click();
            });
        },
        template: "<form \
			style='margin: 0;' \
			enctype='multipart/form-data'> \
			<div class='uploader'> \
				<input \
                                    type='file' \
                                    name='{{ inputName }}' \
                                    style='display: none;' \
                                    onchange='angular.element(this).scope().sendFile(this);'/> \
                                    <div class='btn-group'> \
                                        <button \
                                            class='{{ btnClass }} fake-uploader' \
                                            type='button' \
                                            readonly='readonly' \
                                            ng-model='avatar'>{{ btnLabel }}</button> \
                                        <button \
                                            disabled \
                                            class='{{ progressClass }}' \
                                            ng-class='{ \"btn-primary\": progress < 100, \"btn-success\": progress == 100 }' \
                                            ui-if=\"progress > 0\">{{ progress }}%</button>\
                                    </div>\
                            </div> \
                    </form>",
        controller: ['$scope', function ($scope) {
            $scope.progress = 0;
            $scope.avatar = '';

            $scope.sendFile = function(el) {


                var $form = $(el).parents('form');

                if ($(el).val() == '') {
                    return false;
                }

                $form.attr('action', $scope.action);

                $scope.$apply(function() {
                    $scope.progress = 0;
                });

                $form.ajaxSubmit({
                    type: 'POST',
                    beforeSubmit: function(arr, $form, options) {
                        $scope.formController.$invalid = true;
                        $notification.success('Uploading...', 'Please wait.');

                    },
                    uploadProgress: function(event, position, total, percentComplete) {

                        $scope.$apply(function() {
                            // upload the progress bar during the upload
                            $scope.progress = percentComplete;
                        });

                    },
                    error: function(event, statusText, responseText, form) {
                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.onError({
                                event: event,
                                responseText: responseText,
                                statusText: statusText,
                                form: form,
                            });
                            $notification.deleteNotification($notification);
                            $scope.formController.$invalid = false;
                        });
                    },
                    success: function(responseText, statusText, xhr, form) {
                        var ar = $(el).val().split('\\'),
                        filename =  ar[ar.length-1];

                        // remove the action attribute from the form
                        $form.removeAttr('action');

                        $scope.$apply(function () {
                            $scope.onSuccess({
                                responseText: responseText,
                                statusText: statusText,
                                xhr: xhr,
                                form: form
                            });
                            $notification.deleteNotification($notification);
                            $scope.formController.$invalid = false;
                            $scope.progress = 0;
                        });
                    }
                });
            }
        }]
    };
}]);

familyApp.filter('reverse', function(){
    return function(text){
        return text.split("").reverse().join("");
    }
});

familyApp.filter('capitalize', function(){
    return function(text)
    {
        return text.replace(/\w\S*/g, function(input){
            return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
        });
    }
});

familyApp.filter('condense', function(){
    return function (text){
        return text.replace(/\s+/g, '-').toLowerCase();
    }
});