// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('myapp', ['ionic'])
  .controller('mycontroller', function ($scope, $http) {
    var dbSize = 5 * 1024 * 1024; // 5MB
    $scope.webdb = {};
    // open database
    var db = openDatabase("IndianFestivals", "1", "Todo manager", dbSize);

    //create table to use
    db.transaction(function (tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS " +
        "UserCredentials(username TEXT PRIMARY KEY, password TEXT)", [],
        function () {
          console.log("Created");
        },
        function () {
          console.log("Create failure")
        }
      );
    });

    $scope.login = function () {
      db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM UserCredentials where username=? and password=?",
          [$scope.username, $scope.password],
          function (tx, rs) {
            for (var i = 0; i < rs.rows.length; i++) {
              document.cookie = "LoginName=" + $scope.username;
              window.location = "homepage.html";
              break;
            }
            $scope.loginerror = "Invalid Username/Password";
            $scope.$apply();
          },
          function (err) {
            console.log("Read failed");
          });
      }
      );
    }

    $scope.playMusic = function () {
      var audio = document.getElementById("audio");
      audio.play();
    }
    $scope.register = function () {
      db.transaction(function (tx) {
        if ($scope.password != $scope.confirmpassword) {
          $scope.registererror = "Passwords don't match";
          $scope.$apply();
        }
        else {
          db.transaction(function (tx) {
            tx.executeSql("INSERT INTO UserCredentials(username,password) VALUES(?, ?) ",
              [$scope.username, $scope.password],
              function () {
                $scope.username = "";
                $scope.password = "";
                $scope.confirmpassword = "";
                console.log("Inserted");
                $scope.registererror = "Registered successfully!.Login to continue";
                $scope.$apply();
              },
              function () {
                console.log("Insert failed");
                $scope.registererror = "Username already exists. Please enter a different Username";
                $scope.$apply();
              }
            );
          });
        }
      });
    }

    $scope.gotoIndexPage = function () {
      window.location = "index.html";
    }
    $scope.gotoLoginPage = function () {
      window.location = "login.html";
    }
    
    $scope.gotoHomePage = function () {
      window.location = "homepage.html";
    }

    $scope.playAudio = function () {
      var myMedia = null;
      var time = 3000;
      navigator.vibrate(time);
      //var src = "/android_asset/www/audio/piano.mp3";
      var src = "media/Diwali.mp3";

      if (myMedia === null) {
        myMedia = new Media(src, onSuccess, onError);
        function onSuccess() {
          console.log("playAudio Success");
        }

        function onError(error) {
          console.log("playAudio Error: " + error.code);
        }
      }
      myMedia.play();
    }

  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })