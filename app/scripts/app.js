'use strict';

/**
 * @ngdoc overview
 * @name monCherApp
 * @description
 * # monCherApp
 *
 * Main module of the application.
 */

/* global app:true */
/* exported app */
var app = angular
  .module('monCherApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'naif.base64'
  ])
  .constant('FIREBASE_URL', 'https://radiant-fire-9860.firebaseio.com/')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl'
      })
      .when('/posts/:postId', {
        templateUrl: 'views/showpost.html',
        controller: 'PostViewCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl',
        resolve: {
          signedIn: function(Auth){
            return Auth.signedIn();
          }
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl',
        resolve: {
          signedIn: function(Auth){
            return Auth.signedIn();
          }
        }
      })
      .when('/users/:userId', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl'
      })
      .when('/group/:groupId', {
        templateUrl: 'views/group.html',
        controller: 'GroupCtrl',
        resolve: {
          signedIn: function(Auth, $location){
            if (!Auth.signedIn()) {
              $location.path("/login");
            }
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });
