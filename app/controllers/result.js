//const result = angular.module("result", []);
import myApp from "../app.js";
myApp.controller("ResultController", [
  "$scope",
  "SharedService",
  function ($scope, SharedService) {
    $scope.isdata = true;
    const plotData = SharedService.getPlotData();
    $scope.wpm = SharedService.getWPM();
    $scope.accuracy = SharedService.getAccuracy();
    // Prepare data for the chart
    const timeData = plotData?.map((data) => data.time) || [];
    const wpmData = plotData?.map((data) => data.wpm) || [];
    const accuracyData = plotData?.map((data) => data.accuracy) || [];
    // Remove the first elements if data exists
    if (timeData.length > 0) timeData.shift();
    if (wpmData.length > 0) wpmData.shift();
    if (accuracyData.length > 0) accuracyData.shift();
    if (timeData.length == 0 || wpmData.length == 0) {
      $scope.isdata = false;
      return;
    }
    //code to plot the chart
    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: timeData,
        datasets: [
          {
            label: "WPM",
            data: wpmData,
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
          {
            label: "Accuracy",
            data: accuracyData,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Time (seconds)",
              color: "#ffffff",
            },
            ticks: { color: "#ffffff" },
          },
          y: {
            ticks: { color: "#ffffff" },
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#ffffff",
            },
          },
          title: {
            display: true,
            text: "Statistics",
            color: "#ffffff",
            font: { size: 25 },
          },
        },
      },
    });
  },
]);
