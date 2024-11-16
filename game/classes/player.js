"use strict"

const startedPressingJump = () => {
  gameHelpers.startTime = Date.now()
}

const stoppedPressingJump = () => {
  gameHelpers.endTime = Date.now()
}

const gravity = 0.5


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

const BaseGameElement = require('./element.js')

module.exports = class Player extends BaseGameElement {

  constructor(params) {
    super(params)
    this.velocity = {
      x: 0,
      y: 1
    }
    this.lastPressedRight = false
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
            this.velocity.y = -8 * (gameHelpers.jumpDuration * 0.005)
            if (gameState.lastPressedRight) {
              this.velocity.x = gameHelpers.jumpDuration * 0.05
            } else {
              this.velocity.x = -(gameHelpers.jumpDuration * 0.05)
            }

            // jump
            gameState.inJump = false

          }
          break
      }
    })


    if (this.velocity.x > 0) this.velocity.x -= 0.2
    if (this.velocity.x < 0) this.velocity.x += 0.2
    if (this.velocity.x < 0.2 && this.velocity.x > -0.2) this.velocity.x = 0
    if (this.keys.d.pressed && gameState.canJump) this.velocity.x = 5
    else if (this.keys.a.pressed && gameState.canJump) this.velocity.x = -5
  }

  checkCollisions(ctx, canvas) {
    // simple checking, because we will use soon something better :)
    if (this.position.y + this.height + this.velocity.y > canvas.height) {
      this.velocity.y = 0
      gameState.canJump = true
    } else
      gameState.canJump = false
    if (this.position.x + this.velocity.x < 0) {
      this.position.x = 0;
      this.velocity.x = -this.velocity.x
    }
    if (this.position.x + this.width + this.velocity.x > canvas.width) {
      this.velocity.x = -this.velocity.x
      this.position.x = canvas.width - this.width
    }

    if (this.position.x + this.velocity.x < 0) {
      this.position.x = 0;
      this.velocity.x = 0
    }
    if (this.position.x + this.width + this.velocity.x > canvas.width) {
      this.velocity.x = 0
      this.position.x = canvas.width - this.width
    }

  }


  draw(ctx, canvas) {

    ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
    if (gameState.lastPressedRight) {
      ctx.fillRect(this.position.x + (this.width - 2 * (this.width / 5)), this.position.y + this.height / 5, this.width / 5, this.height / 5)
    } else {
      ctx.fillRect(this.position.x + this.width / 5, this.position.y + this.height / 5, this.width / 5, this.height / 5)
    }


    // we will use it when we will get our game graphics
    //this.draw();

    this.position.x += this.velocity.x
    this.checkCollisions(ctx, canvas)
    this.applyGravity()
    //checkForVerticalCollisions()
  }

  applyGravity() {
    this.position.y += this.velocity.y
    this.velocity.y += gravity
  }
}
