'use strict';

app.factory('Post', function ($firebaseArray, $firebaseObject, $firebaseUtils, FIREBASE_URL, Group) {
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebaseArray(ref.child('posts'));

  var Post = {
    all: posts,
    create: function (groupId, post) {
      return posts.$add(post).then(function(postRef) { 
        $firebaseArray(ref.child('user_posts').child(post.creatorUID)).$add(postRef.key()).then(function(userPostsRef) {
          ref.child('posts').child(postRef.key()).child('userPostsID').set(userPostsRef.key());
          if (groupId) {
            post.userPostsID = userPostsRef.key();
            Group.addPost(groupId, postRef.key(), post);
          }
        });
        return postRef;
      });
    },
    get: function (postId) {
      return $firebaseObject(ref.child('posts').child(postId));
    },
    delete: function (post) {
      return posts.$remove(post).then(function() {
        ref.child("comments").child(post.$id).remove();
        ref.child('user_posts').child(post.creatorUID).child(post.userPostsID).remove();
      });
    },
    deleteWithId: function (groupId, postId, post) {
      ref.child("posts").child(postId).remove(function(error){
        if (error) {
          console.log("Error:", error);
        } else {
          ref.child("comments").child(postId).remove();
          ref.child("groups").child(groupId).child("posts").child(postId).remove();
          ref.child("profiles").child(post.creatorUID).child("groups").child(groupId).child("posts").child(postId).remove();
          ref.child('user_posts').child(post.creatorUID).child(post.userPostsID).remove();
        }
      });
    },
    comments: function (postId) {
      return $firebaseArray(ref.child("comments").child(postId));
    },
    addComment: function (post, commentId, comment) {
      ref.child("posts").child(post.$id).child("comments").child(commentId).set(comment);
      Post.get(post.$id).$loaded().then(function(postRef) {
        delete postRef.group;
        var groupId = Object.keys(post.group)[0];
        ref.child("groups").child(groupId).child("posts").child(postRef.$id).set($firebaseUtils.toJSON(postRef));
        Group.get(groupId).$loaded().then(function(groupRef) {
          delete groupRef.profiles;
          ref.child("profiles").child(post.creatorUID).child("groups").child(groupRef.$id).set($firebaseUtils.toJSON(groupRef));
        });
      });
    },
    deletePostView: function (post) {
      var creatorUID = post.creatorUID;
      var userPostsID = post.userPostsID;
      var group = post.group;
      return post.$remove().then(function() {
        ref.child("comments").child(post.$id).remove();
        ref.child('user_posts').child(creatorUID).child(userPostsID).remove();
        if (group) {
          var groupId = Object.keys(group)[0];
          ref.child("groups").child(groupId).child("posts").child(post.$id).remove();
          ref.child("profiles").child(creatorUID).child("groups").child(groupId).child("posts").child(post.$id).remove();
        }
      });    
    }
  };

  return Post;
});