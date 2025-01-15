import myApp from "../app.js";
myApp.factory("SharedService", function () {
  return {
    getPlotData: function () {
      return JSON.parse(localStorage.getItem("plotData")) || [];
    },
    setPlotData: function (data) {
      localStorage.setItem("plotData", JSON.stringify(data));
    },
    getWPM: function () {
      return localStorage.getItem("wpm") || 0;
    },
    setWPM: function (wpm) {
      localStorage.setItem("wpm", wpm);
    },
    getAccuracy: function () {
      return localStorage.getItem("accuracy") || 0;
    },
    setAccuracy: function (accuracy) {
      localStorage.setItem("accuracy", accuracy);
    },
  };
});
