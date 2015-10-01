'use strict';

app.factory('Post', function ($firebaseArray, $firebaseObject, FIREBASE_URL) {
  //return $resource('https://radiant-fire-9860.firebaseio.com/posts/:id.json');
  var ref = new Firebase(FIREBASE_URL);
  var posts = $firebaseArray(ref.child('posts'));

  var Post = {
    all: posts,
    create: function (post) {
      return posts.$add(post).then(function(postRef) {
        $firebaseArray(ref.child('user_posts').child(post.creatorUID)).$add(postRef.key()).then(function(userPostsRef) {
          ref.child('posts').child(postRef.key()).child('userPostsID').set(userPostsRef.key());
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
    comments: function (postId) {
      return $firebaseArray(ref.child("comments").child(postId));
    },
    deletePostView: function (post) {
      var creatorUID = post.creatorUID;
      var userPostsID = post.userPostsID;
      return post.$remove().then(function() {
        ref.child("comments").child(post.$id).remove();
        ref.child('user_posts').child(creatorUID).child(userPostsID).remove(); 
      });    
    }
  };

  return Post;
});