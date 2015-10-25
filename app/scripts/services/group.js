'use strict';

app.factory('Group', function ($firebaseArray, $firebaseObject, FIREBASE_URL, Auth) {
  var ref = new Firebase(FIREBASE_URL);
  var groups = $firebaseArray(ref.child('groups'));

  var Group = {
    all: groups,
    create: function (group) {
      var profile = Auth.user.profile;
      delete profile.groups;
      return groups.$add(group).then(function(groupRef) {
        $firebaseArray(ref.child('groups').child(groupRef.key()).child('profiles')).$add(profile).then(function() {
          return $firebaseArray(ref.child('profiles').child(profile.$id).child('groups')).$add(group);
        });
        return groupRef;
      });
    },
    get: function (groupId) {
      return $firebaseObject(ref.child("groups").child(groupId));
    },
    getProfiles: function (groupId) {
      return $firebaseArray(ref.child("groups").child(groupId).child("profiles"));
    }
  };

  return Group;
});