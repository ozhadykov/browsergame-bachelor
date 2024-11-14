"use strict"

const Player = require('./player.js')
const Platform = require("./platform")
const ElementList = require('./elementList')


module.exports = class Game {

  constructor() {
    // request animation frame handle
    this.raf = null
    this.player = null
    this.canvas = document.getElementById('mycanvas')
    this.ctx = this.canvas.getContext('2d')
    this.elementList = null
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

// drawing floor and platforms
  //teilt floorArray ist gleichlange Arrays der Canvasbreite   
  const floorCollisions2D = []
for (let i = 0; i < floor.length; i += 32) {
  floorCollisions2D.push(floor.slice(i, i + 32))
}

//teilt die gleichlangen Arrays der Canvasbreite in floor-platforms
const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new Platform({
          position: {
            x: x * 30,
            y: y * 30,
          },
        })
      )
    }
  })
})

//teilt platform-Array ist gleichlange Arrays der Canvasbreite   
const platformCollisions2D = []
for (let i = 0; i < platform.length; i += 32) {
  platformCollisions2D.push(platform.slice(i, i + 32))
}

//teilt die gleichlangen Arrays der Canvasbreite in platforms
const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      platformCollisionBlocks.push(
        new Platform({
          position: {
            x: x * 30,
            y: y * 30,
          },
        })
      )
    }
  })
})
  
  // Zeichne alle floorblocks
  collisionBlocks.forEach(block => {
      block.draw(ctx); 
  });
  
  // Zeichne alle platformblocks
    platformCollisionBlocks.forEach(block => {
      block.draw(ctx); 
  });
    
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
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)

    // drawing elements
    this.player.draw(this.ctx, this.canvas)

    this.ctx.fillRect(300, 510, 120, 30)
    this.player.action()

    // calling animation function again
  
     // calling animation function again
    this.raf = window.requestAnimationFrame(this.tick.bind(this))
  }
}
