"use strict";
const mainmenu1 = document.getElementById("mainmenu");
const pauseMenu = document.getElementById("pausemenu");
const mycanvas = document.getElementById("mycanvas"); 
const Game = require("./game");
let myGame = new Game();

mycanvas.style.display = "none"; 

function mainmenu() {
    mycanvas.style.display = "block";
    mainmenu1.style.display = "none"; 
    myGame.start();
}


document.getElementById("startbutton").onclick = mainmenu;