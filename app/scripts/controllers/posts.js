'use strict';

app.controller('PostsCtrl', function ($scope, $location, Post, Auth) {
  $scope.posts = Post.all;
  $scope.user = Auth.user;
  $scope.query = {};
  $scope.queryBy = '$';

  //$scope.post = {url: 'http://', 'title': ''};
  $scope.post = {url: 'http://'};

  $scope.deletePost = function (post) {
    if (post.group) {
      var groupId = Object.keys(post.group)[0];
      Post.deleteWithId(groupId, post.$id, post);
    } else {
      Post.delete(post);
    }
  };

});