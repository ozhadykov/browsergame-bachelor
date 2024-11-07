(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict"

const player = require('./player')
let playerdraw = new player()



//----------------------

module.exports = class Game {

    constructor() {}

    drawMenu() {

    }



    start() {
        let mycanvas = window.document.getElementById("mycanvas")

        let ctx = mycanvas.getContext('2d')

        playerdraw.drawPlayer(ctx, 1280 / 2, 720 / 2)
    }



    update() {

    }



    end() {

    }



    pause() {

    }



    updateFrames() {

    }
}

},{"./player":3}],2:[function(require,module,exports){
"use strict"
 
const Game = require("./game")
let myGame = new Game()
myGame.start()
},{"./game":1}],3:[function(require,module,exports){
"use strict"

module.exports = class Element {

    drawPlayer(ctx, x, y) {
        
        ctx.clear;
        ctx.beginPath();
        ctx.fillStyle = "#fca400";
        ctx.rect(x, y, 15, 15); 
        ctx.fill();
        ctx.closePath();
    }



    checkCollision(element) {

    }

}

},{}]},{},[2]);
