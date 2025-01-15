//const signUp = angular.module("signUp", []);
import myApp from "../app.js";
import { hashPassword } from "../utils.js";
myApp.controller("signUpController", [
  "$scope",
  "$rootScope",
  function ($scope, $rootScope) {
    $scope.user = {};
    $scope.isError = false;
    $scope.submiterror = "Something Went wrong";
    $scope.submitForm = async function () {
      if ($scope.signUpForm.$valid) {
        //localstrorage to store user data
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const u = users.find((user) => user.email === $scope.user.email);
        if (u) {
          $scope.isError = true;
          $scope.submiterror = "User already exists";
        } else {
          $scope.user.password = await hashPassword($scope.user.password);
          users.push($scope.user);
          localStorage.setItem("users", JSON.stringify(users));
          localStorage.setItem("currentUser", JSON.stringify($scope.user));
          $rootScope.user = $scope.user;
          $scope.user = {};
          $scope.goToPage("home");
        }
      } else {
        submiterror = "Please fill out the form correctly.";
      }
    };
    $scope.cancel = function () {
      $scope.goToPage("home");
    };
  },
]);
