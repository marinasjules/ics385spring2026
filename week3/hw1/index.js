// Jules Marinas ICS 385
// Dicee Trio
// Roll dice and see who wins, but now it's 3 players + a button + nicer messages

// get references to important elements on the page
// generative AI helped me with this part
var rollBtn = document.getElementById("rollBtn");
var title = document.getElementById("title");
var guideText = document.getElementById("guideText");

// these are the 3 dice images
var diceImages = document.querySelectorAll("img");

// gives us a random number 1 to 6
// generative AI helped me with this part
function rollOneDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// updates the dice picture
// purely generative AI
function setDiceImage(imgElement, number) {
  imgElement.setAttribute("src", "images/dice" + number + ".png");
}

// when the player clicks the button, we play!
// purely generative AI
rollBtn.addEventListener("click", function () {
  // friendly message while rolling
  title.innerHTML = "Rolling... 🎲🎲🎲";
  guideText.innerHTML = "Good luck! Let's see who gets the biggest number.";

  // roll all 3 dice
  var p1 = rollOneDie();
  var p2 = rollOneDie();
  var p3 = rollOneDie();

  // update images on screen
  setDiceImage(diceImages[0], p1);
  setDiceImage(diceImages[1], p2);
  setDiceImage(diceImages[2], p3);

  // find the highest number rolled
  var highest = Math.max(p1, p2, p3);

  // count how many players got that highest number
  // (if more than 1 player has the highest, it's a draw)
  var highestCount = 0;

  if (p1 === highest) highestCount++;
  if (p2 === highest) highestCount++;
  if (p3 === highest) highestCount++;

  // decide winner (or draw)
  // purely generative AI
  if (highestCount > 1) {
    title.innerHTML = "🤝 It's a DRAW!";
    guideText.innerHTML =
      "Two (or more) players tied for the highest number. No winner this round!";
  } else {
    // only one person has the highest number, so we can declare a winner
    if (p1 === highest) {
      title.innerHTML = "🚩 Player 1 Wins!";
    } else if (p2 === highest) {
      title.innerHTML = "🚩 Player 2 Wins!";
    } else {
      title.innerHTML = "🚩 Player 3 Wins!";
    }

    guideText.innerHTML = "Nice! Click 'Roll Dice!' to play again.";
  }
});
