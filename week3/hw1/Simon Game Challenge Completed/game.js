/* 
  Simon Game (Beginner Friendly)
  NOTE: AI-generated comments are labeled: "AI-GENERATED COMMENT (GPT): ..."
*/

const buttonColours = ["red", "blue", "green", "yellow"];

let gamePattern = [];
let userClickedPattern = [];

let level = 0;
let mode = "idle"; // idle | tutorial | game
let acceptingInput = false;

let strictMode = false;
let hintUsedThisLevel = false;

// Tutorial Level 0 (NEW LEVEL ADDED)
// AI-GENERATED COMMENT (GPT): This is a separate "Level 0" that teaches controls before Level 1.
const tutorialSequence = ["green", "red", "yellow", "blue"];
let tutorialStep = 0;

// Speed control (affects playback timing)
let stepDelayMs = 550;

$(function () {
  showHelpModal();

  // UI controls
  $("#startBtn").on("click", () => startTutorial());
  $("#restartBtn").on("click", () => restartGame());
  $("#hintBtn").on("click", () => useHint());

  $("#strictToggle").on("change", function () {
    strictMode = this.checked;
    setStatus(strictMode ? "Strict mode ON: mistakes restart from Level 1." : "Strict mode OFF: you can retry a level after a mistake.");
  });

  $("#speedSelect").on("change", function () {
    stepDelayMs = speedToDelay(this.value);
    setStatus(`Speed set to ${this.value}.`);
  });

  $("#modalStartTutorialBtn").on("click", () => {
    hideHelpModal();
    startTutorial();
  });

  $("#modalSkipBtn").on("click", () => {
    hideHelpModal();
    startGame();
  });

  // Button clicks
  $(".btn").on("click", function () {
    if (!acceptingInput) return;

    const userChosenColour = $(this).attr("id");
    handleUserInput(userChosenColour);
  });

  // Keyboard support (R/B/G/Y)
  $(document).on("keydown", function (e) {
    const key = e.key.toUpperCase();
    const map = { R: "red", B: "blue", G: "green", Y: "yellow" };
    if (map[key] && acceptingInput) handleUserInput(map[key]);
  });
});

function speedToDelay(speed) {
  if (speed === "easy") return 700;
  if (speed === "hard") return 420;
  return 550; // normal
}

function showHelpModal() {
  $("#helpModal").removeClass("hidden");
}

function hideHelpModal() {
  $("#helpModal").addClass("hidden");
}

function setTitle(text) {
  $("#level-title").text(text);
}

function setStatus(text) {
  $("#status").text(text);
}

function startTutorial() {
  mode = "tutorial";
  level = 0;
  tutorialStep = 0;
  userClickedPattern = [];
  gamePattern = [];

  $("#restartBtn").prop("disabled", false);
  $("#hintBtn").prop("disabled", true);

  setTitle("Tutorial — Level 0");
  setStatus("Click the highlighted button to learn each color (Step 1 of 4).");

  promptTutorialStep();
}

function promptTutorialStep() {
  acceptingInput = true;

  const target = tutorialSequence[tutorialStep];

  // AI-GENERATED COMMENT (GPT): We “highlight” the target button so beginners know what to click.
  flashButton(target);

  setStatus(`Tutorial: click the highlighted button (Step ${tutorialStep + 1} of 4).`);
}

function handleUserInput(colour) {
  playSound(colour);
  animatePress(colour);

  if (mode === "tutorial") {
    checkTutorial(colour);
    return;
  }

  if (mode === "game") {
    userClickedPattern.push(colour);
    updateProgressText();
    checkAnswer(userClickedPattern.length - 1);
  }
}

function checkTutorial(colour) {
  const expected = tutorialSequence[tutorialStep];

  if (colour === expected) {
    tutorialStep++;

    if (tutorialStep >= tutorialSequence.length) {
      acceptingInput = false;
      setStatus("Nice! Tutorial complete. Starting Level 1...");
      setTimeout(() => startGame(), 900);
      return;
    }

    acceptingInput = false;
    setStatus("Good! Next one...");
    setTimeout(() => {
      acceptingInput = true;
      promptTutorialStep();
    }, 600);
  } else {
    // Friendly feedback for beginners
    setStatus(`Not quite — try again. (Hint: look for the highlighted button.)`);
    flashButton(expected);
  }
}

function startGame() {
  mode = "game";
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  hintUsedThisLevel = false;

  $("#hintBtn").prop("disabled", false);
  $("#restartBtn").prop("disabled", false);

  setStatus("Watch the pattern. Then repeat it.");
  nextSequence();
}

function restartGame() {
  $("body").removeClass("game-over");
  setStatus("Restarted. Starting tutorial again (Level 0).");
  startTutorial();
}

function nextSequence() {
  userClickedPattern = [];
  hintUsedThisLevel = false;

  level++;
  setTitle(`Level ${level}`);
  setStatus("Watch the pattern…");

  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  playSequence(gamePattern, () => {
    acceptingInput = true;
    setStatus("Your turn! Repeat the pattern.");
    updateProgressText();
  });
}

function playSequence(sequence, doneCallback) {
  acceptingInput = false;

  // AI-GENERATED COMMENT (GPT): We play the pattern step-by-step using timeouts.
  sequence.forEach((colour, index) => {
    setTimeout(() => {
      flashButton(colour);
      playSound(colour);
    }, stepDelayMs * (index + 1));
  });

  setTimeout(() => {
    doneCallback();
  }, stepDelayMs * (sequence.length + 1));
}

function useHint() {
  if (mode !== "game") return;

  if (hintUsedThisLevel) {
    setStatus("Hint already used this level. Try your best!");
    return;
  }

  hintUsedThisLevel = true;
  setStatus("Hint: replaying the pattern…");
  playSequence(gamePattern, () => {
    acceptingInput = true;
    setStatus("Your turn again!");
    updateProgressText();
  });
}

function updateProgressText() {
  if (mode !== "game") return;

  const progress = userClickedPattern.length;
  const total = gamePattern.length;
  // Example: "Progress: 2 / 4"
  $("#status").text(`Your turn: Progress ${progress} / ${total}${hintUsedThisLevel ? " (Hint used)" : ""}`);
}

function checkAnswer(currentIndex) {
  if (gamePattern[currentIndex] === userClickedPattern[currentIndex]) {
    // Completed the whole sequence correctly
    if (userClickedPattern.length === gamePattern.length) {
      acceptingInput = false;
      setStatus("Correct! Next level coming up…");
      setTimeout(() => nextSequence(), 850);
    }
  } else {
    handleMistake();
  }
}

function handleMistake() {
  playSound("wrong");
  $("body").addClass("game-over");
  setTimeout(() => $("body").removeClass("game-over"), 250);

  if (strictMode) {
    setTitle("Game Over");
    setStatus("Strict mode: restarting from Level 1. Click Start to try again!");
    mode = "idle";
    acceptingInput = false;
    $("#hintBtn").prop("disabled", true);
    return;
  }

  // Non-strict: retry the same level
  // AI-GENERATED COMMENT (GPT): Let beginners retry without wiping all progress.
  setStatus("Oops — try again! Replaying the pattern…");
  userClickedPattern = [];

  playSequence(gamePattern, () => {
    acceptingInput = true;
    setStatus("Your turn! Repeat the pattern.");
    updateProgressText();
  });
}

function flashButton(colour) {
  const $btn = $("#" + colour);
  $btn.addClass("flash");
  setTimeout(() => $btn.removeClass("flash"), 200);
}

function animatePress(colour) {
  $("#" + colour).addClass("pressed");
  setTimeout(() => $("#" + colour).removeClass("pressed"), 120);
}

function playSound(name) {
  // Make sure your sounds folder includes: red.mp3 blue.mp3 green.mp3 yellow.mp3 wrong.mp3
  const audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}
