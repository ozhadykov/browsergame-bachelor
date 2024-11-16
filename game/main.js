"use strict";

const mainMenu = document.getElementById("main-menu");

const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

const Game = require("./classes/game");
const myGame = new Game(ctx, canvas);

canvas.style.display = "none";

function goToMainMenu() {
    canvas.style.display = "block";
    mainMenu.style.display = "none";
    myGame.start(0);
}

document.getElementById("start-button").onclick = goToMainMenu;
