//const auth = angular.module("auth", []);
import myApp from "../app.js";
myApp.factory("AuthService", [
  "$rootScope",
  "$q",
  "$state",
  function ($rootScope, $q, $state) {
    const AuthService = {};

    // Simulated authentication check (replace with actual backend logic)
    AuthService.isAuthenticated = function () {
      return $rootScope.user ? true : false;
    };

    AuthService.redirectIfNotAuthenticated = function () {
      if (!AuthService.isAuthenticated()) {
        $state.go("login");
        return $q.reject("User_Not_Authenticated");
      }
      return $q.resolve($rootScope.user);
    };

    AuthService.redirectIfAuthenticated = function () {
      if (AuthService.isAuthenticated()) {
        $state.go("dashboard");
        return $q.reject("Restricted_Access");
      }
      return $q.resolve();
    };
    return AuthService;
  },
]);
