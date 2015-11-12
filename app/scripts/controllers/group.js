'use strict';

app.controller('GroupCtrl', function ($scope, $routeParams, Auth, Post) {
  var groupId = $routeParams.groupId;

  $scope.user = Auth.user;
  $scope.user.profile.$loaded().then(function(profileRef) {
	$scope.group = profileRef.groups[groupId];
  });

  $scope.deletePost = function (postId, post) {
    Post.deleteWithId(groupId, postId, post);
  };

});