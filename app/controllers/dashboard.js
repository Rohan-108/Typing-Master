import myApp from "../app.js";

myApp.controller("DashboardController", [
  "$scope",
  "$rootScope",
  "DbService",
  function ($scope, $rootScope, DbService) {
    $scope.wpmData = []; // To store chart data
    $scope.labels = []; // To store chart labels
    $scope.highestWpm = 0; // To store highest WPM
    $scope.averageWpm = 0; // To store average WPM
    $scope.days = 7; // Number of days to show data for
    // Function to initialize the chart
    $scope.chartInstance = null;

    $scope.updateChart = async function () {
      $scope.$applyAsync();
      await $scope.loadChartData();
    };
    $scope.initChart = function () {
      const ctx = document.getElementById("dashChart").getContext("2d");
      if ($scope.chartInstance) {
        $scope.chartInstance.destroy();
      }
      $scope.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: $scope.labels,
          datasets: [
            {
              label: "WPM",
              data: $scope.wpmData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Date",
                color: "#ffffff",
                font: { size: 15 },
              },
              ticks: { color: "#ffffff" },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Words Per Minute (WPM)",
                color: "#ffffff",
                font: { size: 13 },
              },
              ticks: { color: "#ffffff" },
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
              text: "Your Performance Over Time",
              color: "#ffffff",
              font: { size: 20 },
            },
          },
        },
      });
    };

    // Fetch data asynchronously
    $scope.loadChartData = async function () {
      try {
        const data = await DbService.getAnalytics(
          "analytics",
          $rootScope.user,
          $scope.days
        );
        if (data.length > 0) {
          $scope.labels = data.map((item) =>
            new Date(item.timestamp).toLocaleDateString("en-US", {
              year: "2-digit",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          );
          let sum = 0;
          $scope.highestWpm = 0;
          $scope.wpmData = data.map((item) => {
            if (item.wpm > $scope.highestWpm) {
              $scope.highestWpm = item.wpm;
            }
            sum += item.wpm;
            return item.wpm;
          });
          $scope.averageWpm = (sum / data.length).toFixed(2);
          $scope.$applyAsync(); // Apply changes to scope
          console.log($scope.highestWpm, $scope.averageWpm);

          $scope.initChart(); // Initialize the chart after data is ready
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Call the function to load data and render the chart
    $scope.loadChartData();
  },
]);
