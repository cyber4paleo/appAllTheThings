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
    $scope.data ={wkt: "POLYGON((-78.6 53.03,-77.8 52.9,-77.22 52.5,-76.83 51.92,-76.69 51.23,-76.83 50.54,-77.22 49.96,-77.8 49.57,-78.49 49.43,-79.29 49.57,-79.87 49.96,-80.26 50.54,-80.4 51.23,-80.27 51.92,-79.88 52.5,-79.29 52.9,-78.6 53.03))"};

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
        var str = "";
        if(item.pi) str+=item.pi;
        if(item.lake) str+=item.lake;
        return str;
    };

    $scope.getLaccore = function() {
        var data = {
            "shape": $scope.data.wkt,
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
                $scope.isLacReturned = true;
            }, function() {
                $scope.isLacReturned = false;
            });
        }).error(function() {
            alert("Something is rong with the laccore return");
        });
    }
});