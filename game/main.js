"use strict";

const mainMenu = document.getElementById("main-menu");
const pauseMenu = document.getElementById("pausemenu");

const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

const Game = require("./classes/game");
const Player = require("./classes/player");
const myGame = new Game(ctx, canvas);

canvas.style.display = "none";

function goToMainMenu() {
    canvas.style.display = "block";
    mainMenu.style.display = "none";
    myGame.start(0);
}
function closingpauseMenu()    {
    myGame.closePauseMenu()
    myGame.player.keys.pause.pressed = false
}

document.getElementById("start-button").onclick = goToMainMenu;
document.getElementById("continueButton").onclick = closingpauseMenu

