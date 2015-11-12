'use strict';

app.factory('Group', function ($firebaseArray, $firebaseObject, $firebaseUtils, FIREBASE_URL, Auth) {
  var ref = new Firebase(FIREBASE_URL);
  var groups = $firebaseArray(ref.child('groups'));

  var Group = {
    all: groups,
    create: function (group) {
      var profile = Auth.user.profile;
      delete profile.groups;
      return groups.$add(group).then(function(groupRef) {
        ref.child('groups').child(groupRef.key()).child('profiles').child(profile.$id).set($firebaseUtils.toJSON(profile));
        ref.child('profiles').child(profile.$id).child('groups').child(groupRef.key()).set(group);
        return groupRef;
      });
    },
    get: function (groupId) {
      return $firebaseObject(ref.child("groups").child(groupId));
    },
    getProfiles: function (groupId) {
      return $firebaseArray(ref.child("groups").child(groupId).child("profiles"));
    },
    addPost: function (groupId, postId, post) {
      delete post.group;
      ref.child("groups").child(groupId).child("posts").child(postId).set(post);
      ref.child("profiles").child(post.creatorUID).child("groups").child(groupId).child("posts").child(postId).set(post);
    }
  };

  return Group;
});