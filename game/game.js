"use strict"

const Player = require('./player.js')
<<<<<<< Updated upstream
const {
  canvas,
  ctx,
  gameState,
  startedPressingJump,
  stoppedPressingJump,
  gameHelpers
} = require('./constants.js')
=======
const Platform = require("./platform")
const ElementList = require('./elementList')
const gameConstants = {
  canvasWidth: 960,
  canvasHeight: 540,
  gravity: 0.5
}

const gameState = {
  canJump: true,
  inJump: false,
  lastPressedRight: true,
}

const gameHelpers = {
  startTime: null,
  endTime: null,
  jumpDuration: null, 
}

const canvas = document.getElementById('mycanvas')
const ctx = canvas.getContext('2d')
>>>>>>> Stashed changes

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
      },
      w: {
        pressed: false,
      }
    }
  }


  start() {
    //fill all elements in element List:
    this.elementList = new ElementList()
  /*   for(int i = 0; i <= ; i++) {
        this.elementList.add(new )
    } */

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
      height: 50,
      width: 50,
    })

    // only debugging
    const debugBtn = document.getElementById('show-state')
    debugBtn.addEventListener('click', () => {
      console.log(gameState)
      console.log(this.keys)
      console.log('test')
      console.log(gameHelpers.jumpDuration)
    })
  }


  stop() {
    window.cancelAnimationFrame(this.raf)
  }

  tick() {
    //--- clear screen
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

    // drawing elements
    this.player.draw()()

<<<<<<< Updated upstream
    ctx.fillRect(300, 510, 120, 30)
    // handling player moving on x-axis
    if (this.player.velocity.x > 0) this.player.velocity.x -= 0.2
    if (this.player.velocity.x < 0) this.player.velocity.x += 0.2
    if (this.player.velocity.x < 0.2 && this.player.velocity.x > -0.2) this.player.velocity.x = 0
    if (this.keys.d.pressed && gameState.canJump) this.player.velocity.x = 5
    else if (this.keys.a.pressed && gameState.canJump) this.player.velocity.x = -5

    // calling animation function again
=======
  
     // calling animation function again
>>>>>>> Stashed changes
    this.raf = window.requestAnimationFrame(this.tick.bind(this))
  }
}
