//main controller
import myApp from "../app.js";
myApp.controller("mainController", [
  "$scope",
  "toaster",
  "$rootScope",
  function ($scope, toaster, $rootScope) {
    //for the toaster
    $scope.toast = function (type, title, message) {
      switch (type) {
        case "success":
          toaster.pop("success", title, message);
          break;
        case "error":
          toaster.error("error", title, message);
          break;
        case "info":
          toaster.pop("info", title, message);
          break;
        case "warning":
          toaster.pop("warning", message, title);
          break;
        case "wait":
          toaster.pop("wait", title, message);
          break;
        default:
          toaster.pop("note", title, message);
      }
    };
    //logout function
    $scope.logout = () => {
      localStorage.removeItem("currentUser");
      $scope.goToPage("home");
      $scope.flag = true;
      $rootScope.user = null;
      toaster.pop("success", "Logout", "You have been logged out");
    };
    //for the navbar toggle
    $scope.flag = true;
    $scope.toggle = function () {
      $scope.flag = !$scope.flag;
    };
  },
]);
