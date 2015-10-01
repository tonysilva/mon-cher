'use strict';

app.factory('Group', function ($firebaseArray, $firebaseObject, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var groupss = $firebaseArray(ref.child('groups'));

  var Group = {
    all: groupss,
    create: function (group) {
      return Group.groups(group.profile.$id).$add(group).then(function(groupRef) {
        $firebaseArray(ref.child('profiles').child(group.profile.$id).child('groups')).$add(group);
        return groupRef;
      });
    },
    get: function (userId, groupId) {
      return $firebaseObject(ref.child("groups").child(userId).child(groupId));
    },
    groups: function (userId) {
      return $firebaseArray(ref.child("groups").child(userId));
    }
  };

  return Group;
});