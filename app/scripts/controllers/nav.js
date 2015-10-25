'use strict';

app.controller('NavCtrl', function ($scope, $location, Post, Auth, Group) {
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.user = Auth.user;
  $scope.groups = [];

  $scope.post = {url: 'http://', title: ''};

  $scope.submitPost = function () {
  	$scope.post.creator = $scope.user.profile.username;
  	$scope.post.creatorUID = $scope.user.uid;
    $scope.post.date = new Date().toJSON();
    
    $.ajax({
        url: $scope.post.url,
        type: 'GET',
        success: function(res) {
          var xmlDoc = $.parseXML(res.responseText),
            $xml = $(xmlDoc);
          $scope.post.title = $xml.find("title").text();
          Post.create($scope.post).then(function (ref) {
            $location.path('/posts/' + ref.key());
            $scope.post = {url: 'http://', title: ''};
          });
        }
    });
  };

  $scope.loadGroups = function () {
    /*Group.groups($scope.user.uid).$loaded().then(function(groups) {
      $scope.groups = groups;
    });*/
  };

  $scope.createGroup = function () {
    Group.create($scope.group).then(function() {
      $location.path('/');
      $scope.group = {};
    });
  };

});