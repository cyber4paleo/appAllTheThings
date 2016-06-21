angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('MainViewCtrl', function($scope, $http, $q){
    $scope.isLacReturned = false;
    $scope.laccoredata = [];

    $scope.getGDD = function(item) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: 'https://geodeepdive.org/api/v1//snippets?term=' + $scope.getTerm(item)
        }).then(function successCallback(response) {
            item["GDD"] = response.data.success.data;
            defer.resolve(item);
        }, function errorCallback(response) {
            console.log("Something is rong with the geo deep dive return");
            defer.reject();
        });
        return defer.promise;
    };

    $scope.getTerm = function(item) {
        return item.pi;
    };

    $scope.getLaccore = function() {
        var data = {
            "shape": "POLYGON((-101.42 39.93,-99.48 39.89,-98.56 39.39,-98.17 38.81,-98.04 38.12,-98.18 37.43,-98.57 36.85,-99.16 36.46,-99.85 36.33,-101.76 36.36,-102.68 36.85,-103.18 37.77,-103.09 38.81,-102.43 39.62,-101.42 39.93))",
            "facilities": ['laccore']
        };
        var gddpromises = [];
        $http.post("http://geology-tmitest.oit.umn.edu/api/laccoreSample", data).success(function(response) {
            for (var i = 0; i < response.data.length; i++) {
                var item = response.data[i];
                gddpromises.push($scope.getGDD(item));
            }
            $q.all(gddpromises).then(function(items) {
                $scope.laccoredata=$scope.laccoredata.concat(items);
                console.log($scope.laccoredata);
                $scope.isLacReturned = true;
            }, function() {
                $scope.isLacReturned = false;
            });
        }).error(function() {
            alert("Something is rong with the laccore return");
        });
    }
});