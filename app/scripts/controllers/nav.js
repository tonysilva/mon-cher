'use strict';

app.controller('NavCtrl', function ($scope, $location, Post, Auth, Group) {
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.user = Auth.user;
  $scope.groups = [];

  $scope.post = {url: 'http://', title: ''};

  $scope.submitPost = function () {
  	$scope.post.creator = $scope.user.profile.username;
  	$scope.post.creatorUID = $scope.user.uid;
    $scope.post.date = new Date().toJSON();
    
    $.ajax({
        url: $scope.post.url,
        type: 'GET',
        beforeSend: function() {
          $('#spinner').show();
        },
        complete: function() {
          $('#spinner').hide();
        },
        success: function(res) {
          var xmlDoc = $.parseXML(res.responseText),
            $xml = $(xmlDoc);
          $scope.post.title = $xml.find("title").text();
          Post.create($scope.post).then(function (ref) {
            $location.path('/posts/' + ref.key());
            $scope.post = {url: 'http://', title: ''};
          });
        }
    });
  };

  $scope.loadGroups = function () {
    /*Group.groups($scope.user.uid).$loaded().then(function(groups) {
      $scope.groups = groups;
    });*/
  };

  $scope.createGroup = function () {
    Group.create($scope.group).then(function() {
      $location.path('/');
      $scope.group = {};
    });
  };

  var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
  $(document).keydown(function(e) {
    kkeys.push( e.keyCode );
    if ( kkeys.toString().indexOf( konami ) >= 0 ){
      $.getScript('/scripts/jquery.easteregg.min.js',function(){
        $(document).easteregg({
          sequence: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65], 
          callback: function () {
            $("body").append("<div class='eg'><img src='images/dv.gif'/></div>");
          }
        });
      });
    }
  });

});