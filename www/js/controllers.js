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

.controller('MainViewCtrl', function($scope, $http) {
  $scope.isMacroReturned = false;
  $scope.isGDDReady = false;
  $scope.macrodata = undefined;
  $scope.gdddata = [];
  $scope.keywords = [];

  $scope.getGDD=function() {
    if($scope.keywords.length>0){
      var term = $scope.keywords.pop();
      $http({
        method: 'GET',
        url: 'https://geodeepdive.org/api/v1//snippets?term='+term
      }).then(function successCallback(response) {
        $scope.gdddata=$scope.gdddata.concat(response.data.success.data);
        $scope.getGDD();
      }, function errorCallback(response) {
        alert("Something is rong with the geo deep dive return");
      });
    }else{
      $scope.isGDDReady=true;
      $scope.gdddata=JSON.stringify($scope.gdddata);
    }
  };

  var wkt="POLYGON((-101.42 39.93,-99.48 39.89,-98.56 39.39,-98.17 38.81,-98.04 38.12,-98.18 37.43,-98.57 36.85,-99.16 36.46,-99.85 36.33,-101.76 36.36,-102.68 36.85,-103.18 37.77,-103.09 38.81,-102.43 39.62,-101.42 39.93))";
  $scope.getMacro= function() {
    $http({
      method: 'GET',
      url: 'https://macrostrat.org/api/v2/carto/small?format=geojson_bare&shape='+wkt
    }).then(function successCallback(response) {
        console.log(response.data);
        for(var i=0; i<response.data.features.length; i++){
          var name = response.data.features[i].properties.name;
          if($scope.keywords.indexOf(name)==-1) $scope.keywords.push(name);
        }
        $scope.macrodata= JSON.stringify(response.data);
        $scope.isMacroReturned = true;
      }, function errorCallback(response) {
        alert("Something is rong with the macro return");
      });
    }
})

