import myApp from "./app.js";

//variables
const passChecker = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/; //for strong password
const emailChecker = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //for email

//password validator
myApp.directive("strongPassword", function () {
  return {
    require: "ngModel",
    link: function (scope, elem, attrs, ctrl) {
      ctrl.$validators.strongPassword = function (modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return false;
        }
        if (passChecker.test(viewValue)) {
          return true;
        }
        return false;
      };
    },
  };
});

//email validator
myApp.directive("validEmail", function () {
  return {
    require: "?ngModel",
    link: function (scope, elm, attrs, ctrl) {
      if (ctrl && ctrl.$validators.email) {
        //overwriting default email validator
        ctrl.$validators.email = function (modelValue, viewValue) {
          if (ctrl.$isEmpty(modelValue)) {
            return false;
          }
          if (emailChecker.test(viewValue)) {
            return true;
          }
          return false;
        };
      }
    },
  };
});
