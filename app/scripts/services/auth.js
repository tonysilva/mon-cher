'use strict';

app.factory('Auth', function ($firebaseAuth, $firebaseObject, FIREBASE_URL, $q, $rootScope) {
  var ref = new Firebase(FIREBASE_URL);
  var simpleLogin = $firebaseAuth(ref);

  var Auth = {
    register: function (user) {
      return simpleLogin.$createUser({ email: user.email, password: user.password });
      /*var deferred = $q.defer();
      ref.createUser({ email: user.email, password: user.password }, function (error, userData) {
        if (error) {
          deferred.reject(error);
          switch (error.code) {
            case "EMAIL_TAKEN":
              console.log("The new user account cannot be created because the email is already in use.");
              break;
            case "INVALID_EMAIL":
              console.log("The specified email is not a valid email.");
              break;
            default:
              console.log("Error creating user:", error);
          }
        } else {
          deferred.resolve(userData);
          console.log("Successfully created user account with uid:", userData.uid);
        }
      });
      return deferred.promise;*/
    },
    createProfile: function (user, authData) {
      var profile = { 
        provider: authData.provider, 
        username: user.username, 
        email: authData.password.email,
        profileImageURL: authData.password.profileImageURL
      };
      return ref.child("profiles").child(user.uid).set(profile);
      /*var deferred = $q.defer();
      ref.child("profiles").child(user.uid).set(profile, function (error) {
        if (error) { 
          deferred.reject(error); 
        } else { 
          deferred.resolve(); 
        }
      });
      return deferred.promise;*/
      
    },
    login: function (user) {
      return simpleLogin.$authWithPassword({ email: user.email, password: user.password });

      /*return simpleLogin.$authWithPassword({ email: user.email, password: user.password }).then(function (authData) {
        $rootScope.$broadcast('$firebaseAuth:authWithPassword', authData);
        return authData;
      });*/

      /*var deferred = $q.defer();
      ref.authWithPassword({ email: user.email, password: user.password }, function (error, authData) {
        if (error) {
          deferred.reject(error);
          console.log("Login Failed!", error);
        } else {
          deferred.resolve(authData);
          console.log("Authenticated successfully with payload:", authData);
        }
      });
      return deferred.promise;*/
    },
    logout: function () {
      simpleLogin.$unauth();
      $rootScope.$broadcast('$firebaseAuth:unauth');
    },
    signedIn: function() {
      return simpleLogin.$getAuth();
    },
    user: {}
  };

/*  $rootScope.$on('$firebaseAuth:authWithPassword', function(e, user) {
    angular.copy(user, Auth.user);
    Auth.user.profile = $firebaseObject(ref.child('profiles').child(Auth.user.uid));
    console.log(Auth.user);
  });*/

  $rootScope.$on('$firebaseAuth:unauth', function() {
    if(Auth.user && Auth.user.profile) {
      Auth.user.profile.$destroy();
    }
    angular.copy({}, Auth.user);
    console.log('logged out');
  });

  ref.onAuth(function(authData) {
    if (authData) {
      angular.copy(authData, Auth.user);
      Auth.user.profile = $firebaseObject(ref.child('profiles').child(authData.uid));
      console.log("Authenticated with uid:", authData.uid);
    } else {
      console.log("Client unauthenticated.");
    }
  });

  return Auth;
});