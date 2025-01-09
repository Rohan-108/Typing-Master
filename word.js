//data for typing game
const paragraphs = [
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
  "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, I thought I would sail about a little and see the watery part of the world.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.",
  "All animals are equal, but some animals are more equal than others.",
  "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
  "The sun shone, having no alternative, on the nothing new.",
  "It was a bright cold day in April, and the clocks were striking thirteen.",
  "You don't have to live forever, you just have to live.",
  "Mr. and Mrs. Dursley, of number four, Privet Drive, were proud to say that they were perfectly normal, thank you very much.",
  "There is no greater agony than bearing an untold story inside you.",
];
let currentIndex = 0; //index of the current character
let paragraph = ""; //current paragraph
let totalKeypress = 0,
  correctKeypress = 0;
let firstPress = true;
const wordBox = document.getElementById("wordBox");
const logOutButton = document.getElementById("logOut");
const restart = document.getElementById("restart");
const changeParagraph = document.getElementById("changeParagraph");
const result = document.getElementById("result");
//initializing the code
window.addEventListener("load", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }
  //initting the game
  restart.style.display = "none";
  setParagraph();
  addLeaderBoard();
});

//logout the user

logOutButton?.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

//to set the paragraph
function setParagraph() {
  const displaytext = document.getElementById("displayText");
  let randomIndex = Math.floor(Math.random() * paragraphs.length);
  paragraph = paragraphs[randomIndex];

  displaytext.innerHTML = paragraph
    .split("")
    .map((char) => {
      if (char === " ") {
        return `<span class='default'>&nbsp;</span>`; // Use a non-breaking space for spaces
      } else if (char === "\n") {
        return `<br>`; // Handle line breaks explicitly if there are any
      } else {
        return `<span class='default'>${char}</span>`;
      }
    })
    .join("");
}

//to update the display
function updateDisplay() {
  const displayText = document.getElementById("displayText");
  const characters = displayText.querySelectorAll("span");
  characters?.forEach((char, index) => {
    if (index < currentIndex) {
      char.className =
        paragraph[index] === wordBox.value[index] ? "correct" : "incorrect";
    } else {
      char.className = "default";
    }
  });
}

// Handle keydown events to manage currentIndex
wordBox.addEventListener("keydown", (event) => {
  totalKeypress++;
  if (firstPress) {
    localStorage.setItem("startTime", new Date().getTime());
    firstPress = false;
    changeParagraph.style.display = "none";
  }
  if (event.key === "Backspace") {
    if (currentIndex > 0) {
      currentIndex--;
    }
  } else if (event.key.length === 1) {
    if (currentIndex < paragraph.length) {
      currentIndex++;
    }
  }
});
//to update the display when the user types
wordBox?.addEventListener("input", () => {
  const typedValue = wordBox.value[wordBox.value.length - 1];
  if (currentIndex > 0 && typedValue === paragraph[currentIndex - 1]) {
    correctKeypress++;
  }
  updateDisplay();
  if (currentIndex === paragraph.length) {
    endGame();
    return;
  }
});

function addLeaderBoard() {
  const leaderBoard = document.getElementById("leaderBoard");
  const leaders = JSON.parse(localStorage.getItem("leaders"));
  if (!leaders) {
    leaderBoard.innerHTML = "<p>No leaders yet</p>";
    return;
  }
  leaderBoard.innerHTML = Object.entries(leaders)
    .sort((a, b) => b[1].wpm - a[1].wpm)
    .map(([name, { wpm }], index) => {
      return `
      <p class="w-full flex items-center space-x-4 text-lg text-gray-700 bg-gray-100 p-4 rounded-lg shadow-md">
        <span class="font-bold text-indigo-600">${index + 1}.</span>
        <span class="font-medium">${name}</span>
        <span class="ml-auto text-green-600 font-semibold">${wpm} WPM</span>
      </p>
    `;
    })
    .join("");
}

// handle the end of the typing game

function endGame() {
  const { wpm, correctPercent } = calculateMetrics();
  let leaders = JSON.parse(localStorage.getItem("leaders")) || {};
  const name = JSON.parse(localStorage.getItem("currentUser"));
  leaders = {
    ...leaders,
    [name]: { wpm: Math.max(wpm, leaders[name]?.wpm || 0) },
  };
  localStorage.setItem("leaders", JSON.stringify(leaders));
  wordBox.disabled = true;
  restart.style.display = "block";
  addLeaderBoard();
  result.innerHTML = `Your typing speed is ${wpm} WPM and correctness score is ${correctPercent}%`;
}
//restart the game
restart?.addEventListener("click", () => {
  restartGame();
  restart.style.display = "none";
});

function restartGame() {
  const result = document.getElementById("result");
  currentIndex = 0;
  firstPress = true;
  wordBox.value = "";
  wordBox.disabled = false;
  result.innerHTML = "";
  changeParagraph.style.display = "block";
  totalKeypress = 0;
  correctKeypress = 0;
  setParagraph();
}

//to calculate the correctness and wpm of the user

function calculateMetrics() {
  const endTime = new Date().getTime();
  const startTime = localStorage.getItem("startTime");
  const timeTaken = (endTime - startTime) / 1000;
  const words = paragraph.split(" ").length;
  //wpm
  const wpm = Math.round((words / timeTaken) * 60);
  // correctness
  const correctPercent = Math.round(
    (correctKeypress / totalKeypress) * 100
  ).toFixed(2);
  return { wpm, correctPercent };
}

//change the paragraph
changeParagraph?.addEventListener("click", () => {
  setParagraph();
});
