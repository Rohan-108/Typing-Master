//const signUp = angular.module("signUp", []);
import myApp from "../app.js";
import { hashPassword } from "../utils.js";
myApp.controller("signUpController", [
  "$scope",
  "$rootScope",
  "DbService",
  function ($scope, $rootScope, DbService) {
    $scope.user = {};
    $scope.isError = false;
    $scope.submiterror = "Something Went wrong";
    $scope.submitForm = async function () {
      if ($scope.signUpForm.$valid) {
        //localstrorage to store user data
        const u = await DbService.getItem("users", $scope.user.email);
        if (u) {
          $scope.isError = true;
          $scope.submiterror = "User already exists";
        } else {
          const password = await hashPassword($scope.user.password);
          await DbService.addItem("users", {
            email: $scope.user.email,
            password: password,
          });
          $rootScope.user = $scope.user.email;
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
