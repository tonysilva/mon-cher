'use strict';

app.factory('Profile', function (FIREBASE_URL, $firebaseObject, $firebaseArray, Post, $q) {
  var ref = new Firebase(FIREBASE_URL);

  var profile = {
    get: function(userId) {
      return $firebaseObject(ref.child("profiles").child(userId));
    },
    getPosts: function(userId) {
      var defer = $q.defer();

      $firebaseArray(ref.child("user_posts").child(userId)).$loaded().then(function(data) {
        var posts = {};

        for(var i = 0; i < data.length; i++) {
          var value = data[i].$value;
          posts[value] = Post.get(value);
        }
        defer.resolve(posts);
      });

      return defer.promise;
    },
    getGroup: function(userId, groupId) {
      return $firebaseObject(ref.child("profiles").child(userId).child("groups").child(groupId));
    }
  };

  return profile;
});