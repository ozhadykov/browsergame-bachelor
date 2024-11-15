"use strict";
const mainMenu = document.getElementById("main-menu");
const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");
const Game = require("./game");
let myGame = new Game(ctx, canvas);



canvas.style.display = "none";

function mainmenu() {
    canvas.style.display = "block";
    mainMenu.style.display = "none";
    myGame.start();
}

document.getElementById("startbutton").onclick = mainmenu;
