// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyB1-Y3GEdbUiw-PFMFjkb7L5q530Y417Gw",
  authDomain: "phaniraj-ce9d7.firebaseapp.com",
  databaseURL: "https://phaniraj-ce9d7.firebaseio.com",
  projectId: "phaniraj-ce9d7",
  storageBucket: "phaniraj-ce9d7.appspot.com",
  messagingSenderId: "68981850666",
  appId: "1:68981850666:web:485a4173757c47c8637953",
  measurementId: "G-9XFCGJ7GSW"
};

$(function() {
    $(".btn").click(function() {
      $(".form-signin").toggleClass("form-signin-left");
      $(".form-signup").toggleClass("form-signup-left");
      $(".frame").toggleClass("frame-long");
      $(".signup-inactive").toggleClass("signup-active");
      $(".signin-active").toggleClass("signin-inactive");
      $(".forgot").toggleClass("forgot-left");
      $(this)
        .removeClass("idle")
        .addClass("active");
    });
  });
  
  $(function() {
    $(".btn-signup").click(function() {
      $(".nav").toggleClass("nav-up");
      $(".form-signup-left").toggleClass("form-signup-down");
      $(".success").toggleClass("success-left");
      $(".frame").toggleClass("frame-short");
    });
  });
  
  $(function() {
    $(".btn-signin").click(function() {
      $(".btn-animate").toggleClass("btn-animate-grow");
      $(".welcome").toggleClass("welcome-left");
      $(".cover-photo").toggleClass("cover-photo-down");
      $(".frame").toggleClass("frame-short");
      $(".profile-photo").toggleClass("profile-photo-down");
      $(".btn-goback").toggleClass("btn-goback-up");
      $(".forgot").toggleClass("forgot-fade");
    });
  });
  
  function getInfo() {
    let email = getElementById("email").value;
    let password = getElementById("password").value;
  }