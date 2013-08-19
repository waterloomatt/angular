'use strict'; 

var familyApp = angular.module('FamilyApp', ['restangular']).
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

familyApp.directive('error', function($rootScope){
    return {
        restrict: 'E',
        template: '<div class="alert alert-danger" ng-show="isError">{{error}}</div>',
        link: function(scope){
            $rootScope.$on('$routeChangeError', function(event, previous, current, rejection)
            {
                scope.isError = true;
                scope.error = rejection;
            })
        }
    }
});

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