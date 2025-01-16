const myApp = angular.module("myApp", ["ui.router", "ngAnimate", "toaster"]);
myApp.config([
  "$stateProvider",
  "$locationProvider",
  "$urlRouterProvider",
  function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
      .state("home", {
        url: "/",
        templateUrl: "app/views/home.html",
        controller: "homeController",
      })
      .state("signup", {
        url: "/signup",
        templateUrl: "app/views/signup.html",
        controller: "signUpController",
        resolve: {
          redirectIfLoggedIn: [
            "AuthService",
            function (AuthService) {
              return AuthService.redirectIfAuthenticated();
            },
          ],
        },
      })
      .state("login", {
        url: "/login",
        templateUrl: "app/views/login.html",
        controller: "logInController",
        resolve: {
          redirectIfLoggedIn: [
            "AuthService",
            function (AuthService) {
              return AuthService.redirectIfAuthenticated();
            },
          ],
        },
      })
      .state("dashboard", {
        url: "/dashboard",
        templateUrl: "app/views/dashboard.html",
        controller: "TypingController",
        resolve: {
          redirectIfNotAuthenticated: [
            "AuthService",
            function (AuthService) {
              return AuthService.redirectIfNotAuthenticated();
            },
          ],
        },
      })
      .state("result", {
        url: "/dashboard/result",
        templateUrl: "app/views/result.html",
        controller: "ResultController",
      });
    $urlRouterProvider.otherwise("/");
  },
]);

//app initialization
myApp.run([
  "$rootScope",
  "$state",
  "toaster",
  "$transitions",
  function ($rootScope, $state, toaster, $transitions) {
    $rootScope.user = JSON.parse(localStorage.getItem("currentUser")) || null;
    $rootScope.goToPage = (page) => {
      $state.go(page);
    };
    //handle the state change errors
    $transitions.onError({}, function (transition) {
      const error = transition.error().detail;
      if (error === undefined) {
        return;
      }
      switch (error) {
        case "User_Not_Authenticated":
          toaster.pop("error", "Error", "User not authenticated");
          break;
        case "Restricted_Access":
          toaster.pop("error", "Error", "Restricted Access");
          break;
        default:
          toaster.pop("error", "Error", "Something went wrong");
          break;
      }
    });
  },
]);

export default myApp;
