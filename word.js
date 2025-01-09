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
const clock = timer();
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
    clock.startTimer();
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
    endGame(30 - clock.time);
    clock.cleanup();
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

function endGame(timeTaken) {
  const { wpm, correctPercent } = calculateMetrics(timeTaken);
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
  result.innerHTML = `Your typing speed is ${wpm} WPM and accuracy is ${correctPercent}%`;
}
//restart the game
restart?.addEventListener("click", () => {
  restartGame();
  restart.style.display = "none";
});

function restartGame() {
  currentIndex = 0;
  firstPress = true;
  wordBox.value = "";
  wordBox.disabled = false;
  result.innerHTML = "";
  changeParagraph.style.display = "block";
  totalKeypress = 0;
  correctKeypress = 0;
  clock.cleanup();
  setParagraph();
}

//to calculate the correctness and wpm of the user
function calculateMetrics(timeTaken) {
  let words = 0;
  for (let i = 0; i <= currentIndex; i++) {
    if (i === paragraph.length) break;
    if (i === 0 && paragraph[i] === " ") continue;
    if (
      i == currentIndex &&
      i != paragraph.length - 1 &&
      paragraph[i + 1] === " "
    ) {
      //for the word at curent index
      words++;
      continue;
    }
    if (i == paragraph.length - 1) {
      words++;
      continue;
    }
    if (paragraph[i] === " ") {
      words++;
    }
  }
  //wpm
  const wpm = Math.round((words / timeTaken) * 60);
  // correctness
  totalKeypress--;
  console.log(totalKeypress, correctKeypress, words);
  const correctPercent = Math.round(
    (correctKeypress / totalKeypress) * 100
  ).toFixed(2);
  return { wpm, correctPercent };
}

//change the paragraph
changeParagraph?.addEventListener("click", () => {
  setParagraph();
});

//timer of 30s for the game

function timer() {
  let time = 30;
  const timerCount = document.getElementById("timer");
  let timeId;
  function startTimer() {
    timeId = setInterval(countdown, 1000);
  }
  function countdown() {
    if (time == -1) {
      endGame(30); //end the game
      cleanup();
    } else {
      time--;
      timerCount.textContent = `${time}s`;
    }
  }
  function cleanup() {
    time = 30;
    timerCount.textContent = `30s`;
    clearInterval(timeId);
  }
  return {
    get time() {
      return time;
    },
    startTimer,
    cleanup,
  };
}
