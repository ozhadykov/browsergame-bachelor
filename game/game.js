"use strict"

const Player = require('./player.js')
const Platform = require("./platform")
const {
  canvas,
  ctx,
  pausedConstants,
  gameState,
  startedPressingJump,
  stoppedPressingJump,
  gameHelpers,
  floor,
  platform
} = require('./constants.js')


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
    pausedConstants.pressedPause = false; //Standard Pausemenü unsichtbar
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

    // listening to the keyboard events
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
      //Pause-Menü
      if (e.key === 'Escape') { //Pausenmenü öffnen
        pausedConstants.pressedPause = true
        showPauseMenu();
        //pausedConstants.pausedPlayerVelocityX = this.player.velocity.x
        this.player.velocity.x = 0
        //console.log("TestX")
      }
      if (e.key === 'Enter') { // Pausenmenü schließen
        pausedConstants.pressedPause = false
        closePauseMenu();
        //this.player.velocity.x = pausedConstants.pausedPlayerVelocityX
        //console.log("TestY")
        this.raf = window.requestAnimationFrame(this.tick.bind(this))
        console.log(this.player.velocity.x)
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
            if (gameState.lastPressedRight) {
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
  }


  stop() {
    window.cancelAnimationFrame(this.raf)
  }
  tick() {
    if(!pausedConstants.pressedPause) {
      //--- clear screen
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      // drawing elements
      this.player.update()

      //ctx.fillRect(300, 510, 120, 30)
      // handling player moving on x-axis
      if (this.player.velocity.x > 0) this.player.velocity.x -= 0.2
      if (this.player.velocity.x < 0) this.player.velocity.x += 0.2
      if (this.player.velocity.x < 0.2 && this.player.velocity.x > -0.2) this.player.velocity.x = 0
      if (this.keys.d.pressed && gameState.canJump) this.player.velocity.x = 5
      else if (this.keys.a.pressed && gameState.canJump) this.player.velocity.x = -5

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
        block.update()
      });

      // Zeichne alle platformblocks
      platformCollisionBlocks.forEach(block => {
        block.update()
      });

      //requestAnimationFrame(draw); // Für Animationsschleife

      // calling animation function again
      this.raf = window.requestAnimationFrame(this.tick.bind(this))
    }
  }
}

//Pause-Menü
function showPauseMenu() {
  canvas.style.display = "none"; // Spiel verschwindet
  pauseMenu.style.display = 'block'; // Pausenmenü sichtbar machen
  console.log("Test2")
}
function closePauseMenu() {
  pauseMenu.style.display = 'none'; // Pausenmenü unsichtbar machen
  canvas.style.display = 'block'; // Spiel wieder sichtbar
}
