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

<<<<<<< HEAD
document.getElementById("startbutton").onclick = mainmenu;
=======

document.getElementById("startbutton").onclick = mainmenu;
>>>>>>> 9abf33a999265e882724ecb040713d20e6567107
