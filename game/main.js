"use strict";

const mainMenu = document.getElementById("main-menu");
const pauseMenu = document.getElementById("pausemenu");

const Game = require("./classes/game");
const Player = require("./classes/player");
const myGame = Game.getInstance();

console.log(myGame)

myGame.canvas.style.display = "none";

function goToMainMenu() {
    myGame.canvas.style.display = "block";
    mainMenu.style.display = "none";
    myGame.start(0);
}
function closingpauseMenu()    {
    myGame.closePauseMenu()
    myGame.player.keys.pause.pressed = false
}

document.getElementById("start-button").onclick = goToMainMenu;
document.getElementById("continueButton").onclick = closingpauseMenu

