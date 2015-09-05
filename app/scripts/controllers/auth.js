'use strict';

app.controller('AuthCtrl', function ($scope, $location, Auth, signedIn) {
  if (Auth.signedIn()) {
    $location.path('/');
  }

  $scope.login = function () {
    Auth.login($scope.user).then(function () {
      $location.path('/');
    }, function (error) {
      $scope.error = error.toString();
    });
  };

  $scope.register = function () {
    Auth.register($scope.user).then(function(user) {
      return Auth.login($scope.user).then(function(authData) {
        user.username = $scope.user.username;
        return Auth.createProfile(user, authData);
      }).then(function() {
        $location.path('/');
      });
    }, function (error) {
      $scope.error = error.toString();
    });
  };

});