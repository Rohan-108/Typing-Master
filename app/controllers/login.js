//const login = angular.module("login", []);
import myApp from "../app.js";
import { matchPassword } from "../utils.js";
myApp.controller("logInController", [
  "$scope",
  "$rootScope",
  "DbService",
  "toaster",
  function ($scope, $rootScope, DbService, toaster) {
    $scope.user = {};
    $scope.submitForm = async function () {
      try {
        if ($scope.logInForm.$valid) {
          //indexDB to check user data
          const u = await DbService.searchItemByIndex(
            "users",
            "email",
            $scope.user.email
          );
          if (!u) {
            toaster.pop("error", "User", "User does not exist");
            return;
          } else {
            const match = await matchPassword($scope.user.password, u.password);
            if (!match) {
              toaster.pop("error", "Password", "Password does not match");
              return;
            } else {
              $rootScope.user = u.email;
              localStorage.setItem("currentUser", JSON.stringify(u.email));
              $scope.goToPage("home");
              toaster.pop("success", "LogIn", "You have been logged in.");
            }
          }
        } else {
          toaster.pop("error", "Form", "Please fill out the form correctly.");
          returnq;
        }
      } catch (e) {
        toaster.pop("error", "Error", "Something went wrong");
      }
    };
    $scope.cancel = function () {
      $scope.goToPage("home");
    };
  },
]);
