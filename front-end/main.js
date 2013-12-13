'use strict';

familyApp.controller('FamilyAppController', function($rootScope, $notification){
    $rootScope.$on('$routeChangeError', function(event, previous, current, rejection)
    {
        $notification.error('Route Change Error', rejection);
    });
});

var familyController = familyApp.controller('FamilyController', function($scope, $route, $notification){
    var Family = {};
    Family.title = 'The Skeltons and Co.';

    $scope.family = Family;

    $scope.family.members = $route.current.locals.people;
    $scope.query = '';

    // Provides a limited search for first_name and last_name
    $scope.search = function (item){
        var query = $scope.query.toLowerCase();
        var firstName = item.first_name.toLowerCase();
        var lastName = item.last_name.toLowerCase();

        if (firstName.indexOf(query)!=-1 || lastName.indexOf(query)!=-1) {
            return true;
        }
        return false;
    };

    // Deletes a person and refreshes the list
    $scope.deletePerson = function(personId){
        var members = $scope.family.members;
        var target = _.find(members, function(person) {
            return person.id == personId;
        });

        target.remove().then(function() {
            $scope.family.members = _.without($scope.family.members, target);

            $notification.success('Deleted', target.first_name + ' ' + target.last_name + ' was successfully deleted.');
        });
    };
});

var profileController = familyApp.controller('ProfileController', function($scope, Restangular, $location, $route, $notification) {
    var newPerson = {};
    $scope.newPerson = newPerson;
    $scope.person = $route.current.locals.person;

    if ($route.current.locals.person)
        $scope.profile_picture_url = $route.current.locals.person.profile_picture;

    $scope.save = function(person){
        person.put().then(function() {
            $notification.success('Updated', person.first_name + ' ' + person.last_name + ' was successfully updated.');
            $location.path('/#/family');
            $location.replace();

        },
        function errorCallback(reason) {

            var errors = "";
            angular.forEach(reason.data.message.validation, function(value, key){
                alert(value);
                errors += value+"\n";
            });
            $notification.error('Failed', errors);
        });
    }

    $scope.uploadComplete = function(responseText, notification)
    {
        alert('x');
        $scope.profile_picture_url = responseText.url;
        notification.deleteNotification(notification);
    }

    $scope.create = function(newbie){
        var basePeople = Restangular.all('person');

        basePeople.post(newbie).then(
            function() {
                $notification.success('Created', newbie.first_name + ' ' + newbie.last_name + ' was successfully created.');

                $location.path('/#/family');
                $location.replace();
            },
            function errorCallback(reason) {
                var errors = "";
                angular.forEach(reason.data.message.validation, function(value, key){
                    alert(value);
                    errors += value+"\n";
                });
                $notification.error('Failed', errors);
            });
    }
});

familyController.loadData = function($q, Restangular)
{
    var defer = $q.defer();

    // Load the family members
    var basePeople = Restangular.all('person');
    basePeople.getList().then(
        function (people) {
            defer.resolve(people);
        },
        function errorCallback() {
            defer.reject("Unable to retrieve people from server.");
        });

    return defer.promise;
}

profileController.loadPerson = function($q, Restangular, $route){
    var defer = $q.defer();

    var person = Restangular.one('person', $route.current.params.personId);
    person.get().then(
        function (person) {
            defer.resolve(person);
        },
        function errorCallback() {
            defer.reject("Unable to retrieve person from server.");
        });

    return defer.promise;
}