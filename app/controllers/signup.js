//const signUp = angular.module("signUp", []);
import myApp from "../app.js";
import { hashPassword } from "../utils.js";
myApp.controller("signUpController", [
  "$scope",
  "$rootScope",
  "DbService",
  "toaster",
  function ($scope, $rootScope, DbService, toaster) {
    $scope.user = {};
    $scope.submitForm = async function () {
      try {
        if ($scope.signUpForm.$valid) {
          //localstrorage to store user data
          $scope.user.email = $scope.user.email?.trim();
          $scope.user.password = $scope.user.password?.trim();
          const u = await DbService.searchItemByIndex(
            "users",
            "email",
            $scope.user.email
          );
          if (u) {
            $scope.$applyAsync(() => {
              toaster.pop("error", "User", "User already exists");
            });
          } else {
            const password = await hashPassword($scope.user.password);
            await DbService.addItem("users", {
              email: $scope.user.email,
              password: password,
            });
            $rootScope.user = $scope.user.email;
            $scope.goToPage("home");
            toaster.pop("success", "SignUp", "You have been signed up.");
          }
        } else {
          $scope.$applyAsync(() => {
            toaster.pop("error", "User", "Fill out the form correctly");
          });
        }
      } catch (e) {
        $scope.$applyAsync(() => {
          toaster.pop("error", "Error", "Something went wrong");
        });
      }
    };
    $scope.cancel = function () {
      $scope.goToPage("home");
    };
  },
]);
