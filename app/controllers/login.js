//const login = angular.module("login", []);
import myApp from "../app.js";
import { matchPassword } from "../utils.js";
myApp.controller("logInController", [
  "$scope",
  "$rootScope",
  function ($scope, $rootScope) {
    $scope.user = {};
    $scope.isError = false;
    $scope.submiterror = "Something Went wrong";
    $scope.submitForm = async function () {
      try {
        if ($scope.logInForm.$valid) {
          //localstrorage to check user data
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const u = users.find((user) => user.email === $scope.user.email);
          if (!u) {
            $scope.isError = true;
            $scope.submiterror = "User don't exists";
          } else {
            const match = await matchPassword($scope.user.password, u.password);
            if (!match) {
              $scope.isError = true;
              $scope.submiterror = "Invalid Password";
            } else {
              $rootScope.user = u;
              localStorage.setItem("currentUser", JSON.stringify(u));
              $scope.user = {};
              $scope.goToPage("home");
            }
          }
        } else {
          submiterror = "Please fill out the form correctly.";
        }
      } catch (e) {
        $scope.isError = true;
        $scope.submiterror = "Something Went wrong";
      }
    };
    $scope.cancel = function () {
      $scope.goToPage("home");
    };
  },
]);
