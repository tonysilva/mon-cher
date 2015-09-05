'use strict';

app.controller('PostsCtrl', function ($scope, $location, Post, Auth) {
  $scope.posts = Post.all;
  $scope.user = Auth.user;
  $scope.query = {};
  $scope.queryBy = '$';

  //$scope.post = {url: 'http://', 'title': ''};
  $scope.post = {url: 'http://'};

  /*$scope.submitPost = function () {
    Post.create($scope.post).then(function (ref) {
      //$scope.post = {url: 'http://', 'title': ''};
      $location.path('/posts/' + ref.key());
    });
  };*/

  $scope.deletePost = function (post) {
    Post.delete(post);
  };

});