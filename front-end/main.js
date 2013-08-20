'use strict';

familyApp.controller('FamilyAppController', function($rootScope){
    $rootScope.$on('$routeChangeError', function(event, previous, current, rejection)
    {
        console.log(rejection);
    });
});

var familyController = familyApp.controller('FamilyController', function($scope, $route){
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
        });
    };
});

var profileController = familyApp.controller('ProfileController', function($scope, Restangular, $location, $route) {
    var newPerson = {};
    $scope.newPerson = newPerson;
    $scope.person = $route.current.locals.person;

    $scope.save = function(person){
        person.profile_picture = 'profile.jpg';
        person.put().then(function() {
            alert('Updated! Taking you back to The Family now.');

            $location.path('/#/family');
            $location.replace();
        },
        function errorCallback(reason) {
            alert("Error: No save for you! \n" + JSON.stringify(reason));
        });
    }

    $scope.create = function(newbie){
        var basePeople = Restangular.all('person');

        basePeople.post(newbie).then(
            function() {
                alert('Created! Taking you back to The Family now.');

                $location.path('/#/family');
                $location.replace();
            },
            function errorCallback(reason) {
                alert("Error: No save for you! \n" + JSON.stringify(reason));
            });
    }

    $scope.serieImageUploaded = function (resp) {

    // $scope.main.serie.image = data.serie.image;
    //$scope.main.serie.banner_tile_image = data.serie.banner_tile_image;
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