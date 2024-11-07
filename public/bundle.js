(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const gameConstants = {
  width: 960,
  height: 540,
  gravity: 0.5
}

const canvas = document.getElementById('my-canvas')
const ctx = canvas.getContext('2d')

module.exports = { gameConstants, canvas, ctx };
},{}],2:[function(require,module,exports){
"use strict"

const Player = require('./player.js')
const {canvas, ctx} = require('./constants.js')

module.exports = class Game {

  constructor() {
    // request animation frame handle
    this.raf = null
    this.player = null
    this.keys = {
      d: {
        pressed: false,
      },
      a: {
        pressed: false,
      }
    }
  }


  start() {
    // this is important for animation purposes, do not need now
    this.timeOfLastFrame = Date.now()

    // here we are requiring window to reload to max framerate possible
    this.raf = window.requestAnimationFrame(this.tick.bind(this))

    // creating Player instance
    this.player = new Player({
      position: {
        x: 100,
        y: 0
      },
      height: 100,
      width: 100,
    })

    // listening to the keyboard events
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'd':
          this.keys.d.pressed = true
          break
        case 'a':
          this.keys.a.pressed = true
          break
        case 'w':
          this.player.velocity.y = -8
          break
      }
    })

    window.addEventListener('keyup', (evt) => {
      switch (evt.key) {
        case 'd':
          this.keys.d.pressed = false
          break
        case 'a':
          this.keys.a.pressed = false
          break
      }
    })
  }


  stop() {
    window.cancelAnimationFrame(this.raf)
  }

  tick() {
    //const myCanvas = window.document.getElementById("my-canvas")
    //const ctx = myCanvas.getContext('2d')

    //--- clear screen
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // drawing elements
    this.player.update()

    // handling player moving on x-axis
    this.player.velocity.x = 0
    if (this.keys.d.pressed) this.player.velocity.x = 5
    else if (this.keys.a.pressed) this.player.velocity.x = -5

    // calling animation function again
    this.raf = window.requestAnimationFrame(this.tick.bind(this))
  }
}
},{"./constants.js":1,"./player.js":4}],3:[function(require,module,exports){
"use strict"

const Game = require("./game")
let myGame = new Game()
myGame.start()

},{"./game":2}],4:[function(require,module,exports){
"use strict"

const {gameConstants, ctx} = require('./constants.js')

module.exports = class Player {

  constructor(params) {
    this.position = params.position;
    this.velocity = {
      x: 0,
      y: 1
    }
    this.height = params.height;
    this.width = params.width;
  }

  draw() {
  }

  update() {

    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)

    // we will use it when we will get our game graphics
    //this.draw();

    this.position.x += this.velocity.x
    this.checkForHorizontalCollisions()
    this.applyGravity()
    this.checkForVerticalCollisions()
  }

  applyGravity() {
    this.position.y += this.velocity.y
    this.velocity.y += gameConstants.gravity
  }

  checkForVerticalCollisions() {
    // simple checking, because we will use soon something better :)
    if (this.position.y + this.height + this.velocity.y > gameConstants.height) {
      this.velocity.y = 0
    }
  }

  checkForHorizontalCollisions() {
    // simple checking, because we will use soon something better :)
    if (this.position.x + this.width + this.velocity.x > gameConstants.width ||
      this.position.x + this.width + this.velocity.x < gameConstants.width) {
      this.velocity.x = 0
    }
  }

}

},{"./constants.js":1}]},{},[3]);
