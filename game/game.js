"use strict"

const Player = require('./player.js')
const Platform = require("./platform")
const ElementList = require('./elementList')
const {
  floor,
  platforms,
} = require('./template.js')

module.exports = class Game {

  constructor(ctx, canvas) {
    // request animation frame handle
    this.raf = null
    this.canvas = canvas
    this.ctx = ctx
    this.elementList = null
    this.platform = null
  }


  start() {

    //fill all elements in element List:
    this.elementList = new ElementList()

    // adding player to element list
    this.elementList.add(new Player({
      position: {
        x: 100,
        y: 0
      },
      height: 50,
      width: 50,
    }))

    // this is important for animation purposes, do not need now
    this.timeOfLastFrame = Date.now()

    // here we are requiring window to reload to max framerate possible
    this.raf = window.requestAnimationFrame(this.tick.bind(this))

  }


  stop() {
    window.cancelAnimationFrame(this.raf)
  }

  tick() {
    //--- clear screen
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight)

    // drawing elements
    this.elementList.draw(this.ctx, this.canvas)

    this.elementList.action()

    // creating Map
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
    for (let i = 0; i < platforms.length; i += 32) {
      platformCollisions2D.push(platforms.slice(i, i + 32))
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
      block.draw(this.ctx)
    });

    // Zeichne alle platformblocks
    platformCollisionBlocks.forEach(block => {
      block.draw(this.ctx)
    });

    // calling animation function again
    this.raf = window.requestAnimationFrame(this.tick.bind(this))
  }
}
