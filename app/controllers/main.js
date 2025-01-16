//main controller
import myApp from "../app.js";
myApp.controller("mainController", [
  "$scope",
  "$rootScope",
  "toaster",
  function ($scope, $rootScope, toaster) {
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
