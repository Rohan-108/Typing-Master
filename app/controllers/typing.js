//const typing = angular.module("typing", []);
import myApp from "../app.js";
import { randomParagraph } from "../utils.js";
myApp.controller("TypingController", [
  "$scope",
  "$rootScope",
  "$interval",
  "SharedService",
  "DbService",
  "toaster",
  function ($scope, $rootScope, $interval, SharedService, DbService, toaster) {
    $scope.paragraph = randomParagraph().split("");
    $scope.typedInput = "";
    $scope.plotData = [];
    $scope.timer = 30;
    $scope.typedChars = [];
    $scope.wpm = 0;
    $scope.accuracy = 0;
    let totalTyped = 0;
    let errors = 0;
    let timerStarted = false;
    let timer;
    //cleaning already saved data in shared service
    SharedService.setPlotData($scope.plotData);
    SharedService.setWPM($scope.wpm);
    SharedService.setAccuracy($scope.accuracy);
    // Handle typing logic
    $scope.onKeyup = function () {
      if (!timerStarted) {
        startTest();
        timerStarted = true;
      }

      $scope.typedChars = $scope.typedInput.split("");
      totalTyped = $scope.typedChars.length;

      // Calculate correct words and accuracy
      let correctChars = 0;
      let correctWords = 0;
      for (let i = 0; i < $scope.typedChars.length; i++) {
        if ($scope.typedChars[i] === $scope.paragraph[i]) {
          correctChars++;
          if (
            $scope.paragraph[i] === " " ||
            i === $scope.paragraph.length - 1
          ) {
            correctWords++;
          }
        }
      }

      $scope.accuracy =
        totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

      // Calculate WPM
      $scope.wpm = Math.round((correctWords / (30 - $scope.timer)) * 60) || 0;

      // End test if all characters are typed
      if ($scope.typedChars.length >= $scope.paragraph.length) {
        stopTest();
      }
    };

    // Timer logic
    function startTest() {
      timer = $interval(() => {
        if ($scope.timer > 0) {
          $scope.plotData.push({
            wpm: $scope.wpm,
            time: 30 - $scope.timer,
            accuracy: $scope.accuracy,
            error: errors,
          });
          $scope.timer--;
        } else {
          stopTest();
        }
      }, 1000);
    }
    // Stop test
    function stopTest() {
      if (angular.isDefined(timer)) {
        $interval.cancel(timer);
      }
      $scope.timer = 0;
      SharedService.setPlotData($scope.plotData);
      SharedService.setWPM($scope.wpm);
      SharedService.setAccuracy($scope.accuracy);
      // Save analytics data
      DbService.addItem("analytics", {
        email: $rootScope.user,
        wpm: $scope.wpm,
        accuracy: $scope.accuracy,
        timestamp: new Date().getTime(),
      });
      toaster.pop("success", "Test Completed", "Your test has been completed");
      $scope.goToPage("result");
    }
    // Reset test
    $scope.reset = function () {
      $scope.typedInput = "";
      $scope.timer = 30;
      $scope.typedChars = [];
      $scope.wpm = 0;
      $scope.accuracy = 0;
      totalTyped = 0;
      timerStarted = false;
      if (angular.isDefined(timer)) {
        $interval.cancel(timer);
      }
      $scope.paragraph = randomParagraph().split("");
      $scope.plotData = [];
      SharedService.setPlotData($scope.plotData);
      SharedService.setWPM($scope.wpm);
      SharedService.setAccuracy($scope.accuracy);
    };
  },
]);
