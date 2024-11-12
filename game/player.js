"use strict"

const {
  gameConstants,
  ctx,
  gameState
} = require('./constants.js')

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
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    if (gameState.lastPressedRight) {
      ctx.fillRect(this.position.x + (this.width - 2 * (this.width/5)), this.position.y + this.height/5, this.width/5, this.height/5)
    } else {
      ctx.fillRect(this.position.x + this.width/5, this.position.y + this.height/5, this.width/5, this.height/5)
    }
    

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
    if (this.position.y + this.height + this.velocity.y > gameConstants.canvasHeight) {
      this.velocity.y = 0
      gameState.canJump = true
    } else
      gameState.canJump = false

  }

  checkForHorizontalCollisions() {
    // simple checking, because we will use soon something better :)
    if (!gameState.canJump) {
      if (this.position.x + this.velocity.x < 0) {
        this.position.x = 0;
        this.velocity.x = -this.velocity.x
      }
      if (this.position.x + this.width + this.velocity.x > gameConstants.canvasWidth) {
        this.velocity.x = -this.velocity.x
        this.position.x = gameConstants.canvasWidth - this.width
      }  
    } else {
      if (this.position.x + this.velocity.x < 0) {
        this.position.x = 0;
        this.velocity.x = 0
      }
      if (this.position.x + this.width + this.velocity.x > gameConstants.canvasWidth) {
        this.velocity.x = 0
        this.position.x = gameConstants.canvasWidth - this.width
      }  
    }
  } 
}
