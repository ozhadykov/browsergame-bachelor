"use strict"

const {
  gameConstants,
  ctx,
  gameState
} = require('./constants.js')

const startedPressingJump = () => {
  gameHelpers.startTime = Date.now()
}

const stoppedPressingJump = () => {
  gameHelpers.endTime = Date.now()
}

module.exports = class Player extends element {

  constructor(params) {
    this.position = params.position;
    this.velocity = {
      x: 0,
      y: 1
    }
    this.height = params.height;
    this.width = params.width;
  }

action() {
  
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'd':
        this.keys.d.pressed = true,
        gameState.lastPressedRight = true
        break
      case 'a':
        this.keys.a.pressed = true,
        gameState.lastPressedRight = false
        break
      case 'w':
        if (!this.keys.w.pressed && gameState.canJump && !gameState.inJump) {
          startedPressingJump()
          gameState.inJump = true
          this.keys.w.pressed = true
        }
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
      case 'w':
        if (gameState.canJump && gameState.inJump) {
          this.keys.w.pressed = false
          stoppedPressingJump()
          console.log('end time var', gameHelpers.endTime - gameHelpers.startTime)
          console.log(Date.now() - gameHelpers.startTime)
          gameHelpers.jumpDuration = gameHelpers.endTime - gameHelpers.startTime
          this.player.velocity.y = -8 * (gameHelpers.jumpDuration * 0.005)
          if(gameState.lastPressedRight) {
            this.player.velocity.x = gameHelpers.jumpDuration * 0.05
          } else {
            this.player.velocity.x = -(gameHelpers.jumpDuration * 0.05)
          }
          
          // jump
          gameState.inJump = false
          
        }
        break
    }
  })


    if (this.player.velocity.x > 0) this.player.velocity.x -= 0.2
    if (this.player.velocity.x < 0) this.player.velocity.x += 0.2
    if (this.player.velocity.x < 0.2 && this.player.velocity.x > -0.2) this.player.velocity.x = 0
    if (this.keys.d.pressed && gameState.canJump) this.player.velocity.x = 5
    else if (this.keys.a.pressed && gameState.canJump) this.player.velocity.x = -5
  }


  

  @Override
  draw() {

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
    super.checkForHorizontalCollisions()
    this.applyGravity()
    super.checkForVerticalCollisions()
  }

  applyGravity() {
    this.position.y += this.velocity.y
    this.velocity.y += gameConstants.gravity
  }
}
